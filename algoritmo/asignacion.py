"""Coordinación global (Niveles 1 a 7).

1. Orden: sorteo con semilla, reordenado para que los estudiantes de cada
   componente conexa del grafo de amistad queden seguidos (así los amigos se
   encuentran: el segundo ya ve al primero inscrito).
2. Ronda de prioritarias: cada estudiante, en orden, inscribe solo sus clases
   prioritarias con su PD y se descuentan los cupos.
3. Ronda de no prioritarias: cada estudiante, en el mismo orden, inscribe sus
   clases no prioritarias con ``firma_inicial`` = horas que ya ocupó en la
   ronda 1, así que nunca se cruzan con lo ya asignado.
4. Fase de mejora (best-response): para cada estudiante se liberan sus cupos,
   se recalcula su PD con todas sus clases y los demás fijos, y se acepta el
   nuevo horario solo si mejora el puntaje global. Se repite hasta que una
   pasada no mejore nada o hasta ``pasadas_mejora`` pasadas.

Antes de cada PD se calcula el bono de compañeros de cada curso según quién
está inscrito en ese momento (``companeros.py``).

Las rondas garantizan que ninguna clase no prioritaria de un estudiante le
quite el cupo a una prioritaria de otro. La fase de mejora no rompe esto: un
estudiante solo puede usar sus propios cupos o cupos libres, así que nadie más
pierde clases; además le permite reacomodar sus prioritarias para que le quepan
las no prioritarias (algo que la ronda 1 no veía).

Puntaje global = suma de los puntajes ``(prioritarias, no_prioritarias,
satisfaccion)`` de todos, calculados con el horario final de todos.

Complejidad: O((2 + P) · S · ∏(k_i + 1) · k · C), con S estudiantes y P
pasadas de mejora: lineal en S. No es un óptimo global (ese problema es
NP-difícil).
"""

import random
from collections.abc import Callable
from dataclasses import dataclass

from algoritmo.cercania import Campus, penalizacion_cursos
from algoritmo.companeros import construir_red, ordenar_por_componentes, satisfaccion_companeros
from algoritmo.franjas import mascara_franjas, satisfaccion_franjas
from algoritmo.huecos import penalizacion_huecos
from algoritmo.modelos import Curso, Estudiante, PreferenciaClase
from algoritmo.pd_estudiante import CERO, Puntaje, formato, mejor_horario, sumar
from algoritmo.profesores import calificaciones, satisfaccion_profesor

EPSILON = 1e-9  # tolerancia para comparar satisfacciones (son floats)


def es_mejor(a: Puntaje, b: Puntaje) -> bool:
    """``a > b`` lexicográfico, con tolerancia en la satisfacción."""
    if a[:2] != b[:2]:
        return a[:2] > b[:2]
    return a[2] > b[2] + EPSILON


@dataclass
class ResultadoAsignacion:
    horarios: dict[int, list[Curso]]  # id estudiante → cursos asignados
    no_asignadas: dict[int, list[PreferenciaClase]]  # id estudiante → clases sin inscribir
    puntajes: dict[int, Puntaje]  # id estudiante → (prioritarias, no_prioritarias, satisfaccion) final
    cupos_restantes: dict[int, int]  # id curso → cupos que quedaron
    orden: list[int]  # ids de estudiantes en el orden en que se procesaron
    entradas_tabla: int  # suma de los estados de todas las PD
    mejoras: int = 0  # cambios aceptados en la fase de mejora
    pasadas: int = 0  # pasadas de mejora realizadas

    @property
    def clases_asignadas(self) -> int:
        return sum(len(c) for c in self.horarios.values())

    @property
    def clases_solicitadas(self) -> int:
        return self.clases_asignadas + sum(len(c) for c in self.no_asignadas.values())

    @property
    def prioritarias_asignadas(self) -> int:
        return sum(p[0] for p in self.puntajes.values())

    @property
    def prioritarias_solicitadas(self) -> int:
        sin_asignar = sum(p.prioridad for ps in self.no_asignadas.values() for p in ps)
        return self.prioritarias_asignadas + sin_asignar

    @property
    def satisfaccion_promedio(self) -> float:
        """Satisfacción promedio por clase asignada (franjas + profesor + compañeros − cercanía − huecos)."""
        asignadas = self.clases_asignadas
        return sum(p[2] for p in self.puntajes.values()) / asignadas if asignadas else 0.0

    @property
    def puntaje_global(self) -> Puntaje:
        total = CERO
        for p in self.puntajes.values():
            total = sumar(total, p)
        return total


def asignar_horarios(
    estudiantes: list[Estudiante],
    semilla: int | None = None,
    traza: Callable[[str], None] | None = None,
    pasadas_mejora: int = 5,
) -> ResultadoAsignacion:
    """Asigna horarios a todos los estudiantes (rondas + fase de mejora).

    Con la misma semilla el resultado es siempre el mismo. No modifica los
    objetos de entrada. ``traza`` (opcional) recibe una línea por paso.
    ``pasadas_mejora`` = 0 desactiva la fase de mejora.
    """
    red = construir_red(estudiantes)
    por_id = {e.id: e for e in estudiantes}
    preferencias = {e.id: e.preferencias_de_clase() for e in estudiantes}
    # id estudiante → id curso → preferencia de la clase a la que pertenece
    clase_del_curso = {e.id: {c.id: p for p in preferencias[e.id] for c in p.clase.cursos} for e in estudiantes}
    franjas = {e.id: mascara_franjas(e.preferencias.franjas_habilitadas) for e in estudiantes}
    calif = {e.id: calificaciones(e.preferencias.preferencia_profes) for e in estudiantes}

    cupos: dict[int, int] = {}
    for e in estudiantes:
        for p in preferencias[e.id]:
            for curso in p.clase.cursos:
                cupos.setdefault(curso.id, curso.cupo)
    # Nivel 6: edificios y distancias, una sola vez para todos (misma normalización).
    campus = Campus([c for e in estudiantes for p in preferencias[e.id] for c in p.clase.cursos])

    horarios: dict[int, list[Curso]] = {e.id: [] for e in estudiantes}
    inscritos: dict[int, set[int]] = {c: set() for c in cupos}  # id curso → ids de estudiantes
    entradas = 0

    def nombre(e: Estudiante) -> str:
        return e.nombre or str(e.id)

    def inscribir(e: Estudiante, cursos: list[Curso]) -> None:
        for c in cursos:
            cupos[c.id] -= 1
            inscritos[c.id].add(e.id)
        horarios[e.id] += cursos

    def liberar(e: Estudiante) -> list[Curso]:
        viejos = horarios[e.id]
        for c in viejos:
            cupos[c.id] += 1
            inscritos[c.id].discard(e.id)
        horarios[e.id] = []
        return viejos

    def bono_companeros(e: Estudiante) -> dict[int, float]:
        """Bono de compañeros de cada curso que e podría tomar, con los inscritos actuales."""
        if not red.vecinos(e.id):
            return {}
        return {
            c.id: satisfaccion_companeros(e.id, p.clase.id, inscritos[c.id] - {e.id}, red)
            for p in preferencias[e.id]
            for c in p.clase.cursos
        }

    def correr_pd(e: Estudiante, pedidas: list[PreferenciaClase], firma_inicial: int):
        nonlocal entradas
        resultado = mejor_horario(
            pedidas,
            cupos,
            firma_inicial=firma_inicial,
            franjas_habilitadas=e.preferencias.franjas_habilitadas,
            preferencia_profes=e.preferencias.preferencia_profes,
            bono_companeros=bono_companeros(e),
            preferencia_cercania=e.preferencias.preferencia_cercania,
            cursos_fijos=horarios[e.id],
            campus=campus,
            preferencia_sin_huecos=e.preferencias.preferencia_sin_huecos,
        )
        entradas += resultado.entradas_tabla
        return resultado

    def puntaje_de(e_id: int) -> Puntaje:
        """Puntaje de un estudiante con los horarios actuales de todos."""
        prio = no_prio = 0
        satisf = 0.0
        for c in horarios[e_id]:
            p = clase_del_curso[e_id][c.id]
            prio += p.prioridad
            no_prio += not p.prioridad
            satisf += (
                satisfaccion_franjas(c, franjas[e_id])
                + satisfaccion_profesor(c, calif[e_id])
                + satisfaccion_companeros(e_id, p.clase.id, inscritos[c.id] - {e_id}, red)
            )
        if por_id[e_id].preferencias.preferencia_cercania:
            satisf -= penalizacion_cursos(horarios[e_id], campus)
        if por_id[e_id].preferencias.preferencia_sin_huecos:
            mascara = 0
            for c in horarios[e_id]:
                mascara |= c.mascara
            satisf -= penalizacion_huecos(mascara)
        return (prio, no_prio, satisf)

    def puntaje_de_grupo(ids: set[int]) -> Puntaje:
        total = CERO
        for i in ids:
            total = sumar(total, puntaje_de(i))
        return total

    # 1. Orden: sorteo + componentes de amistad seguidas.
    orden = list(estudiantes)
    random.Random(semilla).shuffle(orden)
    orden = ordenar_por_componentes(orden, red)
    if traza is not None:
        traza(f"Orden (sorteo con semilla {semilla}, amigos seguidos): {', '.join(nombre(e) for e in orden)}")

    # 2 y 3. Rondas de prioritarias y no prioritarias.
    for ronda, prioritaria in ((1, True), (2, False)):
        if traza is not None:
            traza(f"\nRonda {ronda}: clases {'prioritarias' if prioritaria else 'no prioritarias'}")
        for e in orden:
            pedidas = [p for p in preferencias[e.id] if p.prioridad == prioritaria]
            if not pedidas:
                continue
            firma = 0
            for c in horarios[e.id]:
                firma |= c.mascara
            resultado = correr_pd(e, pedidas, firma)
            inscribir(e, resultado.cursos)
            if traza is not None:
                asignados = ", ".join(f"{c.codigo} (quedan {cupos[c.id]})" for c in resultado.cursos) or "—"
                faltan = ", ".join(p.clase.nombre for p in resultado.no_asignadas)
                traza(f"  {nombre(e)}: {asignados}" + (f" | sin asignar: {faltan}" if faltan else ""))

    # 4. Fase de mejora (best-response).
    mejoras = pasadas = 0
    for pasadas in range(1, pasadas_mejora + 1):
        if traza is not None:
            traza(f"\nFase de mejora, pasada {pasadas}:")
        hubo_mejora = False
        for e in orden:
            if not preferencias[e.id]:
                continue
            afectados = {e.id} | red.vecinos(e.id)
            antes = puntaje_de_grupo(afectados)
            viejos = liberar(e)
            resultado = correr_pd(e, preferencias[e.id], 0)
            inscribir(e, resultado.cursos)
            despues = puntaje_de_grupo(afectados)
            if es_mejor(despues, antes):
                mejoras += 1
                hubo_mejora = True
                if traza is not None:
                    traza(f"  {nombre(e)}: {', '.join(c.codigo for c in viejos) or '—'}"
                          f" → {', '.join(c.codigo for c in resultado.cursos) or '—'}"
                          f"   (afectados {formato(antes)} → {formato(despues)})")
            else:
                liberar(e)
                inscribir(e, viejos)
        if not hubo_mejora:
            if traza is not None:
                traza("  sin cambios: termina la fase de mejora")
            break

    puntajes = {e.id: puntaje_de(e.id) for e in estudiantes}
    no_asignadas = {}
    for e in estudiantes:
        tomadas = {clase_del_curso[e.id][c.id].clase.id for c in horarios[e.id]}
        no_asignadas[e.id] = [p for p in preferencias[e.id] if p.clase.id not in tomadas]

    return ResultadoAsignacion(
        horarios=horarios,
        no_asignadas=no_asignadas,
        puntajes=puntajes,
        cupos_restantes=cupos,
        orden=[e.id for e in orden],
        entradas_tabla=entradas,
        mejoras=mejoras,
        pasadas=pasadas,
    )

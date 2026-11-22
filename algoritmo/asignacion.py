"""Coordinación global (Niveles 1 a 4).

Los estudiantes se procesan en un orden fijo (sorteo con semilla), en dos
rondas:

1. Ronda de prioritarias: cada estudiante, en orden, inscribe solo sus clases
   prioritarias con su PD y se descuentan los cupos.
2. Ronda de no prioritarias: cada estudiante, en el mismo orden, inscribe sus
   clases no prioritarias con ``firma_inicial`` = horas que ya ocupó en la
   ronda 1, así que nunca se cruzan con lo ya asignado.

Así ninguna clase no prioritaria de un estudiante le quita el cupo a una
clase prioritaria de otro.

Complejidad: O(2 · S · ∏(k_i + 1) · k), con S estudiantes: lineal en S.
No es un óptimo global (ese problema es NP-difícil): es óptimo para cada
estudiante dado lo que dejaron los anteriores.
"""

import random
from collections.abc import Callable
from dataclasses import dataclass

from algoritmo.modelos import Curso, Estudiante, PreferenciaClase
from algoritmo.pd_estudiante import CERO, Puntaje, mejor_horario, sumar


@dataclass
class ResultadoAsignacion:
    horarios: dict[int, list[Curso]]  # id estudiante → cursos asignados (ambas rondas)
    no_asignadas: dict[int, list[PreferenciaClase]]  # id estudiante → clases sin inscribir
    puntajes: dict[int, Puntaje]  # id estudiante → (prioritarias, no_prioritarias, satisfaccion)
    cupos_restantes: dict[int, int]  # id curso → cupos que quedaron
    orden: list[int]  # ids de estudiantes en el orden en que se procesaron
    entradas_tabla: int  # suma de los estados de todas las PD

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
    def satisfaccion_promedio(self) -> float:
        """Satisfacción promedio por clase asignada (franjas + profesor, 0–2)."""
        asignadas = self.clases_asignadas
        return sum(p[2] for p in self.puntajes.values()) / asignadas if asignadas else 0.0

    @property
    def prioritarias_solicitadas(self) -> int:
        sin_asignar = sum(p.prioridad for ps in self.no_asignadas.values() for p in ps)
        return self.prioritarias_asignadas + sin_asignar


def asignar_horarios(
    estudiantes: list[Estudiante],
    semilla: int | None = None,
    traza: Callable[[str], None] | None = None,
) -> ResultadoAsignacion:
    """Asigna horarios a todos los estudiantes en dos rondas (prioritarias y no prioritarias).

    Con la misma semilla el resultado es siempre el mismo. No modifica los
    objetos de entrada. ``traza`` (opcional) recibe una línea por paso.
    """
    cupos: dict[int, int] = {}
    for estudiante in estudiantes:
        for preferencia in estudiante.preferencias_de_clase():
            for curso in preferencia.clase.cursos:
                cupos.setdefault(curso.id, curso.cupo)

    orden = list(estudiantes)
    random.Random(semilla).shuffle(orden)

    horarios: dict[int, list[Curso]] = {e.id: [] for e in orden}
    no_asignadas: dict[int, list[PreferenciaClase]] = {e.id: [] for e in orden}
    puntajes: dict[int, Puntaje] = {e.id: CERO for e in orden}
    firmas: dict[int, int] = {e.id: 0 for e in orden}  # horas ocupadas por estudiante
    entradas = 0

    if traza is not None:
        traza(f"Orden sorteado (semilla {semilla}): {', '.join(e.nombre or str(e.id) for e in orden)}")

    for ronda, prioritaria in ((1, True), (2, False)):
        if traza is not None:
            traza(f"\nRonda {ronda}: clases {'prioritarias' if prioritaria else 'no prioritarias'}")
        for estudiante in orden:
            pedidas = [p for p in estudiante.preferencias_de_clase() if p.prioridad == prioritaria]
            if not pedidas:
                continue
            resultado = mejor_horario(
                pedidas,
                cupos,
                firma_inicial=firmas[estudiante.id],
                franjas_habilitadas=estudiante.preferencias.franjas_habilitadas,
                preferencia_profes=estudiante.preferencias.preferencia_profes,
            )
            for curso in resultado.cursos:
                cupos[curso.id] -= 1
                firmas[estudiante.id] |= curso.mascara
            horarios[estudiante.id] += resultado.cursos
            no_asignadas[estudiante.id] += resultado.no_asignadas
            puntajes[estudiante.id] = sumar(puntajes[estudiante.id], resultado.puntaje)
            entradas += resultado.entradas_tabla

            if traza is not None:
                asignados = ", ".join(f"{c.codigo} (quedan {cupos[c.id]})" for c in resultado.cursos) or "—"
                faltan = ", ".join(p.clase.nombre for p in resultado.no_asignadas)
                traza(f"  {estudiante.nombre or estudiante.id}: {asignados}"
                      + (f" | sin asignar: {faltan}" if faltan else ""))

    return ResultadoAsignacion(
        horarios=horarios,
        no_asignadas=no_asignadas,
        puntajes=puntajes,
        cupos_restantes=cupos,
        orden=[e.id for e in orden],
        entradas_tabla=entradas,
    )

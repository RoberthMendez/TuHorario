"""Muestra paso a paso cómo funciona el algoritmo (Niveles 1 a 5).

Uso, desde la raíz del repo:  python -m algoritmo.traza
(también funciona con el botón ▶ de VS Code o ``python algoritmo/traza.py``).

1. Máscaras de cada curso.
2. PD de un estudiante, con cada estado f(i, firma) que se calcula.
3. Coordinación global en dos rondas: varios estudiantes compitiendo por los cupos.
4. Clases y cursos disponibles, con los cupos que quedaron.
5. Preferencias de cada estudiante y su horario final.
"""

import sys
from pathlib import Path

if __package__ in (None, ""):
    # Ejecutado como archivo suelto: agregar la raíz del repo al path para
    # que funcione `import algoritmo`.
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    sys.stdout.reconfigure(encoding="utf-8")

from algoritmo.asignacion import asignar_horarios
from algoritmo.modelos import (
    Clase,
    Curso,
    Estudiante,
    Horario,
    PreferenciaClase,
    PreferenciaCompanero,
    PreferenciaProfe,
    PreferenciasDeEstudiante,
    Profesor,
)
from algoritmo.pd_estudiante import formato, mejor_horario
from algoritmo.tiempo import DIAS, HORA_FIN, HORA_INICIO, bloques_de, describir_mascara, numero_de_bloque


def imprimir_horario(nombre: str, cursos: list[Curso], franjas: list[Horario] | None = None) -> None:
    """Cuadrícula semanal (filas = horas, columnas = días) con el código de cada curso.

    Con franjas: ``·`` = hora libre dentro de una franja y ``*`` = clase fuera
    de las franjas.
    """
    en_franja = 0
    for f in franjas or []:
        en_franja |= f.mascara
    ocupado: dict[int, str] = {}
    for c in cursos:
        for bloque in bloques_de(c.mascara):
            fuera = bool(franjas) and not en_franja >> bloque & 1
            ocupado[bloque] = c.codigo + ("*" if fuera else "")
    print(f"\n{nombre}: {', '.join(c.codigo for c in cursos) or 'sin clases'}")
    if not ocupado:
        return

    horas = [h for h in range(HORA_INICIO, HORA_FIN) if any(numero_de_bloque(d, h) in ocupado for d in DIAS)]
    ancho = max(10, *(len(c) for c in ocupado.values()))
    separador = "      +" + "+".join("-" * (ancho + 2) for _ in DIAS) + "+"
    print("       " + " ".join(f" {d[:3].capitalize():^{ancho}} " for d in DIAS))
    print(separador)
    for h in range(horas[0], horas[-1] + 1):
        celdas = []
        for d in DIAS:
            bloque = numero_de_bloque(d, h)
            celdas.append(ocupado.get(bloque, "·" if en_franja >> bloque & 1 else ""))
        print(f"{h:>2}-{h + 1:<2} |" + "|".join(f" {c:^{ancho}} " for c in celdas) + "|")
    print(separador)
    if franjas:
        print("  · = hora libre dentro de sus franjas   * = clase fuera de sus franjas")


def describir_franjas(franjas: list[Horario]) -> str:
    if not franjas:
        return "sin preferencia"
    return ", ".join(f"{f.dia[:3]} {f.hora_inicio // 60}-{f.hora_fin // 60}" for f in franjas)


def describir_profes(preferencias: list[PreferenciaProfe]) -> str:
    if not preferencias:
        return "sin preferencia"
    return ", ".join(f"{p.profesor.nombre} {p.preferencia}" for p in preferencias)


def curso(id_: int, codigo: str, cupo: int, profesor: Profesor, *sesiones: tuple[str, int, int]) -> Curso:
    return Curso(id_, codigo, cupo, [Horario(d, i * 60, f * 60) for d, i, f in sesiones], profesor)


def todos_los_dias(inicio: str, fin: str, dias: tuple[str, ...] = DIAS[:5]) -> list[Horario]:
    return [Horario.crear(d, inicio, fin) for d in dias]


ROJAS, GOMEZ, PEREZ = Profesor(1, "Rojas"), Profesor(2, "Gomez"), Profesor(3, "Perez")
DIAZ, MORA, RUIZ = Profesor(4, "Diaz"), Profesor(5, "Mora"), Profesor(6, "Ruiz")

# Misma instancia de dp_ejemplo.py, ahora con profesores. Calculo-C y
# Calculo-D tienen el mismo horario pero distinto profesor.
CALCULO = Clase(1, "CAL", "Calculo", [
    curso(1, "Calculo-A", 2, ROJAS, ("lunes", 7, 9), ("miercoles", 7, 9)),
    curso(2, "Calculo-B", 0, ROJAS, ("martes", 9, 11), ("jueves", 9, 11)),
    curso(3, "Calculo-C", 5, GOMEZ, ("lunes", 11, 13), ("miercoles", 11, 13)),
    curso(4, "Calculo-D", 5, PEREZ, ("lunes", 11, 13), ("miercoles", 11, 13)),
])
FISICA = Clase(2, "FIS", "Fisica", [
    curso(5, "Fisica-A", 3, DIAZ, ("lunes", 8, 10), ("jueves", 8, 10)),
    curso(6, "Fisica-B", 3, MORA, ("martes", 14, 16), ("viernes", 14, 16)),
])
PROG = Clase(3, "PRO", "Programacion", [
    curso(7, "Prog-A", 1, RUIZ, ("lunes", 11, 13), ("viernes", 7, 9)),
    curso(8, "Prog-B", 4, DIAZ, ("martes", 14, 16), ("jueves", 14, 16)),
])
CLASES = [CALCULO, FISICA, PROG]
# Solo se usa en la coordinación global (sección 3).
ETICA = Clase(4, "ETI", "Etica", [curso(9, "Etica-A", 2, RUIZ, ("martes", 7, 9))])
# Igual que dp_ejemplo.py: Calculo y Fisica prioritarias, Programacion no.
PREFERENCIAS = [PreferenciaClase(CALCULO, True), PreferenciaClase(FISICA, True), PreferenciaClase(PROG, False)]
# Nivel 3: franjas del estudiante de la sección 2.
FRANJAS = [
    Horario.crear("lunes", "08:00", "13:00"),
    Horario.crear("martes", "14:00", "16:00"),
    Horario.crear("miercoles", "11:00", "13:00"),
    Horario.crear("jueves", "08:00", "10:00"),
    Horario.crear("jueves", "14:00", "16:00"),
]
# Nivel 4: calificaciones del estudiante de la sección 2 (Mora vetado).
PROFES = [
    PreferenciaProfe(PEREZ, 3),
    PreferenciaProfe(GOMEZ, 1),
    PreferenciaProfe(DIAZ, 2),
    PreferenciaProfe(MORA, 0),
]


def titulo(texto: str) -> None:
    print(f"\n{'=' * 70}\n{texto}\n{'=' * 70}")


def main() -> None:
    titulo("1. Máscaras (bloque = día*14 + (hora-7))")
    for clase in CLASES:
        for c in clase.cursos:
            print(f"{c.codigo:10} cupo {c.cupo}  {c.profesor.nombre:6}  "
                  f"[{describir_mascara(c.mascara)}]  bloques {bloques_de(c.mascara)}")

    titulo("2. PD de un estudiante: Calculo y Fisica prioritarias, Programacion no")
    print(f"Franjas habilitadas: {describir_franjas(FRANJAS)}")
    print(f"Calificaciones de profesores: {describir_profes(PROFES)}")
    print()
    resultado = mejor_horario(PREFERENCIAS, traza=print, franjas_habilitadas=FRANJAS, preferencia_profes=PROFES)
    print(f"\nPuntaje (prioritarias, no prioritarias, satisfacción): {formato(resultado.puntaje)}")
    print(f"Horario: {[c.codigo for c in resultado.cursos]}")
    print(f"Entradas en la tabla: {resultado.entradas_tabla}")
    imprimir_horario("Horario final", resultado.cursos, FRANJAS)

    titulo("3. Coordinación global: rondas y fase de mejora")
    # Etica tiene una sola sección con 2 cupos. Ana y Beto la necesitan
    # (prioritaria); Caro y Dani la quieren, pero no es prioritaria para ellos.
    # Aunque Caro y Dani salgan primero en el sorteo, los cupos son para Ana y
    # Beto porque las prioritarias de todos se asignan en la ronda 1.
    # Franjas: Ana prefiere mañanas, Caro tardes, Dani no quiere martes ni
    # viernes y Beto no puso preferencia.
    # Profesores: Ana prefiere a Rojas, Beto vetó a Mora, Dani vetó a Gomez.
    def estudiante(
        id_: int,
        nombre: str,
        etica_prioritaria: bool,
        franjas: list[Horario],
        profes: list[PreferenciaProfe],
    ) -> Estudiante:
        prefs = [
            PreferenciaClase(CALCULO, True),
            PreferenciaClase(FISICA, True),
            PreferenciaClase(PROG, False),
            PreferenciaClase(ETICA, etica_prioritaria),
        ]
        return Estudiante(id_, nombre=nombre, preferencias=PreferenciasDeEstudiante(prefs, franjas, profes))

    estudiantes = [
        estudiante(1, "Ana", True, todos_los_dias("07:00", "13:00"), [PreferenciaProfe(ROJAS, 3)]),
        estudiante(2, "Beto", True, [], [PreferenciaProfe(MORA, 0)]),
        estudiante(3, "Caro", False, todos_los_dias("13:00", "21:00"), []),
        estudiante(4, "Dani", False, todos_los_dias("07:00", "21:00", ("lunes", "miercoles", "jueves")),
                   [PreferenciaProfe(GOMEZ, 0), PreferenciaProfe(PEREZ, 2)]),
    ]
    # Nivel 5: Caro quiere ver Calculo con Ana; Beto no quiere compartir clases con Dani.
    ana, beto, caro, dani = estudiantes
    caro.preferencias.preferencia_estudiantes = [PreferenciaCompanero(ana, CALCULO)]
    beto.preferencias.estudiantes_restringidos = [dani]

    global_ = asignar_horarios(estudiantes, semilla=2026, traza=print)
    print(f"\nPrioritarias asignadas: {global_.prioritarias_asignadas}/{global_.prioritarias_solicitadas}")
    print(f"Clases asignadas: {global_.clases_asignadas}/{global_.clases_solicitadas}")
    print(f"Puntaje global: {formato(global_.puntaje_global)}")
    print(f"Satisfacción promedio por clase: {global_.satisfaccion_promedio:.2f}")
    print(f"Cambios aceptados en la fase de mejora: {global_.mejoras} (en {global_.pasadas} pasadas)")
    print(f"Entradas en todas las tablas: {global_.entradas_tabla}")

    titulo("4. Clases y cursos disponibles")
    for clase in CLASES + [ETICA]:
        print(f"\n{clase.nombre} ({clase.codigo})")
        for c in clase.cursos:
            quedan = global_.cupos_restantes.get(c.id, c.cupo)
            print(f"  {c.codigo:10} {c.profesor.nombre:6} cupo {c.cupo} → quedan {quedan}"
                  f"   [{describir_mascara(c.mascara)}]")

    titulo("5. Preferencias y horarios finales")
    for e in estudiantes:
        print(f"\n{'-' * 70}")
        print(f"{e.nombre} pidió:")
        for p in e.preferencias_de_clase():
            print(f"  - {p.clase.nombre:14} {'prioritaria' if p.prioridad else 'no prioritaria'}")
        franjas = e.preferencias.franjas_habilitadas
        print(f"  Franjas habilitadas: {describir_franjas(franjas)}")
        print(f"  Calificaciones de profesores: {describir_profes(e.preferencias.preferencia_profes)}")
        amigos = ", ".join(f"{p.estudiante_preferido.nombre} en {p.clase.nombre}"
                           for p in e.preferencias.preferencia_estudiantes)
        excluidos = ", ".join(o.nombre for o in e.preferencias.estudiantes_restringidos)
        print(f"  Compañeros pedidos: {amigos or 'ninguno'}")
        print(f"  Estudiantes excluidos: {excluidos or 'ninguno'}")
        faltan = ", ".join(p.clase.nombre for p in global_.no_asignadas[e.id])
        detalle = f"puntaje {formato(global_.puntajes[e.id])}" + (f", sin asignar: {faltan}" if faltan else "")
        imprimir_horario(f"Horario de {e.nombre} [{detalle}]", global_.horarios[e.id], franjas)


if __name__ == "__main__":
    main()

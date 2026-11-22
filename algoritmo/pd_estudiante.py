"""PD exacta por estudiante: mejor horario dados los cupos restantes.

``f(i, firma)`` = mejor puntaje con las clases i..n-1 si las horas de
``firma`` ya están ocupadas::

    f(n, firma) = (0, 0, 0)
    f(i, firma) = max( f(i+1, firma),                                  # no inscribir la clase i
                       max_{c ∈ opciones(i), firma & m[c] == 0}
                           ganancia(i, c) + f(i+1, firma | m[c]) )      # inscribir el curso c
    respuesta  = f(0, firma_inicial)

Roles de las restricciones (Niveles 1 a 4):

- Dimensión de la tabla: índice de clase ``i`` y horas ocupadas ``firma``.
- Filtro (al construir ``opciones``): ``cupo > 0`` y profesor con
  calificación distinta de 0. En la recursión: no cruce (``firma & m[c] == 0``).
- Término del puntaje: prioridad de la clase, franjas horarias y profesor.

Puntaje = ``(prioritarias, no_prioritarias, satisfaccion)``: inscribir el
curso c de una clase prioritaria suma ``(1, 0, s_c)`` y de una no prioritaria
``(0, 1, s_c)``, con

    s_c = franjas(c) + profesor(c)        (cada término en [0, 1], peso 1 hasta el Nivel 8)

- ``franjas(c)``: fracción del tiempo de c dentro de las franjas habilitadas
  (``franjas.py``).
- ``profesor(c)``: calificación del profesor / 3 (``profesores.py``).

Ambos se precalculan una vez por estudiante. Las tuplas se suman componente
a componente y se comparan lexicográficamente:

- una prioritaria más le gana a cualquier cantidad de no prioritarias;
- una clase más le gana a cualquier satisfacción: franjas y profesores solo
  deciden entre horarios con las mismas clases inscritas.

Es válido usar ``max`` porque el orden lexicográfico es compatible con la
suma (a ≤ b ⇒ a + c ≤ b + c).

Empates: se usa ``>`` estricto, así que gana la opción evaluada primero
("no inscribir" va primero, luego los cursos en el orden de ``clase.cursos``).

Complejidad: estados ≤ ∏(k_i + 1) (exponencial en n, el número de clases del
estudiante, no en el número de estudiantes); cada estado prueba k_i cursos.
"""

from collections.abc import Callable
from dataclasses import dataclass

from algoritmo.franjas import mascara_franjas, satisfaccion_franjas
from algoritmo.modelos import Curso, Horario, PreferenciaClase, PreferenciaProfe
from algoritmo.profesores import calificacion_de, calificaciones, profesor_vetado, satisfaccion_profesor
from algoritmo.tiempo import describir_mascara

Puntaje = tuple[int, int, float]  # (prioritarias, no_prioritarias, satisfaccion)
CERO: Puntaje = (0, 0, 0.0)


def sumar(a: Puntaje, b: Puntaje) -> Puntaje:
    return tuple(x + y for x, y in zip(a, b))  # type: ignore[return-value]


def ganancia(preferencia: PreferenciaClase, satisfaccion: float) -> Puntaje:
    """Prioritaria: (1, 0, s); no prioritaria: (0, 1, s), con s la satisfacción del curso."""
    return (1, 0, satisfaccion) if preferencia.prioridad else (0, 1, satisfaccion)


def formato(p: Puntaje) -> str:
    """Puntaje legible, con la satisfacción redondeada: ``(2, 1, 2.75)``."""
    return f"({p[0]}, {p[1]}, {round(p[2], 3):g})"


@dataclass
class ResultadoEstudiante:
    puntaje: Puntaje
    cursos: list[Curso]  # un curso por clase inscrita, en el orden de las clases
    no_asignadas: list[PreferenciaClase]
    entradas_tabla: int  # estados (i, firma) calculados por la PD


def mejor_horario(
    preferencias: list[PreferenciaClase],
    cupos: dict[int, int] | None = None,
    firma_inicial: int = 0,
    traza: Callable[[str], None] | None = None,
    franjas_habilitadas: list[Horario] | None = None,
    preferencia_profes: list[PreferenciaProfe] | None = None,
) -> ResultadoEstudiante:
    """Calcula el horario óptimo de un estudiante para las clases pedidas.

    ``cupos`` mapea id de curso → cupos restantes (si falta, se usa
    ``curso.cupo``). ``firma_inicial`` son horas ya ocupadas (la segunda
    ronda del Nivel 2 pasa aquí las horas de la primera). Se crea una tabla
    nueva en cada llamada, porque los cupos cambian entre estudiantes.

    ``franjas_habilitadas`` son las franjas preferidas del estudiante
    (Nivel 3); sin ellas ese término vale 0 para todos los cursos.
    ``preferencia_profes`` son sus calificaciones a profesores (Nivel 4).

    ``traza`` (opcional, p. ej. ``print``) recibe una línea por cada paso de la
    recursión; solo sirve para ver el algoritmo funcionando.
    """
    n = len(preferencias)

    def log(i: int, texto: Callable[[], str]) -> None:
        # El texto se recibe como función para no armarlo si no hay traza.
        if traza is not None:
            traza("│  " * i + texto())

    def cupo_restante(curso: Curso) -> int:
        return curso.cupo if cupos is None else cupos.get(curso.id, curso.cupo)

    def nombre(i: int) -> str:
        p = preferencias[i]
        return f"{p.clase.nombre} ({'prioritaria' if p.prioridad else 'no prioritaria'})"

    franjas = mascara_franjas(franjas_habilitadas or [])
    calif = calificaciones(preferencia_profes or [])

    # Filtros (cupo y profesor vetado): se aplican una vez, no en cada estado.
    opciones = [
        [c for c in p.clase.cursos if cupo_restante(c) > 0 and not profesor_vetado(c, calif)]
        for p in preferencias
    ]

    # Satisfacción de cada curso: se precalcula una vez, no en cada estado.
    satisfaccion = {
        c.id: satisfaccion_franjas(c, franjas) + satisfaccion_profesor(c, calif)
        for ops in opciones
        for c in ops
    }

    tabla: dict[tuple[int, int], Puntaje] = {}
    decision: dict[tuple[int, int], Curso | None] = {}

    def f(i: int, firma: int) -> Puntaje:
        if i == n:
            log(i, lambda: f"f({i}, …) = {formato(CERO)}  ← caso base: no quedan clases")
            return CERO
        clave = (i, firma)
        if clave in tabla:
            log(i, lambda: f"f({i}, [{describir_mascara(firma)}]) = {formato(tabla[clave])}  ← ya estaba en la tabla, no se recalcula")
            return tabla[clave]

        log(i, lambda: f"f({i}, [{describir_mascara(firma)}]): clase {nombre(i)}")
        log(i, lambda: "  · opción: no inscribirla")
        mejor = f(i + 1, firma)  # opción: no inscribir la clase i
        mejor_curso = None
        log(i, lambda: f"    vale {formato(mejor)}")
        for curso in opciones[i]:
            if firma & curso.mascara:  # cruce de horario
                log(i, lambda: f"  · opción: {curso.codigo} [{describir_mascara(curso.mascara)}] → se cruza, se descarta")
                continue
            g = ganancia(preferencias[i], satisfaccion[curso.id])
            log(i, lambda: f"  · opción: {curso.codigo} [{describir_mascara(curso.mascara)}], ganancia {formato(g)}")
            candidato = sumar(g, f(i + 1, firma | curso.mascara))
            if candidato > mejor:
                log(i, lambda: f"    vale {formato(candidato)} > {formato(mejor)} → nueva mejor opción")
                mejor, mejor_curso = candidato, curso
            else:
                log(i, lambda: f"    vale {formato(candidato)}, no supera {formato(mejor)} → se queda la anterior")

        tabla[clave] = mejor
        decision[clave] = mejor_curso
        log(i, lambda: f"└ tabla[({i}, [{describir_mascara(firma)}])] = {formato(mejor)}, "
                       f"decisión = {mejor_curso.codigo if mejor_curso else 'no inscribir'}")
        return mejor

    if traza is not None:
        for i, ops in enumerate(opciones):
            traza(f"opciones({i}) {nombre(i)}:")
            for c in preferencias[i].clase.cursos:
                profe = c.profesor.nombre if c.profesor else "sin profesor"
                nota = calificacion_de(c, calif)
                profe += f", calif. {nota}" if nota is not None else ", sin calificar"
                if c in ops:
                    detalle = (f"satisf. {satisfaccion[c.id]:.2f} = franjas {satisfaccion_franjas(c, franjas):.2f}"
                               f" + profesor {satisfaccion_profesor(c, calif):.2f}")
                elif cupo_restante(c) <= 0:
                    detalle = "descartado: sin cupo"
                else:
                    detalle = "descartado: profesor con calificación 0"
                traza(f"    {c.codigo:10} ({profe}) → {detalle}")
        traza(f"horas ya ocupadas: [{describir_mascara(firma_inicial)}]\n")

    puntaje = f(0, firma_inicial)

    # Reconstrucción siguiendo las decisiones desde el estado inicial.
    if traza is not None:
        traza("\nReconstrucción (seguir decision[] desde el estado inicial):")
    cursos, no_asignadas = [], []
    firma = firma_inicial
    for i in range(n):
        curso = decision[(i, firma)]
        if traza is not None:
            traza(f"  decision[({i}, [{describir_mascara(firma)}])] = {curso.codigo if curso else 'no inscribir'}")
        if curso is None:
            no_asignadas.append(preferencias[i])
        else:
            cursos.append(curso)
            firma |= curso.mascara

    return ResultadoEstudiante(puntaje, cursos, no_asignadas, len(tabla))

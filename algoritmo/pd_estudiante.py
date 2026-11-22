"""PD exacta por estudiante: mejor horario dados los cupos restantes.

``f(i, firma)`` = mejor puntaje con las clases i..n-1 si ``firma`` ya está
ocupada. La firma es ``(mascara, edificios)``: las horas ocupadas y, solo si
el estudiante pidió cercanía (Nivel 6), la tupla ordenada de sesiones con su
edificio (sin cercanía es siempre ``()`` y el estado es el mismo de antes)::

    f(n, firma) = (0, 0, −penalización_cercanía(edificios) − penalización_huecos(mascara))
    f(i, firma) = max( f(i+1, firma),                                  # no inscribir la clase i
                       max_{c ∈ opciones(i), mascara & m[c] == 0}
                           ganancia(i, c) + f(i+1, firma ⊕ c) )         # inscribir el curso c
    respuesta  = f(0, firma_inicial)

con ``firma ⊕ c = (mascara | m[c], edificios + sesiones de c, ordenada)``.

Roles de las restricciones (Niveles 1 a 7):

- Dimensión de la tabla: índice de clase ``i``, horas ocupadas ``mascara`` y
  edificios de cada sesión (solo con cercanía).
- Filtro (al construir ``opciones``): ``cupo > 0`` y profesor con
  calificación distinta de 0. En la recursión: no cruce (``mascara & m[c] == 0``).
- Término del puntaje: prioridad de la clase, franjas horarias, profesor,
  compañeros, cercanía y huecos.

Puntaje = ``(prioritarias, no_prioritarias, satisfaccion)``: inscribir el
curso c de una clase prioritaria suma ``(1, 0, s_c)`` y de una no prioritaria
``(0, 1, s_c)``, con

    s_c = franjas(c) + profesor(c) + compañeros(c)     (peso 1 cada uno hasta el Nivel 8)

- ``franjas(c)``: fracción del tiempo de c dentro de las franjas habilitadas
  (``franjas.py``).
- ``profesor(c)``: calificación del profesor / 3 (``profesores.py``).
- ``compañeros(c)``: +1 por amigo presente, −1 por excluido presente
  (``companeros.py``); lo calcula la coordinación global y llega en
  ``bono_companeros``.

Esos tres se precalculan una vez por llamada. La cercanía y los huecos no son
por curso (dependen de qué clase va junto a cuál), así que se restan en el
caso base (``cercania.py`` y ``huecos.py``). Los huecos solo dependen de la
máscara, que ya está en el estado: no agrandan la tabla.

Las tuplas se suman componente a componente y se comparan
lexicográficamente:

- una prioritaria más le gana a cualquier cantidad de no prioritarias;
- una clase más le gana a cualquier satisfacción: las preferencias solo
  deciden entre horarios con las mismas clases inscritas.

Es válido usar ``max`` porque el orden lexicográfico es compatible con la
suma (a ≤ b ⇒ a + c ≤ b + c).

Empates: se usa ``>`` estricto, así que gana la opción evaluada primero
("no inscribir" va primero, luego los cursos en el orden de ``clase.cursos``).

Complejidad: estados ≤ ∏(k_i + 1) (exponencial en n, el número de clases del
estudiante, no en el número de estudiantes); cada estado prueba k_i cursos.
Con cercanía la cota es la misma, pero se comparten menos estados.
"""

from collections.abc import Callable
from dataclasses import dataclass

from algoritmo.cercania import Campus, Sesion, agregar, sesiones_con_edificio
from algoritmo.franjas import mascara_franjas, satisfaccion_franjas
from algoritmo.huecos import horas_de_hueco, penalizacion_huecos
from algoritmo.modelos import Curso, Horario, PreferenciaClase, PreferenciaProfe
from algoritmo.profesores import calificacion_de, calificaciones, profesor_vetado, satisfaccion_profesor
from algoritmo.tiempo import DIAS, HORA_INICIO, HORAS_POR_DIA, describir_mascara

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
    bono_companeros: dict[int, float] | None = None,
    preferencia_cercania: bool = False,
    cursos_fijos: list[Curso] | None = None,
    campus: Campus | None = None,
    preferencia_sin_huecos: bool = False,
) -> ResultadoEstudiante:
    """Calcula el horario óptimo de un estudiante para las clases pedidas.

    ``cupos`` mapea id de curso → cupos restantes (si falta, se usa
    ``curso.cupo``). ``firma_inicial`` son horas ya ocupadas (la segunda
    ronda del Nivel 2 pasa aquí las horas de la primera). Se crea una tabla
    nueva en cada llamada, porque los cupos cambian entre estudiantes.

    ``franjas_habilitadas`` son las franjas preferidas del estudiante
    (Nivel 3); sin ellas ese término vale 0 para todos los cursos.
    ``preferencia_profes`` son sus calificaciones a profesores (Nivel 4).
    ``bono_companeros`` mapea id de curso → bono/penalización por compañeros
    (Nivel 5); depende de quién ya está inscrito, así que lo calcula la
    coordinación global (``companeros.py``).

    Nivel 6: con ``preferencia_cercania`` se penalizan los traslados entre
    edificios lejanos. ``cursos_fijos`` son los cursos que el estudiante ya
    tiene (sus sesiones cuentan para los traslados) y ``campus`` trae las
    distancias; si falta, se arma con los cursos de esta llamada.

    Nivel 7: con ``preferencia_sin_huecos`` se penalizan las horas libres
    entre clases del mismo día (``huecos.py``), incluidas las de
    ``firma_inicial``.

    ``traza`` (opcional, p. ej. ``print``) recibe una línea por cada paso de la
    recursión; solo sirve para ver el algoritmo funcionando.
    """
    n = len(preferencias)
    fijos = cursos_fijos or []

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
    bono = bono_companeros or {}
    satisfaccion = {
        c.id: satisfaccion_franjas(c, franjas) + satisfaccion_profesor(c, calif) + bono.get(c.id, 0.0)
        for ops in opciones
        for c in ops
    }

    # Nivel 6: sesiones con edificio de cada curso (solo si pidió cercanía).
    if preferencia_cercania:
        if campus is None:
            campus = Campus([c for p in preferencias for c in p.clase.cursos] + fijos)
        sesiones = {c.id: sesiones_con_edificio(c) for ops in opciones for c in ops}
        edificios_iniciales: tuple[Sesion, ...] = ()
        for c in fijos:
            edificios_iniciales = agregar(edificios_iniciales, sesiones_con_edificio(c))
    else:
        sesiones = {}
        edificios_iniciales = ()

    def describir(firma: int, edificios: tuple[Sesion, ...]) -> str:
        texto = f"[{describir_mascara(firma)}]"
        if preferencia_cercania and campus is not None:
            partes = [f"{DIAS[a // HORAS_POR_DIA][:3]} {HORA_INICIO + a % HORAS_POR_DIA}-"
                      f"{HORA_INICIO + a % HORAS_POR_DIA + (b - a)} {campus.nombre(e)}" for a, b, e in edificios]
            texto += " {" + ", ".join(partes) + "}"
        return texto

    tabla: dict[tuple[int, int, tuple[Sesion, ...]], Puntaje] = {}
    decision: dict[tuple[int, int, tuple[Sesion, ...]], Curso | None] = {}

    def f(i: int, firma: int, edificios: tuple[Sesion, ...]) -> Puntaje:
        if i == n:
            # Términos que dependen del horario completo: se calculan aquí.
            motivos = []
            penalizacion = 0.0
            if preferencia_cercania and campus is not None and edificios:
                traslados = campus.penalizacion(edificios)
                penalizacion += traslados
                motivos.append(f"traslados {traslados:.3g}")
            if preferencia_sin_huecos:
                horas = horas_de_hueco(firma)
                penalizacion += penalizacion_huecos(firma)
                motivos.append(f"{horas} h de hueco")
            if not motivos:
                log(i, lambda: f"f({i}, …) = {formato(CERO)}  ← caso base: no quedan clases")
                return CERO
            valor = (0, 0, 0.0 - penalizacion)  # 0.0 - x evita imprimir "-0"
            log(i, lambda: f"f({i}, …) = {formato(valor)}  ← caso base: penalización por {', '.join(motivos)}")
            return valor
        clave = (i, firma, edificios)
        if clave in tabla:
            log(i, lambda: f"f({i}, {describir(firma, edificios)}) = {formato(tabla[clave])}"
                           "  ← ya estaba en la tabla, no se recalcula")
            return tabla[clave]

        log(i, lambda: f"f({i}, {describir(firma, edificios)}): clase {nombre(i)}")
        log(i, lambda: "  · opción: no inscribirla")
        mejor = f(i + 1, firma, edificios)  # opción: no inscribir la clase i
        mejor_curso = None
        log(i, lambda: f"    vale {formato(mejor)}")
        for curso in opciones[i]:
            if firma & curso.mascara:  # cruce de horario
                log(i, lambda: f"  · opción: {curso.codigo} [{describir_mascara(curso.mascara)}] → se cruza, se descarta")
                continue
            g = ganancia(preferencias[i], satisfaccion[curso.id])
            log(i, lambda: f"  · opción: {curso.codigo} [{describir_mascara(curso.mascara)}], ganancia {formato(g)}")
            siguiente = agregar(edificios, sesiones.get(curso.id, ()))
            candidato = sumar(g, f(i + 1, firma | curso.mascara, siguiente))
            if candidato > mejor:
                log(i, lambda: f"    vale {formato(candidato)} > {formato(mejor)} → nueva mejor opción")
                mejor, mejor_curso = candidato, curso
            else:
                log(i, lambda: f"    vale {formato(candidato)}, no supera {formato(mejor)} → se queda la anterior")

        tabla[clave] = mejor
        decision[clave] = mejor_curso
        log(i, lambda: f"└ tabla[({i}, {describir(firma, edificios)})] = {formato(mejor)}, "
                       f"decisión = {mejor_curso.codigo if mejor_curso else 'no inscribir'}")
        return mejor

    if traza is not None:
        for i, ops in enumerate(opciones):
            traza(f"opciones({i}) {nombre(i)}:")
            for c in preferencias[i].clase.cursos:
                profe = c.profesor.nombre if c.profesor else "sin profesor"
                nota = calificacion_de(c, calif)
                profe += f", calif. {nota}" if nota is not None else ", sin calificar"
                if preferencia_cercania and c.salones:
                    profe += ", " + "/".join(dict.fromkeys(s.edificio.nombre for s in c.salones))
                if c in ops:
                    detalle = (f"satisf. {satisfaccion[c.id]:.2f} = franjas {satisfaccion_franjas(c, franjas):.2f}"
                               f" + profesor {satisfaccion_profesor(c, calif):.2f}"
                               f" + compañeros {bono.get(c.id, 0.0):g}")
                elif cupo_restante(c) <= 0:
                    detalle = "descartado: sin cupo"
                else:
                    detalle = "descartado: profesor con calificación 0"
                traza(f"    {c.codigo:10} ({profe}) → {detalle}")
        traza(f"ya ocupado: {describir(firma_inicial, edificios_iniciales)}\n")

    puntaje = f(0, firma_inicial, edificios_iniciales)

    # Reconstrucción siguiendo las decisiones desde el estado inicial.
    if traza is not None:
        traza("\nReconstrucción (seguir decision[] desde el estado inicial):")
    cursos, no_asignadas = [], []
    firma, edificios = firma_inicial, edificios_iniciales
    for i in range(n):
        curso = decision[(i, firma, edificios)]
        if traza is not None:
            traza(f"  decision[({i}, {describir(firma, edificios)})] = {curso.codigo if curso else 'no inscribir'}")
        if curso is None:
            no_asignadas.append(preferencias[i])
        else:
            cursos.append(curso)
            firma |= curso.mascara
            edificios = agregar(edificios, sesiones.get(curso.id, ()))

    return ResultadoEstudiante(puntaje, cursos, no_asignadas, len(tabla))

"""Generador de instancias sintéticas con semilla (para tests y experimentos).

Cada curso toma su horario de un conjunto de ``num_patrones`` patrones
precalculados; con pocos patrones hay más cruces y más cursos que comparten
firma (que es justo donde la PD ahorra trabajo).
"""

import random

from algoritmo.modelos import (
    CALIFICACION_MAXIMA,
    Clase,
    Curso,
    Estudiante,
    Horario,
    PreferenciaClase,
    PreferenciaProfe,
    Profesor,
    PreferenciasDeEstudiante,
)
from algoritmo.tiempo import DIAS, HORA_FIN, HORA_INICIO


def _patron_aleatorio(rng: random.Random) -> list[Horario]:
    """Dos sesiones de 2 horas en días distintos, a la misma hora."""
    dias = rng.sample(DIAS, 2)
    hora = rng.randrange(HORA_INICIO, HORA_FIN - 1)
    return [Horario(dia, hora * 60, (hora + 2) * 60) for dia in dias]


def _franjas_aleatorias(rng: random.Random, prob_dia: float) -> list[Horario]:
    """Una franja por día (con probabilidad ``prob_dia``), de al menos 2 horas."""
    franjas = []
    for dia in DIAS:
        if rng.random() < prob_dia:
            inicio = rng.randrange(HORA_INICIO, HORA_FIN - 1)
            fin = rng.randrange(inicio + 2, HORA_FIN + 1)
            franjas.append(Horario(dia, inicio * 60, fin * 60))
    return franjas


def _calificaciones_aleatorias(rng: random.Random, clases: list[Clase], cantidad: int) -> list[PreferenciaProfe]:
    """Califica (0 a 3) hasta ``cantidad`` profesores que dictan alguna de sus clases."""
    candidatos = list({c.profesor.id: c.profesor for clase in clases for c in clase.cursos if c.profesor}.values())
    elegidos = rng.sample(candidatos, min(cantidad, len(candidatos)))
    return [PreferenciaProfe(p, rng.randint(0, CALIFICACION_MAXIMA)) for p in elegidos]


def generar_instancia(
    num_estudiantes: int,
    clases_por_estudiante: int,
    cursos_por_clase: int,
    num_clases: int | None = None,
    num_patrones: int = 20,
    cupo_maximo: int = 30,
    fraccion_prioritarias: float = 0.5,
    prob_dia_con_franja: float = 0.7,
    num_profesores: int = 10,
    profes_calificados: int = 3,
    semilla: int | None = None,
) -> tuple[list[Clase], list[Estudiante]]:
    rng = random.Random(semilla)
    num_clases = num_clases or clases_por_estudiante * 2
    patrones = [_patron_aleatorio(rng) for _ in range(num_patrones)]
    profesores = [Profesor(i, f"Profesor {i}") for i in range(num_profesores)]

    clases, siguiente_curso = [], 0
    for id_clase in range(num_clases):
        cursos = []
        for grupo in range(cursos_por_clase):
            cursos.append(
                Curso(
                    id=siguiente_curso,
                    codigo=f"C{id_clase}-{grupo}",
                    cupo=rng.randint(0, cupo_maximo),
                    horarios=rng.choice(patrones),
                    profesor=rng.choice(profesores),
                )
            )
            siguiente_curso += 1
        clases.append(Clase(id=id_clase, codigo=f"C{id_clase}", nombre=f"Clase {id_clase}", cursos=cursos))

    estudiantes = []
    for id_estudiante in range(num_estudiantes):
        elegidas = rng.sample(clases, min(clases_por_estudiante, num_clases))
        preferencias = PreferenciasDeEstudiante(
            [PreferenciaClase(c, rng.random() < fraccion_prioritarias) for c in elegidas],
            _franjas_aleatorias(rng, prob_dia_con_franja),
            _calificaciones_aleatorias(rng, elegidas, profes_calificados),
        )
        estudiantes.append(Estudiante(id=id_estudiante, preferencias=preferencias))

    return clases, estudiantes

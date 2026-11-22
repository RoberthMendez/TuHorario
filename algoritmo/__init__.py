"""Módulo de asignación de horarios de TuHorario.

Paquete independiente: no debe importar nada del backend ni de FastAPI.

Implementa los Niveles 1 (clases y cupos), 2 (prioridad de clases), 3
(franjas horarias) y 4 (profesores): PD exacta por estudiante sobre ``(índice de clase, firma
de horas ocupadas)`` con puntaje ``(prioritarias, no_prioritarias,
satisfaccion)``, y coordinación global en dos
rondas (primero las prioritarias de todos, luego las no prioritarias) con los
estudiantes en un orden sorteado con semilla.
"""

from algoritmo.asignacion import ResultadoAsignacion, asignar_horarios
from algoritmo.modelos import (
    Clase,
    Curso,
    Estudiante,
    Horario,
    PreferenciaClase,
    PreferenciaProfe,
    PreferenciasDeEstudiante,
    Profesor,
)
from algoritmo.pd_estudiante import ResultadoEstudiante, mejor_horario

__all__ = [
    "Clase",
    "Curso",
    "Estudiante",
    "Horario",
    "PreferenciaClase",
    "PreferenciaProfe",
    "Profesor",
    "PreferenciasDeEstudiante",
    "ResultadoAsignacion",
    "ResultadoEstudiante",
    "asignar_horarios",
    "mejor_horario",
]

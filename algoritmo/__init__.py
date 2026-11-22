"""Módulo de asignación de horarios de TuHorario.

Paquete independiente: no debe importar nada del backend ni de FastAPI.

Implementa los Niveles 1 a 8 (clases y cupos, prioridad de clases, franjas
horarias, profesores, compañeros, cercanía, huecos y prioridad entre
preferencias):

- PD exacta por estudiante sobre ``(índice de clase, firma de horas ocupadas)``
  con puntaje ``(prioritarias, no_prioritarias, satisfaccion)``.
- Coordinación global: orden sorteado con semilla (amigos seguidos), dos
  rondas (primero las prioritarias de todos, luego las no prioritarias) y una
  fase de mejora que reacomoda a cada estudiante si sube el puntaje global.
"""

from algoritmo.asignacion import ResultadoAsignacion, asignar_horarios
from algoritmo.modelos import (
    Clase,
    Curso,
    Estudiante,
    Horario,
    PreferenciaClase,
    PreferenciaCompanero,
    PreferenciaProfe,
    PreferenciasDeEstudiante,
    PrioridadPreferencia,
    Profesor,
)
from algoritmo.pd_estudiante import ResultadoEstudiante, mejor_horario

__all__ = [
    "Clase",
    "Curso",
    "Estudiante",
    "Horario",
    "PreferenciaClase",
    "PreferenciaCompanero",
    "PreferenciaProfe",
    "Profesor",
    "PreferenciasDeEstudiante",
    "PrioridadPreferencia",
    "ResultadoAsignacion",
    "ResultadoEstudiante",
    "asignar_horarios",
    "mejor_horario",
]

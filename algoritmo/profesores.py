"""Nivel 4: preferencias de profesor.

Cada restricción tiene un rol distinto en la PD:

- Calificación 0 → **filtro**: el curso no entra en ``opciones``, igual que
  un curso sin cupo.
- Calificación 1–3 → **término del puntaje**: el curso suma
  ``calificacion / 3`` (0.33, 0.67 o 1.0) a la satisfacción.
- Profesor sin calificar (o curso sin profesor) → suma 0 y no se descarta.

Se precalcula una vez por estudiante y por curso: no cambia el estado.
"""

from algoritmo.modelos import CALIFICACION_MAXIMA, Curso, PreferenciaProfe

Calificaciones = dict[int, int]  # id profesor → calificación


def calificaciones(preferencias: list[PreferenciaProfe]) -> Calificaciones:
    """Diccionario de calificaciones; si un profesor aparece repetido, vale la última."""
    return {p.profesor.id: p.preferencia for p in preferencias}


def calificacion_de(curso: Curso, calif: Calificaciones) -> int | None:
    """Calificación del profesor del curso, o ``None`` si no fue calificado."""
    if curso.profesor is None:
        return None
    return calif.get(curso.profesor.id)


def profesor_vetado(curso: Curso, calif: Calificaciones) -> bool:
    return calificacion_de(curso, calif) == 0


def satisfaccion_profesor(curso: Curso, calif: Calificaciones) -> float:
    """``calificacion / 3`` (0 si el profesor no fue calificado)."""
    return (calificacion_de(curso, calif) or 0) / CALIFICACION_MAXIMA

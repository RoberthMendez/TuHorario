"""Nivel 8: prioridad entre preferencias.

Cada criterio de satisfacción ya está normalizado a [0, 1] por unidad:

- horarios (franjas): fracción del curso dentro de las franjas, por curso.
- profesores: calificación / 3, por curso.
- estudiantes (compañeros): fracción de amigos presentes − fracción de
  excluidos presentes, por curso (en [−1, 1]).
- cercanía: distancia / distancia máxima, por traslado sin hueco.
- huecos: horas de hueco / 12, por día.

El estudiante ordena las categorías que eligió (1 = la más importante). Con
m categorías en el ranking, la de la posición p pesa::

    w = 2^(m − p)          → 2^(m−1), …, 4, 2, 1

así cada categoría pesa el doble que la siguiente. Las categorías que no
están en el ranking pesan 0 (no se tienen en cuenta). Sin ranking, todas
pesan 1 (el comportamiento de los Niveles 3 a 7).

Escala: los pesos de cada estudiante se multiplican por ``m / (2^m − 1)``
para que sumen m (lo mismo que m criterios con peso 1). Para las decisiones
de un estudiante da igual (solo importan las proporciones, que siguen siendo
2 a 1), pero en la fase de mejora se suman satisfacciones de estudiantes
distintos, y sin escalar quien ordena más categorías pesaría mucho más que
quien no ordena ninguna.

"clases" (prioridad de clases) puede estar en el ranking y ocupa su
posición, pero no se pondera: la prioridad de clases va en las primeras
componentes del puntaje y siempre domina (una clase prioritaria más le gana
a cualquier satisfacción), así nadie pierde una clase por una preferencia.
"""

from dataclasses import dataclass

from algoritmo.modelos import PrioridadPreferencia


@dataclass(frozen=True)
class Pesos:
    horarios: float = 1.0
    profesores: float = 1.0
    estudiantes: float = 1.0
    cercania: float = 1.0
    huecos: float = 1.0


PESOS_IGUALES = Pesos()


def calcular_pesos(prioridades: list[PrioridadPreferencia]) -> Pesos:
    """Pesos ``2^(m − posición)`` (escalados para sumar m) según el ranking; 0 si no está."""
    if not prioridades:
        return PESOS_IGUALES
    tipos = [p.tipo_preferencia for p in prioridades]
    if len(set(tipos)) != len(tipos):
        raise ValueError("Una categoría de preferencia no puede aparecer dos veces en el ranking")
    orden = sorted(prioridades, key=lambda p: p.prioridad)
    m = len(orden)
    escala = m / (2**m - 1)
    w = {p.tipo_preferencia: 2 ** (m - posicion) * escala for posicion, p in enumerate(orden, start=1)}
    return Pesos(
        horarios=w.get("horarios", 0.0),
        profesores=w.get("profesores", 0.0),
        estudiantes=w.get("estudiantes", 0.0),
        cercania=w.get("cercania", 0.0),
        huecos=w.get("huecos", 0.0),
    )

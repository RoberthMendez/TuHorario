"""Nivel 3: satisfacción de un curso según las franjas habilitadas del estudiante.

Como las clases y las franjas siempre van en horas en punto, cada una ocupa
bloques de 1 hora completos y la satisfacción se calcula con las máscaras:

    satisfacción(curso) = bloques del curso dentro de las franjas / bloques del curso
                        = popcount(m_curso & m_franjas) / popcount(m_curso)   ∈ [0, 1]

``m_franjas`` es el OR de las máscaras de todas las franjas, así que las
franjas que se solapan quedan unidas solas (una hora no se cuenta dos veces).
Se precalcula una vez por estudiante y por curso: no cambia el estado de la
PD, solo el puntaje.
"""

from algoritmo.modelos import Curso, Horario


def mascara_franjas(franjas: list[Horario]) -> int:
    """Unión de las franjas habilitadas como una sola máscara de 84 bits."""
    mascara = 0
    for franja in franjas:
        mascara |= franja.mascara
    return mascara


def satisfaccion_franjas(curso: Curso, franjas: int) -> float:
    """Fracción (0–1) de los bloques del curso que caen dentro de las franjas.

    Sin franjas (el estudiante no puso esta preferencia) vale 0 para todos los
    cursos, así que no influye en la elección.
    """
    total = curso.mascara.bit_count()
    if total == 0 or franjas == 0:
        return 0.0
    return (curso.mascara & franjas).bit_count() / total

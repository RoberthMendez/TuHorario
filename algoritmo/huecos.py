"""Nivel 7: horarios sin huecos.

Para cada día, con los bloques ocupados de ese día::

    huecos(día) = (último bloque − primer bloque + 1) − bloques ocupados

Ejemplo: clases el lunes de 7 a 9 y de 11 a 13 → bloques 7, 8, 11, 12 →
(12 − 7 + 1) − 4 = 2 horas de hueco (9 a 11).

Solo depende de las horas ocupadas, que ya están en la máscara de la firma,
así que **no agranda el estado de la PD**: se calcula en el caso base con la
máscara final (que incluye las horas de ``firma_inicial``).

Cada hora de hueco resta ``1 / HUECO_MAXIMO_POR_DIA`` de la satisfacción; el
peor hueco posible en un día (una clase a las 7 y otra a las 20) resta 1, en
la misma escala que los demás criterios hasta el Nivel 8.
"""

from algoritmo.tiempo import DIAS, HORAS_POR_DIA

HUECO_MAXIMO_POR_DIA = HORAS_POR_DIA - 2  # 12 horas
_UN_DIA = (1 << HORAS_POR_DIA) - 1


def horas_de_hueco(mascara: int) -> int:
    """Total de horas libres entre la primera y la última clase de cada día."""
    total = 0
    for d in range(len(DIAS)):
        dia = (mascara >> (d * HORAS_POR_DIA)) & _UN_DIA
        if dia:
            primero = (dia & -dia).bit_length() - 1  # bit más bajo prendido
            ultimo = dia.bit_length() - 1  # bit más alto prendido
            total += (ultimo - primero + 1) - dia.bit_count()
    return total


def penalizacion_huecos(mascara: int) -> float:
    return horas_de_hueco(mascara) / HUECO_MAXIMO_POR_DIA

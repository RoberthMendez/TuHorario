"""Representación del tiempo como máscaras de bits.

La semana va de lunes a sábado, de 7:00 a 21:00, en bloques de 1 hora:
6 días × 14 horas = 84 bloques. Un conjunto de horas ocupadas se guarda como
un entero de 84 bits (la "firma"): el bit k está prendido si el bloque k está
ocupado.

- ``firma & mascara != 0`` → hay cruce de horario.
- ``firma | mascara``      → agrega las horas del curso a la firma.

No se usa ``^`` (XOR): si hubiera cruce, liberaría horas en vez de ocuparlas.
"""

DIAS = ("lunes", "martes", "miercoles", "jueves", "viernes", "sabado")
HORA_INICIO = 7
HORA_FIN = 21
HORAS_POR_DIA = HORA_FIN - HORA_INICIO  # 14 bloques por día
TOTAL_BLOQUES = len(DIAS) * HORAS_POR_DIA  # 84 bloques

MINUTO_INICIO = HORA_INICIO * 60  # 420
MINUTO_FIN = HORA_FIN * 60  # 1260


def a_minutos(texto: str) -> int:
    """Convierte ``"HH:MM"`` en minutos desde la medianoche (``"07:30"`` → 450)."""
    horas, minutos = texto.split(":")
    return int(horas) * 60 + int(minutos)


def indice_dia(dia: str) -> int:
    """Posición del día en la semana (lunes = 0 … sábado = 5)."""
    try:
        return DIAS.index(dia)
    except ValueError:
        raise ValueError(f"Día inválido: {dia!r}. Debe ser uno de {DIAS}") from None


def numero_de_bloque(dia: str, hora: int) -> int:
    """Bloque de 1 hora que empieza a ``hora`` (entera) en ``dia``."""
    return indice_dia(dia) * HORAS_POR_DIA + (hora - HORA_INICIO)


def mascara_de_franja(dia: str, minuto_inicio: int, minuto_fin: int) -> int:
    """Máscara de los bloques que ocupa una sesión (horas en punto).

    Lunes 7:00–9:00 ocupa los bloques de 7 y de 8: ``0b11`` desplazado al
    lunes. ``Horario`` ya valida que las horas sean en punto.
    """
    primero = (minuto_inicio - MINUTO_INICIO) // 60
    cantidad = (minuto_fin - minuto_inicio) // 60
    return ((1 << cantidad) - 1) << (indice_dia(dia) * HORAS_POR_DIA + primero)


def bloques_de(mascara: int) -> list[int]:
    """Lista de los números de bloque prendidos en una máscara (para depurar)."""
    return [k for k in range(TOTAL_BLOQUES) if mascara >> k & 1]


def describir_mascara(mascara: int) -> str:
    """Texto legible de una máscara: ``"lun 7-9, mie 7-9"`` (``"vacía"`` si es 0)."""
    partes = []
    for d, dia in enumerate(DIAS):
        hora = HORA_INICIO
        while hora < HORA_FIN:
            if mascara >> numero_de_bloque(dia, hora) & 1:
                inicio = hora
                while hora < HORA_FIN and mascara >> numero_de_bloque(dia, hora) & 1:
                    hora += 1
                partes.append(f"{dia[:3]} {inicio}-{hora}")
            else:
                hora += 1
    return ", ".join(partes) if partes else "vacía"

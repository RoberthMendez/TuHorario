"""Días y horas: único lugar donde se traducen entre la API, la base y el algoritmo.

- La API (y el front) usa los días con tilde: ``miércoles``, ``sábado``.
- La base y el algoritmo los usan sin tilde: ``miercoles``, ``sabado``.
- Las horas se guardan en minutos desde la medianoche y en la API van como
  ``"HH:MM"``. Siempre en punto y entre 7:00 y 21:00.
"""

DIAS = ("lunes", "martes", "miercoles", "jueves", "viernes", "sabado")
DIAS_API = ("lunes", "martes", "miércoles", "jueves", "viernes", "sábado")

MINUTO_INICIO = 7 * 60
MINUTO_FIN = 21 * 60

_A_INTERNO = dict(zip(DIAS_API, DIAS)) | {d: d for d in DIAS}
_A_API = dict(zip(DIAS, DIAS_API))


def dia_interno(dia: str) -> str:
    """``"miércoles"`` o ``"miercoles"`` → ``"miercoles"``."""
    try:
        return _A_INTERNO[dia.strip().lower()]
    except KeyError:
        raise ValueError(f"Día inválido: {dia!r}") from None


def dia_api(dia: str) -> str:
    """``"miercoles"`` → ``"miércoles"``."""
    return _A_API[dia]


def a_minutos(texto: str) -> int:
    """``"07:00"`` → 420. Exige formato HH:MM."""
    try:
        horas, minutos = texto.split(":")
        return int(horas) * 60 + int(minutos)
    except ValueError:
        raise ValueError(f"Hora inválida: {texto!r} (formato HH:MM)") from None


def a_texto(minutos: int) -> str:
    """420 → ``"07:00"``."""
    return f"{minutos // 60:02d}:{minutos % 60:02d}"


def validar_franja(hora_inicio: int, hora_fin: int) -> None:
    """Horas en punto, dentro de 7:00–21:00 y con inicio antes del fin."""
    if hora_inicio % 60 or hora_fin % 60:
        raise ValueError("Las horas deben ser en punto (07:00, 08:00…)")
    if not MINUTO_INICIO <= hora_inicio < hora_fin <= MINUTO_FIN:
        raise ValueError("El horario debe estar entre 07:00 y 21:00 y empezar antes de terminar")


def se_cruzan(a: tuple[str, int, int], b: tuple[str, int, int]) -> bool:
    """¿Dos franjas ``(dia, inicio, fin)`` se solapan?"""
    return a[0] == b[0] and a[1] < b[2] and b[1] < a[2]

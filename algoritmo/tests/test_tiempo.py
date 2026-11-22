import pytest

from algoritmo.modelos import Curso, Horario
from algoritmo.tiempo import TOTAL_BLOQUES, a_minutos, bloques_de, numero_de_bloque


def test_numero_de_bloque() -> None:
    assert numero_de_bloque("lunes", 7) == 0
    assert numero_de_bloque("lunes", 20) == 13
    assert numero_de_bloque("martes", 7) == 14
    assert numero_de_bloque("sabado", 20) == TOTAL_BLOQUES - 1


def test_mascara_horas_enteras() -> None:
    assert bloques_de(Horario.crear("lunes", "07:00", "09:00").mascara) == [0, 1]
    assert bloques_de(Horario.crear("martes", "14:00", "16:00").mascara) == [21, 22]


def test_solo_horas_en_punto() -> None:
    # Regla de negocio: las clases siempre empiezan y terminan en hora en punto.
    with pytest.raises(ValueError):
        Horario.crear("lunes", "07:30", "09:00")
    with pytest.raises(ValueError):
        Horario.crear("lunes", "07:00", "08:45")


def test_mascara_de_curso_une_sus_sesiones() -> None:
    curso = Curso(
        1, "X", 5, [Horario.crear("lunes", "07:00", "09:00"), Horario.crear("miercoles", "07:00", "09:00")]
    )
    assert bloques_de(curso.mascara) == [0, 1, 28, 29]


def test_validaciones() -> None:
    with pytest.raises(ValueError):
        Horario.crear("domingo", "07:00", "09:00")
    with pytest.raises(ValueError):
        Horario.crear("lunes", "06:00", "08:00")
    with pytest.raises(ValueError):
        Horario.crear("lunes", "20:00", "22:00")
    with pytest.raises(ValueError):
        Horario.crear("lunes", "09:00", "09:00")
    with pytest.raises(ValueError):
        Curso(1, "X", -1, [])
    with pytest.raises(ValueError):
        Curso(1, "X", 5, [Horario.crear("lunes", "07:00", "09:00"), Horario.crear("lunes", "08:00", "10:00")])
    assert a_minutos("07:00") == 420

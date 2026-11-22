import itertools
import random

import pytest

from algoritmo.generador import generar_instancia
from algoritmo.franjas import mascara_franjas, satisfaccion_franjas
from algoritmo.modelos import Clase, Curso, Horario, PreferenciaClase, PreferenciaProfe, Profesor
from algoritmo.pd_estudiante import mejor_horario
from algoritmo.profesores import calificaciones, profesor_vetado, satisfaccion_profesor


def curso(id_: int, codigo: str, cupo: int, *sesiones: tuple[str, int, int]) -> Curso:
    return Curso(id_, codigo, cupo, [Horario(d, i * 60, f * 60) for d, i, f in sesiones])


def instancia_ejemplo() -> list[PreferenciaClase]:
    """Misma instancia de dp_ejemplo.py (sin puntos, que son del Nivel 3 en adelante)."""
    calculo = Clase(1, "CAL", "Calculo", [
        curso(1, "Calculo-A", 2, ("lunes", 7, 9), ("miercoles", 7, 9)),
        curso(2, "Calculo-B", 0, ("martes", 9, 11), ("jueves", 9, 11)),
        curso(3, "Calculo-C", 5, ("lunes", 11, 13), ("miercoles", 11, 13)),
        curso(4, "Calculo-D", 5, ("lunes", 11, 13), ("miercoles", 11, 13)),
    ])
    fisica = Clase(2, "FIS", "Fisica", [
        curso(5, "Fisica-A", 3, ("lunes", 8, 10), ("jueves", 8, 10)),
        curso(6, "Fisica-B", 3, ("martes", 14, 16), ("viernes", 14, 16)),
    ])
    prog = Clase(3, "PRO", "Programacion", [
        curso(7, "Prog-A", 1, ("lunes", 11, 13), ("viernes", 7, 9)),
        curso(8, "Prog-B", 4, ("martes", 14, 16), ("jueves", 14, 16)),
    ])
    return [PreferenciaClase(calculo, True), PreferenciaClase(fisica, True), PreferenciaClase(prog, False)]


def fuerza_bruta(
    preferencias: list[PreferenciaClase],
    franjas: list[Horario],
    profes: list[PreferenciaProfe],
) -> tuple[int, int, float]:
    """Mejor (prioritarias, no_prioritarias, satisfaccion) probando todas las combinaciones."""
    unidas = mascara_franjas(franjas)
    calif = calificaciones(profes)
    mejor = (0, 0, 0.0)
    opciones = [
        [None] + [c for c in p.clase.cursos if c.cupo > 0 and not profesor_vetado(c, calif)]
        for p in preferencias
    ]
    for combinacion in itertools.product(*opciones):
        firma, prio, no_prio, satisf, valida = 0, 0, 0, 0.0, True
        for p, c in zip(preferencias, combinacion):
            if c is None:
                continue
            if firma & c.mascara:
                valida = False
                break
            firma |= c.mascara
            satisf += satisfaccion_franjas(c, unidas) + satisfaccion_profesor(c, calif)
            if p.prioridad:
                prio += 1
            else:
                no_prio += 1
        if valida:
            mejor = max(mejor, (prio, no_prio, satisf))
    return mejor


def sin_cruces(cursos: list[Curso]) -> bool:
    firma = 0
    for c in cursos:
        if firma & c.mascara:
            return False
        firma |= c.mascara
    return True


def test_ejemplo() -> None:
    resultado = mejor_horario(instancia_ejemplo())
    assert resultado.puntaje == (2, 1, 0.0)
    # Empate entre varios horarios (2, 1): gana el primero evaluado.
    assert [c.codigo for c in resultado.cursos] == ["Calculo-A", "Fisica-B", "Prog-A"]
    assert resultado.no_asignadas == []
    assert sin_cruces(resultado.cursos)
    assert resultado.entradas_tabla == 12  # igual que dp_ejemplo.py


def test_curso_sin_cupo_se_filtra() -> None:
    preferencias = instancia_ejemplo()
    resultado = mejor_horario(preferencias)
    assert all(c.codigo != "Calculo-B" for c in resultado.cursos)

    # Si se agota Prog-A, Programación pasa a Prog-B y se reacomoda el resto.
    cupos = {c.id: c.cupo for p in preferencias for c in p.clase.cursos}
    cupos[7] = 0
    resultado = mejor_horario(preferencias, cupos)
    assert resultado.puntaje == (2, 1, 0.0)
    assert all(c.codigo != "Prog-A" for c in resultado.cursos)
    assert sin_cruces(resultado.cursos)


def test_prioritaria_gana_aunque_vaya_despues() -> None:
    # A (no prioritaria) y B (prioritaria) siempre chocan: se queda B.
    a = Clase(1, "A", "A", [curso(1, "A-1", 5, ("lunes", 7, 9))])
    b = Clase(2, "B", "B", [curso(2, "B-1", 5, ("lunes", 8, 10))])
    resultado = mejor_horario([PreferenciaClase(a, False), PreferenciaClase(b, True)])
    assert resultado.puntaje == (1, 0, 0.0)
    assert [c.codigo for c in resultado.cursos] == ["B-1"]
    assert [p.clase for p in resultado.no_asignadas] == [a]

    # Al revés también: B prioritaria va primero y A no prioritaria choca.
    resultado = mejor_horario([PreferenciaClase(b, True), PreferenciaClase(a, False)])
    assert [c.codigo for c in resultado.cursos] == ["B-1"]


def test_una_prioritaria_vale_mas_que_varias_no_prioritarias() -> None:
    # P choca con N1 y con N2; N1 y N2 no chocan entre sí.
    # Inscribir N1 + N2 da (0, 2); inscribir P da (1, 0), que es mayor.
    p = Clase(1, "P", "P", [curso(1, "P-1", 5, ("lunes", 7, 11))])
    n1 = Clase(2, "N1", "N1", [curso(2, "N1-1", 5, ("lunes", 7, 9))])
    n2 = Clase(3, "N2", "N2", [curso(3, "N2-1", 5, ("lunes", 9, 11))])
    resultado = mejor_horario([PreferenciaClase(n1), PreferenciaClase(n2), PreferenciaClase(p, True)])
    assert resultado.puntaje == (1, 0, 0.0)
    assert [c.codigo for c in resultado.cursos] == ["P-1"]


def test_clases_iguales_en_prioridad_empatan_hacia_no_inscribir_primero() -> None:
    a = Clase(1, "A", "A", [curso(1, "A-1", 5, ("lunes", 7, 9))])
    b = Clase(2, "B", "B", [curso(2, "B-1", 5, ("lunes", 8, 10))])  # siempre choca con A
    resultado = mejor_horario([PreferenciaClase(a), PreferenciaClase(b)])
    assert resultado.puntaje == (0, 1, 0.0)
    # Empate: "no inscribir A" se evalúa primero y deja libre la hora para B.
    assert [c.codigo for c in resultado.cursos] == ["B-1"]


def test_firma_inicial_bloquea_horas() -> None:
    a = Clase(1, "A", "A", [curso(1, "A-1", 5, ("lunes", 7, 9)), curso(2, "A-2", 5, ("martes", 7, 9))])
    ocupado = Horario("lunes", 7 * 60, 8 * 60).mascara
    resultado = mejor_horario([PreferenciaClase(a)], firma_inicial=ocupado)
    assert [c.codigo for c in resultado.cursos] == ["A-2"]


def test_sin_clases() -> None:
    resultado = mejor_horario([])
    assert resultado.puntaje == (0, 0, 0.0)
    assert resultado.cursos == []
    assert resultado.entradas_tabla == 0


def test_firmas_repetidas_comparten_estado() -> None:
    # Calculo-C y Calculo-D ocupan las mismas horas → llegan al mismo (i, firma).
    resultado = mejor_horario(instancia_ejemplo())
    cota = 1 + 4 + 4 * 3  # estados posibles por nivel sin compartir firmas
    assert resultado.entradas_tabla < cota


@pytest.mark.parametrize("semilla", range(60))
def test_optimo_igual_a_fuerza_bruta(semilla: int) -> None:
    rng = random.Random(semilla)
    _, estudiantes = generar_instancia(
        num_estudiantes=1,
        clases_por_estudiante=rng.randint(1, 5),
        cursos_por_clase=rng.randint(1, 4),
        num_patrones=rng.randint(2, 8),
        cupo_maximo=2,
        semilla=semilla,
    )
    preferencias = estudiantes[0].preferencias_de_clase()
    franjas = estudiantes[0].preferencias.franjas_habilitadas
    profes = estudiantes[0].preferencias.preferencia_profes
    resultado = mejor_horario(preferencias, franjas_habilitadas=franjas, preferencia_profes=profes)
    esperado = fuerza_bruta(preferencias, franjas, profes)
    assert resultado.puntaje[:2] == esperado[:2]
    assert resultado.puntaje[2] == pytest.approx(esperado[2])
    assert sin_cruces(resultado.cursos)
    assert all(c.cupo > 0 for c in resultado.cursos)


# ---------------------------------------------------------------- Nivel 3

def franjas_ejemplo() -> list[Horario]:
    """Franjas con las que el mejor horario del ejemplo es Calculo-C, Fisica-A, Prog-B."""
    return [
        Horario.crear("lunes", "08:00", "13:00"),
        Horario.crear("martes", "14:00", "16:00"),
        Horario.crear("miercoles", "11:00", "13:00"),
        Horario.crear("jueves", "08:00", "10:00"),
        Horario.crear("jueves", "14:00", "16:00"),
    ]


def test_ejemplo_con_franjas() -> None:
    resultado = mejor_horario(instancia_ejemplo(), franjas_habilitadas=franjas_ejemplo())
    # Mismas clases que sin franjas, pero ahora gana el horario que cae dentro de ellas.
    assert resultado.puntaje == (2, 1, 3.0)
    assert [c.codigo for c in resultado.cursos] == ["Calculo-C", "Fisica-A", "Prog-B"]


def test_satisfaccion_por_curso() -> None:
    clases = {c.codigo: c for p in instancia_ejemplo() for c in p.clase.cursos}
    unidas = mascara_franjas(franjas_ejemplo())
    assert satisfaccion_franjas(clases["Calculo-A"], unidas) == 0.25  # solo lun 8-9 de 4 horas
    assert satisfaccion_franjas(clases["Fisica-B"], unidas) == 0.5  # martes sí, viernes no
    assert satisfaccion_franjas(clases["Prog-B"], unidas) == 1.0
    assert satisfaccion_franjas(clases["Prog-B"], mascara_franjas([])) == 0.0  # sin preferencia


def test_satisfaccion_parcial_y_franjas_solapadas() -> None:
    c = Curso(1, "X", 5, [Horario.crear("lunes", "07:00", "10:00")])
    # 2 de sus 3 horas caen en la franja.
    assert satisfaccion_franjas(c, mascara_franjas([Horario.crear("lunes", "08:00", "12:00")])) == pytest.approx(2 / 3)
    # Dos franjas que se solapan no cuentan dos veces la misma hora.
    solapadas = [Horario.crear("lunes", "07:00", "09:00"), Horario.crear("lunes", "08:00", "10:00")]
    assert satisfaccion_franjas(c, mascara_franjas(solapadas)) == 1.0
    # Franja de otro día: no aporta.
    assert satisfaccion_franjas(c, mascara_franjas([Horario.crear("martes", "07:00", "10:00")])) == 0.0


def test_franjas_no_sacrifican_clases() -> None:
    # El único curso de B está fuera de las franjas, pero igual se inscribe:
    # una clase más vale más que cualquier satisfacción.
    a = Clase(1, "A", "A", [curso(1, "A-1", 5, ("lunes", 7, 9))])
    b = Clase(2, "B", "B", [curso(2, "B-1", 5, ("viernes", 18, 20))])
    franjas = [Horario.crear("lunes", "07:00", "09:00")]
    resultado = mejor_horario([PreferenciaClase(a), PreferenciaClase(b)], franjas_habilitadas=franjas)
    assert resultado.puntaje == (0, 2, 1.0)


# ---------------------------------------------------------------- Nivel 4

def clase_con_profes(*cursos: tuple[str, str, Profesor | None]) -> Clase:
    """Clase cuyos cursos son (código, día, profesor), todos de 7 a 9 y con cupo."""
    return Clase(1, "A", "A", [
        Curso(i, codigo, 5, [Horario.crear(dia, "07:00", "09:00")], profe)
        for i, (codigo, dia, profe) in enumerate(cursos, start=1)
    ])


def test_gana_el_profesor_mejor_calificado() -> None:
    p2, p3 = Profesor(1, "P2"), Profesor(2, "P3")
    clase = clase_con_profes(("A-1", "lunes", p2), ("A-2", "martes", p3))
    profes = [PreferenciaProfe(p2, 2), PreferenciaProfe(p3, 3)]
    resultado = mejor_horario([PreferenciaClase(clase)], preferencia_profes=profes)
    assert [c.codigo for c in resultado.cursos] == ["A-2"]
    assert resultado.puntaje == (0, 1, 1.0)


def test_calificacion_cero_descarta_el_curso() -> None:
    vetado = Profesor(1, "Vetado")
    clase = clase_con_profes(("A-1", "lunes", vetado))
    resultado = mejor_horario([PreferenciaClase(clase, True)], preferencia_profes=[PreferenciaProfe(vetado, 0)])
    # Aunque la clase es prioritaria, no se inscribe con un profesor calificado con 0.
    assert resultado.cursos == []
    assert resultado.puntaje == (0, 0, 0.0)


def test_profesor_sin_calificar_vale_cero_y_no_se_descarta() -> None:
    p1, otro = Profesor(1, "P1"), Profesor(2, "Otro")
    clase = clase_con_profes(("A-1", "lunes", otro), ("A-2", "martes", None))
    resultado = mejor_horario([PreferenciaClase(clase)], preferencia_profes=[PreferenciaProfe(p1, 2)])
    assert [c.codigo for c in resultado.cursos] == ["A-1"]  # empate en 0: gana el primero
    assert resultado.puntaje == (0, 1, 0.0)


def test_franjas_y_profesor_se_suman() -> None:
    # A-1: dentro de la franja, profesor calificado 1 → 1 + 1/3 = 1.33
    # A-2: fuera de la franja, profesor calificado 3 → 0 + 1.0 = 1.0
    p1, p3 = Profesor(1, "P1"), Profesor(2, "P3")
    clase = clase_con_profes(("A-1", "lunes", p1), ("A-2", "martes", p3))
    resultado = mejor_horario(
        [PreferenciaClase(clase)],
        franjas_habilitadas=[Horario.crear("lunes", "07:00", "12:00")],
        preferencia_profes=[PreferenciaProfe(p1, 1), PreferenciaProfe(p3, 3)],
    )
    assert [c.codigo for c in resultado.cursos] == ["A-1"]
    assert resultado.puntaje == pytest.approx((0, 1, 1 + 1 / 3))


def test_preferencia_fuera_de_rango() -> None:
    with pytest.raises(ValueError):
        PreferenciaProfe(Profesor(1), 4)
    with pytest.raises(ValueError):
        PreferenciaProfe(Profesor(1), -1)

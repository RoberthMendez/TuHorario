import itertools
import random

import pytest

from algoritmo.generador import generar_instancia
from algoritmo.cercania import Campus, penalizacion_cursos
from algoritmo.huecos import horas_de_hueco, penalizacion_huecos
from algoritmo.franjas import mascara_franjas, satisfaccion_franjas
from algoritmo.modelos import Clase, Curso, Edificio, Horario, PreferenciaClase, PreferenciaProfe, PrioridadPreferencia, Profesor, Salon
from algoritmo.pd_estudiante import mejor_horario
from algoritmo.pesos import PESOS_IGUALES, Pesos, calcular_pesos
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
    bono: dict[int, float],
    cercania: bool = False,
    sin_huecos: bool = False,
    w: Pesos = PESOS_IGUALES,
) -> tuple[int, int, float]:
    """Mejor (prioritarias, no_prioritarias, satisfaccion) probando todas las combinaciones."""
    unidas = mascara_franjas(franjas)
    calif = calificaciones(profes)
    campus = Campus([c for p in preferencias for c in p.clase.cursos])
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
            satisf += (w.horarios * satisfaccion_franjas(c, unidas) + w.profesores * satisfaccion_profesor(c, calif)
                       + w.estudiantes * bono.get(c.id, 0.0))
            if p.prioridad:
                prio += 1
            else:
                no_prio += 1
        if valida:
            if cercania:
                satisf -= w.cercania * penalizacion_cursos([c for c in combinacion if c is not None], campus)
            if sin_huecos:
                satisf -= w.huecos * penalizacion_huecos(firma)
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
    # Bono de compañeros aleatorio por curso (Nivel 5), también negativo.
    bono = {c.id: rng.choice([-1.0, 0.0, 0.0, 1.0, 2.0]) for p in preferencias for c in p.clase.cursos}
    cercania = rng.random() < 0.5  # Nivel 6
    sin_huecos = rng.random() < 0.5  # Nivel 7
    w = calcular_pesos(estudiantes[0].preferencias.prioridad_preferencias)  # Nivel 8
    resultado = mejor_horario(preferencias, franjas_habilitadas=franjas, preferencia_profes=profes,
                              bono_companeros=bono, preferencia_cercania=cercania,
                              preferencia_sin_huecos=sin_huecos, pesos=w)
    esperado = fuerza_bruta(preferencias, franjas, profes, bono, cercania, sin_huecos, w)
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


# ---------------------------------------------------------------- Nivel 6

CERCA = Edificio(1, "Cerca", 0, 0)
MEDIO = Edificio(2, "Medio", 30, 40)  # a 50 de Cerca
LEJOS = Edificio(3, "Lejos", 60, 80)  # a 100 de Cerca: distancia máxima


def curso_en(id_: int, codigo: str, edificio: Edificio, dia: str, inicio: int, fin: int) -> Curso:
    return Curso(id_, codigo, 5, [Horario(dia, inicio * 60, fin * 60)], salones=[Salon(id_, f"S{id_}", edificio)])


def test_distancia_entre_edificios() -> None:
    assert CERCA.calcular_distancia(MEDIO) == 50
    assert CERCA.calcular_distancia(CERCA) == 0


@pytest.mark.parametrize(
    ("dia_b", "inicio_b", "edificio_b", "esperada"),
    [
        ("lunes", 9, LEJOS, 1.0),  # justo después y en el edificio más lejano
        ("lunes", 9, MEDIO, 0.5),  # justo después, a la mitad de la distancia máxima
        ("lunes", 10, LEJOS, 0.0),  # 1 hora de hueco: ya no se penaliza
        ("lunes", 11, LEJOS, 0.0),  # 2 horas de hueco: tampoco
        ("martes", 9, LEJOS, 0.0),  # otro día
        ("lunes", 9, CERCA, 0.0),  # mismo edificio
    ],
)
def test_penalizacion_de_cercania(dia_b: str, inicio_b: int, edificio_b: Edificio, esperada: float) -> None:
    a = curso_en(1, "A", CERCA, "lunes", 7, 9)
    b = curso_en(2, "B", edificio_b, dia_b, inicio_b, inicio_b + 2)
    campus = Campus([a, b, curso_en(3, "X", CERCA, "sabado", 7, 8), curso_en(4, "Y", LEJOS, "sabado", 9, 10)])
    assert penalizacion_cursos([a, b], campus) == pytest.approx(esperada)


def test_cercania_elige_la_seccion_del_edificio_cercano() -> None:
    a = Clase(1, "A", "A", [curso_en(1, "A-1", CERCA, "lunes", 7, 9)])
    b = Clase(2, "B", "B", [curso_en(2, "B-lejos", LEJOS, "lunes", 9, 11), curso_en(3, "B-cerca", CERCA, "lunes", 9, 11)])
    prefs = [PreferenciaClase(a), PreferenciaClase(b)]
    sin = mejor_horario(prefs)
    assert [c.codigo for c in sin.cursos] == ["A-1", "B-lejos"]  # sin la preferencia: empate, gana el primero
    con = mejor_horario(prefs, preferencia_cercania=True)
    assert [c.codigo for c in con.cursos] == ["A-1", "B-cerca"]
    assert con.puntaje == (0, 2, 0.0)


def test_cercania_no_hace_perder_clases() -> None:
    a = Clase(1, "A", "A", [curso_en(1, "A-1", CERCA, "lunes", 7, 9)])
    b = Clase(2, "B", "B", [curso_en(2, "B-lejos", LEJOS, "lunes", 9, 11)])
    resultado = mejor_horario([PreferenciaClase(a), PreferenciaClase(b)], preferencia_cercania=True)
    assert len(resultado.cursos) == 2
    assert resultado.puntaje == pytest.approx((0, 2, -1.0))


def test_cercania_cuenta_los_cursos_fijos() -> None:
    fijo = curso_en(1, "P-1", CERCA, "lunes", 7, 9)
    b = Clase(2, "B", "B", [curso_en(2, "B-lejos", LEJOS, "lunes", 9, 11), curso_en(3, "B-cerca", CERCA, "lunes", 9, 11)])
    resultado = mejor_horario([PreferenciaClase(b)], firma_inicial=fijo.mascara, preferencia_cercania=True,
                              cursos_fijos=[fijo])
    assert [c.codigo for c in resultado.cursos] == ["B-cerca"]


def test_salones_deben_coincidir_con_las_sesiones() -> None:
    sesiones = [Horario.crear("lunes", "07:00", "09:00"), Horario.crear("martes", "07:00", "09:00")]
    salon = Salon(1, "S1", CERCA)
    Curso(1, "X", 5, sesiones, salones=[salon])  # un salón para todas
    Curso(2, "Y", 5, sesiones, salones=[salon, salon])  # uno por sesión
    with pytest.raises(ValueError):
        Curso(3, "Z", 5, sesiones, salones=[salon, salon, salon])


# ---------------------------------------------------------------- Nivel 7

def mascara(*sesiones: tuple[str, int, int]) -> int:
    m = 0
    for dia, inicio, fin in sesiones:
        m |= Horario(dia, inicio * 60, fin * 60).mascara
    return m


@pytest.mark.parametrize(
    ("sesiones", "esperado"),
    [
        ((), 0),
        ((("lunes", 7, 9),), 0),
        ((("lunes", 7, 9), ("lunes", 9, 11)), 0),  # seguidas
        ((("lunes", 7, 9), ("lunes", 11, 13)), 2),  # hueco de 9 a 11
        ((("lunes", 7, 8), ("lunes", 10, 11), ("lunes", 14, 15)), 5),  # 2 + 3
        ((("lunes", 7, 9), ("martes", 11, 13)), 0),  # días distintos no cuentan
        ((("lunes", 7, 8), ("lunes", 20, 21), ("sabado", 7, 8), ("sabado", 9, 10)), 13),  # 12 + 1
    ],
)
def test_horas_de_hueco(sesiones: tuple, esperado: int) -> None:
    assert horas_de_hueco(mascara(*sesiones)) == esperado


def test_sin_huecos_elige_la_seccion_seguida() -> None:
    a = Clase(1, "A", "A", [curso(1, "A-1", 5, ("lunes", 7, 9))])
    b = Clase(2, "B", "B", [curso(2, "B-tarde", 5, ("lunes", 13, 15)), curso(3, "B-seguida", 5, ("lunes", 9, 11))])
    prefs = [PreferenciaClase(a), PreferenciaClase(b)]
    assert [c.codigo for c in mejor_horario(prefs).cursos] == ["A-1", "B-tarde"]  # empate: gana el primero
    resultado = mejor_horario(prefs, preferencia_sin_huecos=True)
    assert [c.codigo for c in resultado.cursos] == ["A-1", "B-seguida"]
    assert resultado.puntaje == (0, 2, 0.0)


def test_sin_huecos_no_hace_perder_clases() -> None:
    a = Clase(1, "A", "A", [curso(1, "A-1", 5, ("lunes", 7, 9))])
    b = Clase(2, "B", "B", [curso(2, "B-tarde", 5, ("lunes", 13, 15))])
    resultado = mejor_horario([PreferenciaClase(a), PreferenciaClase(b)], preferencia_sin_huecos=True)
    assert len(resultado.cursos) == 2
    assert resultado.puntaje == pytest.approx((0, 2, -4 / 12))


def test_sin_huecos_cuenta_las_horas_ya_ocupadas() -> None:
    ocupado = mascara(("lunes", 7, 9))
    b = Clase(2, "B", "B", [curso(2, "B-tarde", 5, ("lunes", 13, 15)), curso(3, "B-seguida", 5, ("lunes", 9, 11))])
    resultado = mejor_horario([PreferenciaClase(b)], firma_inicial=ocupado, preferencia_sin_huecos=True)
    assert [c.codigo for c in resultado.cursos] == ["B-seguida"]


def test_sin_huecos_no_agranda_la_tabla() -> None:
    prefs = instancia_ejemplo()
    assert mejor_horario(prefs, preferencia_sin_huecos=True).entradas_tabla == mejor_horario(prefs).entradas_tabla


# ---------------------------------------------------------------- Nivel 8

def test_pesos_sin_ranking_valen_uno() -> None:
    assert calcular_pesos([]) == Pesos(1, 1, 1, 1, 1)


def test_pesos_duplican_por_posicion_y_suman_m() -> None:
    w = calcular_pesos([
        PrioridadPreferencia("cercania", 1),
        PrioridadPreferencia("profesores", 2),
        PrioridadPreferencia("horarios", 3),
    ])
    # 2^(3-1), 2^(3-2), 2^(3-3) = 4, 2, 1, escalados por 3/7 para que sumen 3.
    assert w.cercania == pytest.approx(12 / 7)
    assert w.profesores == pytest.approx(6 / 7)
    assert w.horarios == pytest.approx(3 / 7)
    assert w.cercania == 2 * w.profesores == 4 * w.horarios
    # Lo que no está en el ranking no se tiene en cuenta.
    assert w.estudiantes == 0 and w.huecos == 0


def test_ranking_usa_el_orden_no_el_numero() -> None:
    # Prioridades 2 y 5 (con huecos en la numeración) equivalen a 1 y 2.
    a = calcular_pesos([PrioridadPreferencia("horarios", 2), PrioridadPreferencia("huecos", 5)])
    b = calcular_pesos([PrioridadPreferencia("horarios", 1), PrioridadPreferencia("huecos", 2)])
    assert a == b


def test_ranking_invalido() -> None:
    with pytest.raises(ValueError):
        PrioridadPreferencia("colores", 1)
    with pytest.raises(ValueError):
        PrioridadPreferencia("horarios", 7)
    with pytest.raises(ValueError):
        calcular_pesos([PrioridadPreferencia("horarios", 1), PrioridadPreferencia("horarios", 2)])


def test_el_ranking_decide_entre_profesor_y_franja() -> None:
    # A-1: profesor calificado 3 pero fuera de la franja; A-2: dentro de la franja, sin calificar.
    p3 = Profesor(1, "P3")
    clase = Clase(1, "A", "A", [
        Curso(1, "A-1", 5, [Horario.crear("lunes", "07:00", "09:00")], p3),
        Curso(2, "A-2", 5, [Horario.crear("martes", "07:00", "09:00")]),
    ])
    prefs = [PreferenciaClase(clase)]
    franjas = [Horario.crear("martes", "07:00", "12:00")]
    profes = [PreferenciaProfe(p3, 3)]

    def elegido(*ranking: str) -> str:
        w = calcular_pesos([PrioridadPreferencia(t, i) for i, t in enumerate(ranking, start=1)])
        r = mejor_horario(prefs, franjas_habilitadas=franjas, preferencia_profes=profes, pesos=w)
        return r.cursos[0].codigo

    assert elegido("profesores", "horarios") == "A-1"
    assert elegido("horarios", "profesores") == "A-2"
    assert elegido("profesores") == "A-1"  # las franjas no están en el ranking: pesan 0
    assert elegido("horarios") == "A-2"


def test_clases_en_el_ranking_no_hace_perder_clases() -> None:
    # Aunque "clases" quede de último, una clase más sigue valiendo más que cualquier preferencia.
    a = Clase(1, "A", "A", [curso(1, "A-1", 5, ("lunes", 7, 9))])
    b = Clase(2, "B", "B", [curso(2, "B-1", 5, ("lunes", 13, 15))])
    w = calcular_pesos([PrioridadPreferencia("huecos", 1), PrioridadPreferencia("clases", 2)])
    resultado = mejor_horario([PreferenciaClase(a), PreferenciaClase(b)], preferencia_sin_huecos=True, pesos=w)
    assert len(resultado.cursos) == 2


def test_peso_cero_en_cercania_no_agranda_la_tabla() -> None:
    prefs = instancia_ejemplo()
    for p in prefs:
        for c in p.clase.cursos:
            c.salones = [Salon(c.id, "S", Edificio(c.id % 2, "E", c.id % 2 * 100, 0))]
    sin = mejor_horario(prefs).entradas_tabla
    w = calcular_pesos([PrioridadPreferencia("horarios", 1)])
    assert mejor_horario(prefs, preferencia_cercania=True, pesos=w).entradas_tabla == sin

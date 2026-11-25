"""Preferencias no cumplidas: casos armados a mano con objetos ORM (sin base)."""

from app import models
from app.core.dias import DIAS
from app.services.cumplimiento_service import no_cumplidas

CENTRAL = models.Edificio(id=1, nombre="Central", coordenada_x=0, coordenada_y=0)
LEJANO = models.Edificio(id=2, nombre="Lejano", coordenada_x=500, coordenada_y=0)
CALCULO = models.Clase(id=1, codigo="MAT-1", nombre="Cálculo")
FISICA = models.Clase(id=2, codigo="FIS-1", nombre="Física")
NATALIA = models.Profesor(id=1, nombre="Natalia", genero="femenino")
PEDRO = models.Profesor(id=2, nombre="Pedro", genero="masculino")


def curso(id_, clase, sesiones, profesor=None, edificio=CENTRAL):
    """``sesiones``: [(dia, hora_inicio, hora_fin)] con horas enteras."""
    return models.Curso(
        id=id_,
        codigo=f"{clase.codigo}-{id_}",
        cupo=30,
        clase_id=clase.id,
        clase=clase,
        profesor_id=profesor.id if profesor else None,
        profesor=profesor,
        salon_horarios=[
            models.SalonHorario(
                dia=d, dia_orden=DIAS.index(d), hora_inicio=i * 60, hora_fin=f * 60,
                salon=models.Salon(codigo="S", edificio=edificio),
            )
            for d, i, f in sesiones
        ],
    )


def estudiante(id_, nombre):
    return models.Estudiante(id=id_, nombre=nombre)


def prefs(**kw):
    p = models.PreferenciasDeEstudiante(
        preferencia_cercania=kw.pop("cercania", False), preferencia_sin_huecos=kw.pop("huecos", False)
    )
    p.preferencia_clases = [
        models.PreferenciaClase(clase_id=c.id, clase=c, prioridad=prio) for c, prio in kw.pop("clases", [])
    ]
    p.franjas_habilitadas = [
        models.FranjaHabilitada(dia=d, hora_inicio=i * 60, hora_fin=f * 60) for d, i, f in kw.pop("franjas", [])
    ]
    p.preferencia_profes = [
        models.PreferenciaProfe(profesor_id=pr.id, profesor=pr, preferencia=n) for pr, n in kw.pop("profes", [])
    ]
    p.preferencia_estudiantes = [
        models.PreferenciaCompanero(estudiante_preferido_id=e.id, estudiante_preferido=e, clase_id=c.id, clase=c)
        for e, c in kw.pop("companeros", [])
    ]
    p.estudiantes_restringidos = kw.pop("restringidos", [])
    assert not kw
    return p


def tipos(resultado):
    return [(r.tipo, r.id_clase) for r in resultado]


def test_todo_cumplido_no_reporta_nada() -> None:
    ana = estudiante(2, "Ana")
    c = curso(1, CALCULO, [("lunes", 7, 9)], profesor=NATALIA)
    p = prefs(
        clases=[(CALCULO, True)],
        franjas=[("lunes", 7, 12)],
        profes=[(NATALIA, 3), (PEDRO, 1)],
        companeros=[(ana, CALCULO)],
        huecos=True,
        cercania=True,
    )
    assert no_cumplidas(p, [c], {2: [c]}, {1: [1], 2: [1]}) == []


def test_sin_preferencias() -> None:
    assert no_cumplidas(None, [], {}, {}) == []


def test_clase_no_asignada() -> None:
    p = prefs(clases=[(CALCULO, True), (FISICA, False)])
    c = curso(1, FISICA, [("lunes", 7, 9)])
    [r] = no_cumplidas(p, [c], {}, {})
    assert (r.tipo, r.id_clase) == ("clases", CALCULO.id)
    assert r.detalle == "No te asignaron Cálculo (era prioritaria)."
    assert (r.caso, r.clase.nombre, r.prioridad) == ("claseSinCupo", "Cálculo", True)


def test_franjas_fuera_y_en_parte_fuera() -> None:
    p = prefs(franjas=[("lunes", 7, 8), ("miercoles", 14, 16)])
    c = curso(1, CALCULO, [("lunes", 7, 9), ("miercoles", 14, 16), ("viernes", 7, 9)])
    resultado = no_cumplidas(p, [c], {}, {})
    assert [r.detalle for r in resultado] == [
        "Cálculo el lunes de 07:00 a 09:00 queda en parte fuera de tus franjas.",
        "Cálculo el viernes de 07:00 a 09:00 queda fuera de tus franjas.",
    ]
    assert [(r.caso, r.dia, r.hora_inicio, r.hora_fin, r.parcial) for r in resultado] == [
        ("fueraDeFranja", "lunes", "07:00", "09:00", True),
        ("fueraDeFranja", "viernes", "07:00", "09:00", False),
    ]


def test_sin_franjas_no_reporta_horarios() -> None:
    c = curso(1, CALCULO, [("sabado", 18, 21)])
    assert no_cumplidas(prefs(), [c], {}, {}) == []


def test_profesor_peor_calificado_vetado_o_sin_calificar() -> None:
    # Pedro dicta Cálculo (3) y Física; Natalia dicta Cálculo y Física (1).
    clases_de = {NATALIA.id: [1, 2], PEDRO.id: [1, 2]}
    p = prefs(profes=[(NATALIA, 1), (PEDRO, 3)])
    con_natalia = curso(1, CALCULO, [("lunes", 7, 9)], profesor=NATALIA)
    [r] = no_cumplidas(p, [con_natalia], {}, clases_de)
    assert r.tipo == "profesores"
    assert r.detalle == "En Cálculo te tocó Natalia (1/3) y preferías a Pedro (3/3)."
    assert r.caso == "otroProfesor"
    assert (r.profesor.nombre, r.profesor.genero, r.profesor.nota) == ("Natalia", "femenino", 1)
    assert (r.preferido.nombre, r.preferido.genero, r.preferido.nota) == ("Pedro", "masculino", 3)

    vetado = prefs(profes=[(NATALIA, 0)])
    [r] = no_cumplidas(vetado, [con_natalia], {}, clases_de)
    assert r.detalle == "En Cálculo te tocó Natalia, a quien no querías ver."
    assert (r.caso, r.clase.nombre, r.profesor.nombre, r.profesor.nota) == ("profesorVetado", "Cálculo", "Natalia", 0)

    sin_profe = curso(2, FISICA, [("lunes", 7, 9)])
    [r] = no_cumplidas(prefs(profes=[(PEDRO, 2)]), [sin_profe], {}, clases_de)
    assert r.detalle == "En Física te tocó un curso sin profesor (sin calificar) y preferías a Pedro (2/3)."
    assert (r.caso, r.profesor, r.preferido.nota) == ("otroProfesor", None, 2)


def test_profesor_que_no_dicta_la_clase_no_cuenta() -> None:
    c = curso(1, CALCULO, [("lunes", 7, 9)], profesor=NATALIA)
    # Pedro solo dicta Física: que no le haya tocado en Cálculo no es incumplimiento.
    assert no_cumplidas(prefs(profes=[(PEDRO, 3)]), [c], {}, {PEDRO.id: [2]}) == []
    # Solo vetó a Pedro: cualquier otro profesor le sirve.
    assert no_cumplidas(prefs(profes=[(PEDRO, 0)]), [c], {}, {PEDRO.id: [1]}) == []


def test_companeros() -> None:
    beto, caro, dani = estudiante(2, "Beto"), estudiante(3, "Caro"), estudiante(4, "Dani")
    mio = curso(1, CALCULO, [("lunes", 7, 9)])
    otro = curso(2, CALCULO, [("martes", 7, 9)])
    p = prefs(companeros=[(beto, CALCULO), (caro, CALCULO), (dani, FISICA)])
    resultado = no_cumplidas(p, [mio], {2: [otro], 3: []}, {})
    assert [r.detalle for r in resultado] == [
        "No quedaste con Beto en Cálculo: tú quedaste en MAT-1-1 y Beto en MAT-1-2.",
        "No quedaste con Caro en Cálculo: Caro no quedó inscrito en esa clase.",
        "No quedaste con Dani en Física: no te asignaron la clase.",
    ]
    assert [(r.caso, r.companero.nombre, r.motivo, r.curso, r.curso_companero) for r in resultado] == [
        ("sinCompanero", "Beto", "otroCurso", "MAT-1-1", "MAT-1-2"),
        ("sinCompanero", "Caro", "companeroSinClase", "MAT-1-1", None),
        ("sinCompanero", "Dani", "sinClase", None, None),
    ]


def test_restringido_en_el_mismo_curso() -> None:
    eva = estudiante(5, "Eva")
    c1, c2 = curso(1, CALCULO, [("lunes", 7, 9)]), curso(2, FISICA, [("martes", 7, 9)])
    resultado = no_cumplidas(prefs(restringidos=[eva]), [c1, c2], {5: [c2]}, {})
    assert tipos(resultado) == [("estudiantes", FISICA.id)]
    assert resultado[0].detalle == "Quedaste con Eva en Física (FIS-1-2)."
    r = resultado[0]
    assert (r.caso, r.restringido.id, r.restringido.nombre, r.curso) == ("conRestringido", 5, "Eva", "FIS-1-2")


def test_cercania_solo_clases_seguidas_en_edificios_distintos() -> None:
    a = curso(1, CALCULO, [("lunes", 7, 9), ("martes", 7, 9)])
    b = curso(2, FISICA, [("lunes", 9, 11), ("martes", 10, 12)], edificio=LEJANO)
    [r] = no_cumplidas(prefs(cercania=True), [a, b], {}, {})
    assert (r.tipo, r.id_clase) == ("cercania", None)
    assert r.detalle == "El lunes a las 09:00 pasas de Cálculo en Central a Física en Lejano sin tiempo libre."
    assert (r.caso, r.dia, r.hora) == ("sinDescanso", "lunes", "09:00")
    assert (r.desde.clase.nombre, r.desde.edificio) == ("Cálculo", "Central")
    assert (r.hasta.clase.nombre, r.hasta.edificio) == ("Física", "Lejano")
    assert no_cumplidas(prefs(), [a, b], {}, {}) == []


def test_huecos_por_dia() -> None:
    a = curso(1, CALCULO, [("lunes", 7, 9), ("miercoles", 7, 9)])
    b = curso(2, FISICA, [("lunes", 11, 13), ("miercoles", 9, 11)])
    c = curso(3, FISICA, [("lunes", 14, 15)])
    [r] = no_cumplidas(prefs(huecos=True), [a, b, c], {}, {})
    assert r.tipo == "huecos"
    assert r.detalle == "El lunes tienes 3 horas libres entre clases (09:00–11:00, 13:00–14:00)."
    assert (r.caso, r.dia, r.horas) == ("horasLibres", "lunes", 3)
    assert [(t.hora_inicio, t.hora_fin) for t in r.tramos] == [("09:00", "11:00"), ("13:00", "14:00")]
    assert no_cumplidas(prefs(), [a, b, c], {}, {}) == []


def test_orden_por_tipo() -> None:
    c = curso(1, CALCULO, [("lunes", 7, 9), ("lunes", 12, 13)], profesor=NATALIA)
    p = prefs(
        clases=[(FISICA, False)], franjas=[("martes", 7, 9)], profes=[(NATALIA, 0)], huecos=True
    )
    assert [r.tipo for r in no_cumplidas(p, [c], {}, {NATALIA.id: [1]})] == [
        "clases", "horarios", "horarios", "profesores", "huecos",
    ]

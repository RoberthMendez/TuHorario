from collections import Counter

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.core.dias import a_minutos, se_cruzan
from app.models import Curso, inscripciones

ANALISIS = 13  # Análisis de Algoritmos


def crear(client, nombre: str, preferencias: dict | None = None) -> int:
    id_estudiante = client.post("/estudiantes", json={"nombre": nombre}).json()["id"]
    if preferencias is not None:
        respuesta = client.put(f"/estudiantes/{id_estudiante}/preferencias", json=preferencias)
        assert respuesta.status_code == 200, respuesta.text
    return id_estudiante


def generar(client, ids: list[int]) -> list[dict]:
    respuesta = client.post("/horarios/generar", json={"idsEstudiantes": ids})
    assert respuesta.status_code == 200, respuesta.text
    return respuesta.json()


def cupo_uno(db: Session, id_clase: int) -> int:
    """Deja en 1 el cupo de cada curso de la clase y devuelve cuántos cursos tiene."""
    db.execute(update(Curso).where(Curso.clase_id == id_clase).values(cupo=1))
    db.commit()
    return len(db.scalars(select(Curso).where(Curso.clase_id == id_clase)).all())


def sin_cruces(horario: dict) -> bool:
    sesiones = [
        (s["dia"], a_minutos(s["horaInicio"]), a_minutos(s["horaFin"]))
        for c in horario["cursos"]
        for s in c["sesiones"]
    ]
    return not any(se_cruzan(a, b) for i, a in enumerate(sesiones) for b in sesiones[i + 1 :])


def test_flujo_completo(client, db: Session) -> None:
    ana = crear(client, "Ana Ruiz")
    beto = crear(client, "Beto Díaz")
    pedidas = [{"idClase": c, "prioridad": c == 1} for c in (1, 4, 7, 10, 14)]
    client.put(
        f"/estudiantes/{ana}/preferencias",
        json={
            "clases": pedidas,
            "franjasHabilitadas": [{"dia": "lunes", "horaInicio": "07:00", "horaFin": "21:00"}],
            "profesores": [{"idProfesor": 2, "preferencia": 0}],
            "companeros": [{"idEstudiante": beto, "idClase": 1}],
            "preferenciaSinHuecos": True,
            "preferenciaCercania": True,
            "prioridades": [
                {"tipoPreferencia": "estudiantes", "prioridad": 1},
                {"tipoPreferencia": "huecos", "prioridad": 2},
            ],
        },
    ).raise_for_status()
    client.put(f"/estudiantes/{beto}/preferencias", json={"clases": pedidas[:3]}).raise_for_status()

    horarios = generar(client, [ana, beto])
    assert [h["idEstudiante"] for h in horarios] == [ana, beto]
    assert horarios[0]["nombre"] == "Ana Ruiz"
    for h in horarios:
        assert sin_cruces(h)
        pedidas_h = len(pedidas) if h["idEstudiante"] == ana else 3
        assert len(h["cursos"]) + len(h["clasesNoAsignadas"]) == pedidas_h
    curso = horarios[0]["cursos"][0]
    assert set(curso) == {"id", "codigo", "clase", "profesor", "sesiones"}
    assert set(curso["sesiones"][0]) == {"dia", "horaInicio", "horaFin", "salon"}
    assert set(curso["sesiones"][0]["salon"]) == {"codigo", "edificio"}
    # Profesor vetado (0): nunca le asigna un curso suyo.
    assert all((c["profesor"] or {}).get("id") != 2 for c in horarios[0]["cursos"])

    # Quedó guardado en la base y GET devuelve lo mismo.
    guardadas = db.execute(select(inscripciones)).all()
    assert len(guardadas) == sum(len(h["cursos"]) for h in horarios)
    leidos = client.get("/horarios", params={"estudiantes": f"{ana},{beto}"})
    assert leidos.status_code == 200
    assert leidos.json() == horarios

    # Volver a generar reemplaza (no duplica) las inscripciones.
    assert generar(client, [ana, beto]) == horarios
    assert len(db.execute(select(inscripciones)).all()) == len(guardadas)


def test_respeta_cupos_y_prioritarias_primero(client, db: Session) -> None:
    cursos = cupo_uno(db, ANALISIS)
    prioritarios = [crear(client, f"Prio {i}", {"clases": [{"idClase": ANALISIS, "prioridad": True}]}) for i in range(cursos)]
    otro = crear(client, "Sin Prioridad", {"clases": [{"idClase": ANALISIS, "prioridad": False}]})

    horarios = {h["idEstudiante"]: h for h in generar(client, [otro, *prioritarios])}
    assert all(len(horarios[i]["cursos"]) == 1 for i in prioritarios)
    assert horarios[otro]["cursos"] == []
    assert horarios[otro]["clasesNoAsignadas"] == [
        {"clase": {"id": ANALISIS, "codigo": "SIS-301", "nombre": "Análisis de Algoritmos"}, "prioridad": False}
    ]
    por_curso = Counter(c for (c, _) in db.execute(select(inscripciones.c.curso_id, inscripciones.c.estudiante_id)))
    assert max(por_curso.values()) == 1


def test_cupo_ocupado_por_otra_corrida(client, db: Session) -> None:
    cursos = cupo_uno(db, ANALISIS)
    primeros = [crear(client, f"Primero {i}", {"clases": [{"idClase": ANALISIS}]}) for i in range(cursos)]
    generar(client, primeros)
    tarde = crear(client, "Llega Tarde", {"clases": [{"idClase": ANALISIS, "prioridad": True}]})
    # Los inscritos de otra corrida conservan su cupo, aunque el nuevo lo pida con prioridad.
    assert generar(client, [tarde])[0]["cursos"] == []
    # Al volver a generar a uno de los primeros, su propio cupo sí está disponible.
    assert len(generar(client, [primeros[0]])[0]["cursos"]) == 1


def test_companero_fuera_de_la_corrida_no_rompe(client) -> None:
    beto = crear(client, "Beto Díaz", {"clases": [{"idClase": 1}]})
    caro = crear(client, "Caro León", {"clases": [{"idClase": 1}]})
    ana = crear(
        client,
        "Ana Ruiz",
        {
            "clases": [{"idClase": 1}, {"idClase": 7}],
            "companeros": [{"idEstudiante": beto, "idClase": 1}],
            "restringidos": [caro],
        },
    )
    horarios = generar(client, [ana])
    assert len(horarios) == 1
    assert len(horarios[0]["cursos"]) == 2


def test_estudiante_sin_preferencias_e_inexistente(client) -> None:
    solo = crear(client, "Sin Nada")
    assert generar(client, [solo]) == [
        {"idEstudiante": solo, "nombre": "Sin Nada", "cursos": [], "clasesNoAsignadas": []}
    ]
    assert client.post("/horarios/generar", json={"idsEstudiantes": [solo, 999]}).status_code == 404
    assert client.post("/horarios/generar", json={"idsEstudiantes": []}).status_code == 422
    assert client.get("/horarios", params={"estudiantes": "999"}).status_code == 404

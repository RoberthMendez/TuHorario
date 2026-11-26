"""Ejemplo de la sustentación (``POST /ejemplo``): usa todas las preferencias,
su resultado muestra cada caso y siempre sale igual."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.ejemplo import ESTUDIANTES
from app.models import Estudiante

NOMBRES = [e.nombre for e in ESTUDIANTES]


def cargar(client) -> list[dict]:
    respuesta = client.post("/ejemplo")
    assert respuesta.status_code == 201, respuesta.text
    return respuesta.json()


def generar(client, estudiantes: list[dict]) -> list[dict]:
    respuesta = client.post("/horarios/generar", json={"idsEstudiantes": [e["id"] for e in estudiantes]})
    assert respuesta.status_code == 200, respuesta.text
    return respuesta.json()


def resumen(horarios: list[dict]) -> dict[str, tuple]:
    """Por nombre: cursos inscritos y preferencias no cumplidas (sin ids, que cambian en cada carga)."""
    return {
        h["nombre"]: (
            sorted(c["codigo"] for c in h["cursos"]),
            [(p["caso"], p["detalle"]) for p in h["preferenciasNoCumplidas"]],
        )
        for h in horarios
    }


def test_crea_los_10_estudiantes_con_todas_las_preferencias(client) -> None:
    estudiantes = cargar(client)
    assert [e["nombre"] for e in estudiantes] == NOMBRES
    ids = {e["id"] for e in estudiantes}

    todas = [client.get(f"/estudiantes/{e['id']}/preferencias").json() for e in estudiantes]
    assert all(p["clases"] for p in todas)
    assert {c["prioridad"] for p in todas for c in p["clases"]} == {True, False}
    assert any(p["franjasHabilitadas"] for p in todas)
    assert {x["preferencia"] for p in todas for x in p["profesores"]} == {0, 1, 2, 3}
    assert any(p["companeros"] for p in todas)
    assert any(p["restringidos"] for p in todas)
    assert any(p["preferenciaCercania"] for p in todas)
    assert any(p["preferenciaSinHuecos"] for p in todas)
    tipos = {x["tipoPreferencia"] for p in todas for x in p["prioridades"]}
    assert tipos == {"clases", "horarios", "profesores", "estudiantes", "cercania", "huecos"}
    # Los compañeros y restringidos son estudiantes del mismo ejemplo.
    otros = {c["idEstudiante"] for p in todas for c in p["companeros"]} | {r for p in todas for r in p["restringidos"]}
    assert otros <= ids


def test_el_resultado_muestra_todos_los_casos(client) -> None:
    horarios = generar(client, cargar(client))
    no_cumplidas = [p for h in horarios for p in h["preferenciasNoCumplidas"]]

    # A alguien se le cumple todo y a alguien se le incumple cada tipo de preferencia.
    assert any(not h["preferenciasNoCumplidas"] for h in horarios)
    assert {p["tipo"] for p in no_cumplidas} == {"clases", "horarios", "profesores", "estudiantes", "cercania", "huecos"}
    # Todos los casos menos "profesorVetado", que el algoritmo nunca produce (descarta esos cursos).
    assert {p["caso"] for p in no_cumplidas} == {
        "claseSinCupo",
        "fueraDeFranja",
        "otroProfesor",
        "sinCompanero",
        "conRestringido",
        "sinDescanso",
        "horasLibres",
    }
    assert {p["parcial"] for p in no_cumplidas if p["caso"] == "fueraDeFranja"} == {True, False}
    assert {p["motivo"] for p in no_cumplidas if p["caso"] == "sinCompanero"} == {
        "sinClase",
        "companeroSinClase",
        "otroCurso",
    }


def test_siempre_sale_igual_y_reemplaza_la_carga_anterior(client, db: Session) -> None:
    ana = client.post("/estudiantes", json={"nombre": "Ana Ruiz"}).json()["id"]
    antes = resumen(generar(client, cargar(client)))

    # La primera carga quedó inscrita; al volver a cargar se borra y no le quita cupos a la nueva.
    segunda = cargar(client)
    assert db.scalar(select(func.count()).where(Estudiante.nombre.in_(NOMBRES))) == len(NOMBRES)
    assert client.get(f"/estudiantes/{ana}").status_code == 200
    assert resumen(generar(client, segunda)) == antes

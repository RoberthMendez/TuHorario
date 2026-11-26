"""Ejemplos de la sustentación (``/ejemplos``).

- El completo usa todas las preferencias, su resultado muestra cada caso y
  siempre sale igual.
- Cada ejemplo de nivel muestra lo que agrega ese nivel.
"""

import pytest
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.ejemplos import COMPLETO, EJEMPLOS, nombre_ocupante
from app.models import Curso, Estudiante, inscripciones

NOMBRES = [e.nombre for e in COMPLETO.estudiantes]


def cargar(client, clave: str = "completo") -> list[dict]:
    respuesta = client.post(f"/ejemplos/{clave}")
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


# ---------- Lista y ejemplos de nivel ----------


def test_lista_el_completo_y_uno_por_nivel(client) -> None:
    ejemplos = client.get("/ejemplos").json()
    assert [e["clave"] for e in ejemplos] == ["completo", *(f"nivel-{n}" for n in range(1, 9))]
    assert ejemplos[0] == {
        "clave": "completo",
        "titulo": "Ejemplo completo",
        "descripcion": COMPLETO.descripcion,
        "cantidadEstudiantes": 10,
    }


def test_ejemplo_inexistente_responde_404(client) -> None:
    assert client.post("/ejemplos/nivel-9").status_code == 404


def test_cada_ejemplo_guarda_un_ranking_completo(client) -> None:
    """El front siempre manda todas las preferencias elegidas en el ranking: al
    finalizar se vuelve a guardar igual y el resultado no cambia."""
    for ejemplo in EJEMPLOS:
        for e in cargar(client, ejemplo.clave):
            p = client.get(f"/estudiantes/{e['id']}/preferencias").json()
            elegidas = {"clases"}
            elegidas |= {"horarios"} if p["franjasHabilitadas"] else set()
            elegidas |= {"profesores"} if p["profesores"] else set()
            elegidas |= {"estudiantes"} if p["companeros"] or p["restringidos"] else set()
            elegidas |= {"cercania"} if p["preferenciaCercania"] else set()
            elegidas |= {"huecos"} if p["preferenciaSinHuecos"] else set()
            assert {x["tipoPreferencia"] for x in p["prioridades"]} == elegidas, (ejemplo.clave, e["nombre"])


def horarios_de(client, clave: str) -> dict[str, dict]:
    """Por nombre: ``cursos`` (códigos) y ``casos`` (preferencias no cumplidas)."""
    return {
        h["nombre"]: {
            "cursos": {c["codigo"] for c in h["cursos"]},
            "casos": [p["caso"] for p in h["preferenciasNoCumplidas"]],
        }
        for h in generar(client, cargar(client, clave))
    }


def test_nivel_1_cupos(client) -> None:
    h = horarios_de(client, "nivel-1")
    # Un solo cupo de Química: lo recibe uno de los dos que la piden.
    con_quimica = [n for n in ("Andrés Pérez", "Paula Gómez") if "QUI-101-2" in h[n]["cursos"]]
    assert len(con_quimica) == 1
    assert not any(c in h[n]["cursos"] for n in h for c in ("QUI-101-1", "QUI-101-3", "QUI-101-4"))
    sin_quimica = "Paula Gómez" if con_quimica == ["Andrés Pérez"] else "Andrés Pérez"
    assert h[sin_quimica]["casos"] == ["claseSinCupo"]
    assert len(h["Carlos Rincón"]["cursos"]) == 3


def test_nivel_2_prioridad_de_clases(client) -> None:
    h = horarios_de(client, "nivel-2")
    assert "QUI-101-2" in h["Daniel Mora"]["cursos"]
    # Ética (prioritaria) le gana a Inglés; Cálculo (no prioritaria) sí le queda.
    assert {c[:7] for c in h["Elena Vargas"]["cursos"]} == {"HUM-301", "MAT-101"}


def test_nivel_2_la_prioritaria_gana_con_cualquier_orden(client, db: Session) -> None:
    """Con el orden de la corrida al revés, Daniel sigue recibiendo el cupo."""
    elena, daniel = cargar(client, "nivel-2")
    horarios = generar(client, [daniel, elena])
    assert "QUI-101-2" in {c["codigo"] for c in horarios[0]["cursos"]}


def test_nivel_3_franjas(client) -> None:
    h = horarios_de(client, "nivel-3")
    assert h["Felipe Ortiz"] == {"cursos": {"MAT-101-4"}, "casos": []}
    assert h["Juliana Ríos"] == {"cursos": {"QUI-101-2"}, "casos": []}
    # Ninguno le encaja del todo: recibe el que más se acerca, y Física aunque quede fuera.
    assert "MAT-101-4" in h["Hugo Salas"]["cursos"] and len(h["Hugo Salas"]["cursos"]) == 2
    assert h["Hugo Salas"]["casos"] == ["fueraDeFranja", "fueraDeFranja"]
    assert h["Isabel Castro"]["cursos"] == {"MAT-101-1"}
    assert h["Jorge Lara"]["cursos"] == {"QUI-101-1"}


def test_nivel_4_profesores(client) -> None:
    h = horarios_de(client, "nivel-4")
    karen, luis = h["Karen Duque"]["cursos"], h["Luis Peña"]["cursos"]
    assert karen | luis == {"SIS-302-5", "SIS-302-3"}  # uno con Lucía y el otro con Hernán
    assert "claseSinCupo" in h["Karen Duque"]["casos"]  # vetó a todos los de Estadística
    assert h["Mónica Ruiz"]["cursos"] == {"SIS-302-1"}  # sin calificar: le toca Catalina


def test_nivel_5_companeros(client) -> None:
    h = horarios_de(client, "nivel-5")
    natalia, pablo, olga = (h[n]["cursos"] for n in ("Natalia León", "Pablo Herrera", "Olga Rivas"))
    analisis = lambda cursos: next(c for c in cursos if c.startswith("SIS-301"))  # noqa: E731
    ingles = lambda cursos: next(c for c in cursos if c.startswith("IDI-210"))  # noqa: E731
    assert analisis(natalia) == analisis(pablo)
    assert ingles(natalia) != ingles(pablo)
    assert analisis(olga) != analisis(natalia)
    assert "sinCompanero" not in h["Natalia León"]["casos"]


def test_nivel_6_cercania(client) -> None:
    h = horarios_de(client, "nivel-6")
    assert h["Rosa Medina"] == {"cursos": {"FIS-102-2", "FIS-101-3"}, "casos": []}
    assert h["Simón Torres"]["cursos"] == {"FIS-102-2", "FIS-101-2"}


def test_nivel_7_sin_huecos(client) -> None:
    h = horarios_de(client, "nivel-7")
    assert h["Tatiana Gil"] == {"cursos": {"SIS-499-1", "HUM-301-4"}, "casos": []}
    assert h["Ulises Rojas"]["cursos"] == {"SIS-499-1", "HUM-301-2"}


def test_nivel_8_prioridad_entre_preferencias(client) -> None:
    h = horarios_de(client, "nivel-8")
    assert h["Sara Molina"]["cursos"] == {"SIS-302-5"}  # profesores primero
    assert h["Viviana Prieto"]["cursos"] == {"SIS-302-3"}  # franjas primero
    assert h["Uriel Cano"]["cursos"] == {"SIS-302-3"}  # compañeros primero


def contar(db: Session, consulta) -> int:
    db.expire_all()
    return db.scalar(consulta)


@pytest.mark.parametrize("ejemplo", [e for e in EJEMPLOS if e.llenos], ids=lambda e: e.clave)
def test_los_ocupantes_llenan_cursos_y_se_borran_al_cargar_otro(client, db: Session, ejemplo) -> None:
    cargar(client, ejemplo.clave)
    cursos = {c.codigo: c for c in db.scalars(select(Curso).where(Curso.codigo.in_([c for c, _ in ejemplo.llenos])))}
    for codigo, libres in ejemplo.llenos:
        inscritos = select(func.count()).select_from(inscripciones).where(inscripciones.c.curso_id == cursos[codigo].id)
        assert contar(db, inscritos) == cursos[codigo].cupo - libres, codigo
    # Los ocupantes no se devuelven: no entran en la corrida.
    assert contar(db, select(func.count()).where(Estudiante.nombre == nombre_ocupante(1))) == 1

    cargar(client, "completo")
    assert contar(db, select(func.count()).where(Estudiante.nombre == nombre_ocupante(1))) == 0
    assert contar(db, select(func.count()).select_from(inscripciones)) == 0

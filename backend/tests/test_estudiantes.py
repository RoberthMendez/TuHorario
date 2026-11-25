import re

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import PreferenciaCompanero, PreferenciasDeEstudiante, estudiantes_restringidos, inscripciones


def crear(client, nombre: str) -> dict:
    respuesta = client.post("/estudiantes", json={"nombre": nombre})
    assert respuesta.status_code == 201, respuesta.text
    return respuesta.json()


def test_crear_genera_los_datos(client) -> None:
    roberth = crear(client, "  Roberth   Méndez ")
    assert roberth["nombre"] == "Roberth Méndez"
    assert roberth["codigoEstudiantil"] == "20260001"
    assert roberth["numeroDocumento"] == "1000000001"
    assert roberth["correo"] == "rmendez01@javeriana.edu.co"
    assert roberth["tipoDocumento"] == {"id": 1, "tipo": "Cédula"}
    assert re.fullmatch(r"310 \d{3} \d{4}", roberth["celular"])

    # Primer apellido: segunda palabra con 3 o menos, penúltima con 4 o más.
    assert crear(client, "Ana Ruiz Gómez")["correo"] == "aruiz02@javeriana.edu.co"
    assert crear(client, "Ana María Núñez Gómez")["correo"] == "anunez03@javeriana.edu.co"


def test_obtener_por_id(client) -> None:
    ana = crear(client, "Ana Ruiz")
    assert client.get(f"/estudiantes/{ana['id']}").json() == ana
    assert client.get("/estudiantes/999").status_code == 404


def test_renombrar_rehace_el_correo(client) -> None:
    ana = crear(client, "Ana Ruiz")
    crear(client, "Carlos Pérez")
    respuesta = client.put(f"/estudiantes/{ana['id']}", json={"nombre": " Ana  Gómez "})
    assert respuesta.status_code == 200, respuesta.text
    renombrada = respuesta.json()
    assert renombrada["nombre"] == "Ana Gómez"
    assert renombrada["correo"] == "agomez01@javeriana.edu.co"
    otros = {k: v for k, v in renombrada.items() if k not in ("nombre", "correo")}
    assert otros == {k: v for k, v in ana.items() if k not in ("nombre", "correo")}

    # Su propio correo no cuenta como repetido: el mismo nombre lo deja igual.
    assert client.put(f"/estudiantes/{ana['id']}", json={"nombre": "Ana Gómez"}).json()["correo"] == renombrada["correo"]

    assert client.put("/estudiantes/999", json={"nombre": "Ana Ruiz"}).status_code == 404
    assert client.put(f"/estudiantes/{ana['id']}", json={"nombre": "  "}).status_code == 422


def test_nombre_vacio_es_invalido(client) -> None:
    assert client.post("/estudiantes", json={"nombre": "   "}).status_code == 422


def test_consecutivo_no_se_reutiliza(client) -> None:
    primero = crear(client, "Ana Ruiz")
    assert client.delete(f"/estudiantes/{primero['id']}").status_code == 204
    segundo = crear(client, "Ana Ruiz")
    assert segundo["codigoEstudiantil"] == "20260002"
    assert segundo["numeroDocumento"] == "1000000002"


def test_buscar_sin_tildes_ni_mayusculas_y_excluir(client) -> None:
    sebastian = crear(client, "Sebastián Vargas")
    crear(client, "Sebastian Rincón")
    crear(client, "Valeria Castro")
    nombres = [e["nombre"] for e in client.get("/estudiantes", params={"buscar": "SEBAS"}).json()]
    assert nombres == ["Sebastian Rincón", "Sebastián Vargas"]
    assert [e["nombre"] for e in client.get("/estudiantes", params={"buscar": "rincon"}).json()] == [
        "Sebastian Rincón"
    ]
    # Por correo, con límite y excluyéndose a sí mismo.
    por_correo = client.get("/estudiantes", params={"buscar": "@javeriana", "limite": 2}).json()
    assert len(por_correo) == 2
    sin_el = client.get("/estudiantes", params={"buscar": "seb", "excluir": sebastian["id"]}).json()
    assert [e["nombre"] for e in sin_el] == ["Sebastian Rincón"]
    assert set(sin_el[0]) == {"id", "nombre", "correo"}
    assert client.get("/estudiantes", params={"buscar": "  "}).json() == []


def test_borrar_en_cascada(client, db: Session) -> None:
    ana = crear(client, "Ana Ruiz")
    beto = crear(client, "Beto Díaz")
    caro = crear(client, "Caro León")
    client.put(
        f"/estudiantes/{ana['id']}/preferencias",
        json={"clases": [{"idClase": 1}], "companeros": [{"idEstudiante": beto["id"], "idClase": 1}]},
    ).raise_for_status()
    client.put(
        f"/estudiantes/{caro['id']}/preferencias",
        json={"clases": [{"idClase": 1}], "restringidos": [beto["id"]]},
    ).raise_for_status()
    client.put(f"/estudiantes/{beto['id']}/preferencias", json={"clases": [{"idClase": 1}]}).raise_for_status()
    client.post("/horarios/generar", json={"idsEstudiantes": [ana["id"], beto["id"], caro["id"]]}).raise_for_status()

    assert client.delete(f"/estudiantes/{beto['id']}").status_code == 204
    assert client.delete(f"/estudiantes/{beto['id']}").status_code == 404

    contar = lambda tabla, *filtros: db.scalar(select(func.count()).select_from(tabla).where(*filtros))  # noqa: E731
    assert contar(PreferenciasDeEstudiante, PreferenciasDeEstudiante.estudiante_id == beto["id"]) == 0
    assert contar(inscripciones, inscripciones.c.estudiante_id == beto["id"]) == 0
    assert contar(PreferenciaCompanero, PreferenciaCompanero.estudiante_preferido_id == beto["id"]) == 0
    assert contar(estudiantes_restringidos, estudiantes_restringidos.c.estudiante_id == beto["id"]) == 0
    # Las preferencias de los demás siguen ahí (sin la referencia a Beto).
    assert client.get(f"/estudiantes/{ana['id']}/preferencias").json()["clases"] == [
        {"idClase": 1, "prioridad": False}
    ]

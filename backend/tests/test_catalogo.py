from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dias import se_cruzan
from app.db.semilla import CLASES, PROFESORES
from app.models import Curso, SalonHorario


def test_clases_igual_que_el_mock_del_front(client) -> None:
    respuesta = client.get("/clases")
    assert respuesta.status_code == 200
    assert respuesta.json() == [{"id": i, "codigo": c, "nombre": n} for i, c, n in CLASES]


def test_profesores_filtrados_por_clases(client) -> None:
    respuesta = client.get("/profesores", params={"clases": "1,7"})
    assert respuesta.status_code == 200
    profesores = respuesta.json()
    esperados = {i for i, _, _, clases in PROFESORES if {1, 7} & set(clases)}
    assert {p["id"] for p in profesores} == esperados
    natalia = next(p for p in profesores if p["id"] == 1)
    assert natalia == {"id": 1, "nombre": "Natalia Pardo", "genero": "femenino", "idsClases": [1, 2]}


def test_profesores_sin_filtro_y_filtro_vacio(client) -> None:
    assert len(client.get("/profesores").json()) == len(PROFESORES)
    assert client.get("/profesores", params={"clases": ""}).json() == []
    assert client.get("/profesores", params={"clases": "a,b"}).status_code == 422


def test_semilla_cursos_validos(db: Session) -> None:
    cursos = list(db.scalars(select(Curso)))
    pares = {(c.profesor_id, c.clase_id) for c in cursos}
    assert pares == {(i, c) for i, _, _, clases in PROFESORES for c in clases}
    sesiones = list(db.scalars(select(SalonHorario)))
    assert all(s.hora_inicio % 60 == 0 and 420 <= s.hora_inicio < s.hora_fin <= 1260 for s in sesiones)
    # El mismo salón nunca tiene dos sesiones solapadas.
    for i, a in enumerate(sesiones):
        for b in sesiones[i + 1 :]:
            if a.salon_id == b.salon_id:
                assert not se_cruzan((a.dia, a.hora_inicio, a.hora_fin), (b.dia, b.hora_inicio, b.hora_fin))

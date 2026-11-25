import pytest


@pytest.fixture
def ids(client) -> dict[str, int]:
    nombres = {"ana": "Ana Ruiz", "beto": "Beto Díaz", "caro": "Caro León"}
    return {k: client.post("/estudiantes", json={"nombre": v}).json()["id"] for k, v in nombres.items()}


def completas(ids: dict[str, int]) -> dict:
    return {
        "clases": [{"idClase": 1, "prioridad": True}, {"idClase": 7, "prioridad": False}],
        "franjasHabilitadas": [
            {"dia": "miércoles", "horaInicio": "07:00", "horaFin": "10:00"},
            {"dia": "sábado", "horaInicio": "08:00", "horaFin": "12:00"},
        ],
        "profesores": [{"idProfesor": 1, "preferencia": 3}, {"idProfesor": 9, "preferencia": 0}],
        "companeros": [{"idEstudiante": ids["beto"], "idClase": 1}],
        "restringidos": [ids["caro"]],
        "preferenciaCercania": True,
        "preferenciaSinHuecos": False,
        "prioridades": [
            {"tipoPreferencia": "clases", "prioridad": 1},
            {"tipoPreferencia": "profesores", "prioridad": 2},
            {"tipoPreferencia": "estudiantes", "prioridad": 3},
            {"tipoPreferencia": "horarios", "prioridad": 4},
            {"tipoPreferencia": "cercania", "prioridad": 5},
        ],
    }


def test_guardar_y_leer(client, ids) -> None:
    datos = completas(ids)
    respuesta = client.put(f"/estudiantes/{ids['ana']}/preferencias", json=datos)
    assert respuesta.status_code == 200, respuesta.text
    assert respuesta.json() == datos
    assert client.get(f"/estudiantes/{ids['ana']}/preferencias").json() == datos


def test_dias_sin_tilde_se_normalizan(client, ids) -> None:
    datos = {"franjasHabilitadas": [{"dia": "miercoles", "horaInicio": "07:00", "horaFin": "08:00"}]}
    respuesta = client.put(f"/estudiantes/{ids['ana']}/preferencias", json=datos)
    assert respuesta.json()["franjasHabilitadas"][0]["dia"] == "miércoles"


def test_put_reemplaza(client, ids) -> None:
    client.put(f"/estudiantes/{ids['ana']}/preferencias", json=completas(ids)).raise_for_status()
    respuesta = client.put(f"/estudiantes/{ids['ana']}/preferencias", json={"clases": [{"idClase": 2}]})
    assert respuesta.json()["clases"] == [{"idClase": 2, "prioridad": False}]
    assert respuesta.json()["profesores"] == []
    assert respuesta.json()["restringidos"] == []


def test_estudiante_inexistente(client) -> None:
    assert client.put("/estudiantes/999/preferencias", json={}).status_code == 404


@pytest.mark.parametrize(
    "cambio",
    [
        # Profesor que no dicta ninguna clase pedida (Natalia dicta 1 y 2).
        {"clases": [{"idClase": 7}], "profesores": [{"idProfesor": 1, "preferencia": 2}], "companeros": []},
        # Clase o profesor que no existen.
        {"clases": [{"idClase": 999}]},
        {"profesores": [{"idProfesor": 999, "preferencia": 1}]},
        # Clases repetidas.
        {"clases": [{"idClase": 1}, {"idClase": 1}]},
        # Compañero en una clase que no pidió.
        {"companeros": [{"idEstudiante": "beto", "idClase": 2}]},
        # Compañero y restringido a la vez.
        {"restringidos": ["beto"]},
        # Ranking con preferencias no elegidas o mal numerado.
        {"preferenciaCercania": False},
        {"prioridades": [{"tipoPreferencia": "clases", "prioridad": 2}]},
        {"prioridades": [{"tipoPreferencia": "huecos", "prioridad": 1}]},
        # Franjas solapadas.
        {
            "franjasHabilitadas": [
                {"dia": "lunes", "horaInicio": "07:00", "horaFin": "10:00"},
                {"dia": "lunes", "horaInicio": "09:00", "horaFin": "11:00"},
            ]
        },
    ],
)
def test_reglas_de_negocio(client, ids, cambio) -> None:
    datos = completas(ids) | cambio
    for c in datos["companeros"]:
        c["idEstudiante"] = ids.get(c["idEstudiante"], c["idEstudiante"])
    datos["restringidos"] = [ids.get(r, r) for r in datos["restringidos"]]
    respuesta = client.put(f"/estudiantes/{ids['ana']}/preferencias", json=datos)
    assert respuesta.status_code == 400, respuesta.text
    assert respuesta.json()["detail"]


def test_a_si_mismo(client, ids) -> None:
    datos = {"clases": [{"idClase": 1}], "companeros": [{"idEstudiante": ids["ana"], "idClase": 1}]}
    assert client.put(f"/estudiantes/{ids['ana']}/preferencias", json=datos).status_code == 400


@pytest.mark.parametrize(
    "franja",
    [
        {"dia": "domingo", "horaInicio": "07:00", "horaFin": "09:00"},
        {"dia": "lunes", "horaInicio": "07:30", "horaFin": "09:00"},
        {"dia": "lunes", "horaInicio": "06:00", "horaFin": "09:00"},
        {"dia": "lunes", "horaInicio": "20:00", "horaFin": "22:00"},
        {"dia": "lunes", "horaInicio": "10:00", "horaFin": "09:00"},
    ],
)
def test_franjas_invalidas(client, ids, franja) -> None:
    respuesta = client.put(f"/estudiantes/{ids['ana']}/preferencias", json={"franjasHabilitadas": [franja]})
    assert respuesta.status_code == 422


def test_preferencia_profe_fuera_de_rango(client, ids) -> None:
    datos = {"clases": [{"idClase": 1}], "profesores": [{"idProfesor": 1, "preferencia": 4}]}
    assert client.put(f"/estudiantes/{ids['ana']}/preferencias", json=datos).status_code == 422

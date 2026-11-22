import pytest

from algoritmo import (
    Clase,
    Curso,
    Estudiante,
    Horario,
    PreferenciaClase,
    PreferenciaCompanero,
    PreferenciaProfe,
    PreferenciasDeEstudiante,
    Profesor,
    asignar_horarios,
)
from algoritmo.generador import generar_instancia


def estudiante(id_: int, *preferencias: tuple[Clase, bool]) -> Estudiante:
    return Estudiante(
        id_, preferencias=PreferenciasDeEstudiante([PreferenciaClase(c, p) for c, p in preferencias])
    )


def clase_un_curso(id_: int, cupo: int, dia: str = "lunes", inicio: str = "07:00", fin: str = "09:00") -> Clase:
    return Clase(id_, f"K{id_}", f"Clase {id_}", [Curso(id_, f"K{id_}-1", cupo, [Horario.crear(dia, inicio, fin)])])


def test_cupo_unico_lo_recibe_un_solo_estudiante() -> None:
    clase = clase_un_curso(1, cupo=1)
    resultado = asignar_horarios([estudiante(1, (clase, False)), estudiante(2, (clase, False))], semilla=0)

    asignados = [e for e, cursos in resultado.horarios.items() if cursos]
    assert len(asignados) == 1
    assert resultado.cupos_restantes[1] == 0
    assert resultado.clases_asignadas == 1
    assert resultado.clases_solicitadas == 2
    # Con la misma prioridad, el primero del sorteo se queda con el cupo.
    assert asignados[0] == resultado.orden[0]


@pytest.mark.parametrize("semilla", range(10))
def test_prioritaria_de_uno_gana_a_no_prioritaria_de_otro(semilla: int) -> None:
    # Un cupo; para el estudiante 1 no es prioritaria y para el 2 sí.
    # Sin importar el orden del sorteo, el cupo es del estudiante 2.
    clase = clase_un_curso(1, cupo=1)
    resultado = asignar_horarios([estudiante(1, (clase, False)), estudiante(2, (clase, True))], semilla=semilla)
    assert [c.id for c in resultado.horarios[2]] == [1]
    assert resultado.horarios[1] == []
    assert resultado.puntajes == {1: (0, 0, 0.0), 2: (1, 0, 0.0)}


def test_ronda_2_respeta_horas_de_la_ronda_1() -> None:
    prioritaria = clase_un_curso(1, cupo=5, inicio="07:00", fin="09:00")
    choca = clase_un_curso(2, cupo=5, inicio="08:00", fin="10:00")
    otra = Clase(3, "K3", "Clase 3", [
        Curso(3, "K3-lun", 5, [Horario.crear("lunes", "08:00", "10:00")]),
        Curso(4, "K3-mar", 5, [Horario.crear("martes", "08:00", "10:00")]),
    ])
    resultado = asignar_horarios(
        [estudiante(1, (choca, False), (otra, False), (prioritaria, True))], semilla=0
    )
    assert [c.id for c in resultado.horarios[1]] == [1, 4]  # K3 pasa al martes
    assert [p.clase.id for p in resultado.no_asignadas[1]] == [2]
    assert resultado.puntajes[1] == (1, 1, 0.0)


def test_sin_cupo_pasa_a_otra_seccion() -> None:
    clase = Clase(1, "A", "A", [
        Curso(1, "A-1", 1, [Horario.crear("lunes", "07:00", "09:00")]),
        Curso(2, "A-2", 1, [Horario.crear("martes", "07:00", "09:00")]),
    ])
    resultado = asignar_horarios([estudiante(1, (clase, True)), estudiante(2, (clase, True))], semilla=3)
    codigos = sorted(c.codigo for cursos in resultado.horarios.values() for c in cursos)
    assert codigos == ["A-1", "A-2"]


def test_no_modifica_la_entrada() -> None:
    clase = clase_un_curso(1, cupo=1)
    asignar_horarios([estudiante(1, (clase, True))], semilla=0)
    assert clase.cursos[0].cupo == 1


def test_clase_repetida_es_prioritaria_si_alguna_lo_es() -> None:
    clase = clase_un_curso(1, cupo=1)
    e = estudiante(1, (clase, False), (clase, True))
    assert [(p.clase.id, p.prioridad) for p in e.preferencias_de_clase()] == [(1, True)]


def test_misma_semilla_mismo_resultado() -> None:
    _, estudiantes = generar_instancia(50, 5, 4, num_patrones=10, cupo_maximo=5, semilla=7)
    a = asignar_horarios(estudiantes, semilla=1)
    b = asignar_horarios(estudiantes, semilla=1)
    assert a.orden == b.orden
    assert {e: [c.id for c in cs] for e, cs in a.horarios.items()} == {
        e: [c.id for c in cs] for e, cs in b.horarios.items()
    }


def test_invariantes_en_instancia_grande() -> None:
    clases, estudiantes = generar_instancia(300, 6, 4, num_patrones=15, cupo_maximo=20, semilla=42)
    resultado = asignar_horarios(estudiantes, semilla=42)

    usados: dict[int, int] = {}
    for cursos in resultado.horarios.values():
        firma = 0
        for c in cursos:
            assert firma & c.mascara == 0  # sin cruces, sumando las dos rondas
            firma |= c.mascara
            usados[c.id] = usados.get(c.id, 0) + 1
    for clase in clases:
        for c in clase.cursos:
            if c.id in resultado.cupos_restantes:
                assert resultado.cupos_restantes[c.id] >= 0
                assert resultado.cupos_restantes[c.id] == c.cupo - usados.get(c.id, 0)

    for e in estudiantes:
        pedidas = e.preferencias_de_clase()
        prio, no_prio, satisf = resultado.puntajes[e.id]
        # Franjas + profesor ≤ 2 por clase; los compañeros pueden sumar o restar más.
        assert satisf <= 2 * len(resultado.horarios[e.id]) + len(e.preferencias.preferencia_estudiantes) * 2 + 2
        # Ningún curso asignado tiene un profesor calificado con 0.
        vetados = {p.profesor.id for p in e.preferencias.preferencia_profes if p.preferencia == 0}
        assert all(c.profesor is None or c.profesor.id not in vetados for c in resultado.horarios[e.id])
        # Cada clase pedida queda asignada o sin asignar, nunca ambas.
        assert len(resultado.horarios[e.id]) + len(resultado.no_asignadas[e.id]) == len(pedidas)
        assert prio + no_prio == len(resultado.horarios[e.id])
        assert prio == sum(p.prioridad for p in pedidas) - sum(p.prioridad for p in resultado.no_asignadas[e.id])

    assert 0 < resultado.prioritarias_asignadas <= resultado.prioritarias_solicitadas
    assert resultado.satisfaccion_promedio > 0


def test_cada_estudiante_usa_sus_propias_franjas() -> None:
    # Dos secciones con cupo de sobra: lunes y martes. Cada uno recibe la de su franja.
    clase = Clase(1, "A", "A", [
        Curso(1, "A-lun", 5, [Horario.crear("lunes", "07:00", "09:00")]),
        Curso(2, "A-mar", 5, [Horario.crear("martes", "07:00", "09:00")]),
    ])
    lunes = estudiante(1, (clase, True))
    lunes.preferencias.franjas_habilitadas = [Horario.crear("lunes", "07:00", "12:00")]
    martes = estudiante(2, (clase, True))
    martes.preferencias.franjas_habilitadas = [Horario.crear("martes", "07:00", "12:00")]
    resultado = asignar_horarios([lunes, martes], semilla=0)
    assert [c.codigo for c in resultado.horarios[1]] == ["A-lun"]
    assert [c.codigo for c in resultado.horarios[2]] == ["A-mar"]
    assert resultado.satisfaccion_promedio == 1.0


def test_profesor_vetado_se_respeta_en_la_asignacion() -> None:
    malo, bueno = Profesor(1, "Malo"), Profesor(2, "Bueno")
    clase = Clase(1, "A", "A", [
        Curso(1, "A-1", 5, [Horario.crear("lunes", "07:00", "09:00")], malo),
        Curso(2, "A-2", 1, [Horario.crear("martes", "07:00", "09:00")], bueno),
    ])
    # Ambos vetan a "Malo"; solo hay un cupo con "Bueno": uno se queda sin la clase.
    estudiantes = [estudiante(1, (clase, True)), estudiante(2, (clase, True))]
    for e in estudiantes:
        e.preferencias.preferencia_profes = [PreferenciaProfe(malo, 0)]
    resultado = asignar_horarios(estudiantes, semilla=0)
    asignados = [c.codigo for cs in resultado.horarios.values() for c in cs]
    assert asignados == ["A-2"]


# ---------------------------------------------------------------- Nivel 5

def dos_secciones(cupo: int = 5) -> Clase:
    return Clase(1, "A", "A", [
        Curso(1, "A-lun", cupo, [Horario.crear("lunes", "07:00", "09:00")]),
        Curso(2, "A-mar", cupo, [Horario.crear("martes", "07:00", "09:00")]),
    ])


def seccion_de(resultado, e_id: int) -> str:
    return resultado.horarios[e_id][0].codigo


@pytest.mark.parametrize("semilla", range(10))
def test_amigos_quedan_en_la_misma_seccion(semilla: int) -> None:
    # Ana prefiere el martes y Beto el lunes, pero Ana pidió a Beto como
    # compañero: estar juntos vale más que la franja de uno de los dos.
    clase = dos_secciones()
    ana, beto = estudiante(1, (clase, True)), estudiante(2, (clase, True))
    ana.preferencias.franjas_habilitadas = [Horario.crear("martes", "07:00", "09:00")]
    beto.preferencias.franjas_habilitadas = [Horario.crear("lunes", "07:00", "09:00")]
    ana.preferencias.preferencia_estudiantes = [PreferenciaCompanero(beto, clase)]
    resultado = asignar_horarios([ana, beto], semilla=semilla)
    assert seccion_de(resultado, 1) == seccion_de(resultado, 2)


def test_amistad_es_por_clase() -> None:
    # Ana pidió a Beto para la clase B, no para A: en A no hay bono.
    clase_a = dos_secciones()
    clase_b = Clase(2, "B", "B", [Curso(3, "B-1", 5, [Horario.crear("jueves", "07:00", "09:00")])])
    ana, beto = estudiante(1, (clase_a, True)), estudiante(2, (clase_a, True))
    ana.preferencias.franjas_habilitadas = [Horario.crear("martes", "07:00", "09:00")]
    beto.preferencias.franjas_habilitadas = [Horario.crear("lunes", "07:00", "09:00")]
    ana.preferencias.preferencia_estudiantes = [PreferenciaCompanero(beto, clase_b)]
    resultado = asignar_horarios([ana, beto], semilla=0)
    assert seccion_de(resultado, 1) == "A-mar"
    assert seccion_de(resultado, 2) == "A-lun"


@pytest.mark.parametrize("semilla", range(10))
def test_excluidos_quedan_en_secciones_distintas(semilla: int) -> None:
    clase = dos_secciones()
    ana, beto = estudiante(1, (clase, True)), estudiante(2, (clase, True))
    beto.preferencias.estudiantes_restringidos = [ana]  # basta con que uno excluya al otro
    resultado = asignar_horarios([ana, beto], semilla=semilla)
    assert seccion_de(resultado, 1) != seccion_de(resultado, 2)


def test_exclusion_no_hace_perder_la_clase() -> None:
    # Una sola sección: compartirla con un excluido es mejor que no inscribirla.
    clase = Clase(1, "A", "A", [Curso(1, "A-1", 5, [Horario.crear("lunes", "07:00", "09:00")])])
    ana, beto = estudiante(1, (clase, False)), estudiante(2, (clase, False))
    ana.preferencias.estudiantes_restringidos = [beto]
    resultado = asignar_horarios([ana, beto], semilla=0)
    assert resultado.clases_asignadas == 2
    assert resultado.puntajes[1] == (0, 1, -1.0)
    assert resultado.puntajes[2] == (0, 1, -1.0)


def test_amigos_se_procesan_seguidos() -> None:
    from algoritmo.companeros import construir_red, ordenar_por_componentes

    clase = dos_secciones()
    a, b, c, d = (estudiante(i, (clase, True)) for i in range(1, 5))
    a.preferencias.preferencia_estudiantes = [PreferenciaCompanero(d, clase)]
    orden = ordenar_por_componentes([a, b, c, d], construir_red([a, b, c, d]))
    assert [e.id for e in orden] == [1, 4, 2, 3]


def test_fase_de_mejora_reacomoda_prioritarias_para_que_quepa_otra_clase() -> None:
    # P (prioritaria) tiene sección martes y lunes; N (no prioritaria) solo el martes.
    # En la ronda 1 la PD solo ve P y elige el martes (primer empate), y en la
    # ronda 2 N ya no cabe. La fase de mejora pasa P al lunes y N entra.
    p = Clase(1, "P", "P", [
        Curso(1, "P-mar", 5, [Horario.crear("martes", "07:00", "09:00")]),
        Curso(2, "P-lun", 5, [Horario.crear("lunes", "07:00", "09:00")]),
    ])
    n = Clase(2, "N", "N", [Curso(3, "N-mar", 5, [Horario.crear("martes", "07:00", "09:00")])])
    sin_mejora = asignar_horarios([estudiante(1, (p, True), (n, False))], semilla=0, pasadas_mejora=0)
    assert [c.codigo for c in sin_mejora.horarios[1]] == ["P-mar"]

    con_mejora = asignar_horarios([estudiante(1, (p, True), (n, False))], semilla=0)
    assert sorted(c.codigo for c in con_mejora.horarios[1]) == ["N-mar", "P-lun"]
    assert con_mejora.mejoras == 1


@pytest.mark.parametrize("semilla", range(5))
def test_fase_de_mejora_nunca_empeora_el_puntaje_global(semilla: int) -> None:
    _, estudiantes = generar_instancia(150, 5, 3, num_patrones=10, cupo_maximo=10,
                                       prob_amigo=0.4, prob_exclusion=0.2, semilla=semilla)
    sin = asignar_horarios(estudiantes, semilla=semilla, pasadas_mejora=0).puntaje_global
    con = asignar_horarios(estudiantes, semilla=semilla).puntaje_global
    assert con[:2] >= sin[:2]
    if con[:2] == sin[:2]:
        assert con[2] >= sin[2] - 1e-9

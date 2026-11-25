"""Preferencias de un estudiante: validación de las reglas de los TADs y guardado.

Reglas que se validan (además de los rangos que ya revisa Pydantic):

- Las clases, profesores y estudiantes referenciados existen, y no se repiten.
- Cada profesor calificado dicta al menos una de las clases pedidas.
- Cada compañero se pide para una clase que el estudiante pidió.
- Nadie se pide a sí mismo como compañero ni se restringe a sí mismo, y nadie
  es compañero y restringido a la vez.
- Las franjas habilitadas no se solapan.
- El ranking (``prioridades``) numera 1..n sin repetir y solo incluye
  preferencias elegidas: ``clases`` siempre; ``horarios``, ``profesores`` y
  ``estudiantes`` si tienen algún elemento; ``cercania`` y ``huecos`` si están
  activadas.
"""

from sqlalchemy.orm import Session

from app.core.dias import a_minutos, a_texto, dia_api, dia_interno, se_cruzan
from app.core.errores import NoEncontrado, ReglaNegocio
from app.models import (
    FranjaHabilitada,
    PreferenciaClase,
    PreferenciaCompanero,
    PreferenciaProfe,
    PreferenciasDeEstudiante,
    PrioridadPreferencia,
)
from app.repositories import catalogo_repo, estudiantes_repo, preferencias_repo
from app.schemas import (
    FranjaIn,
    PreferenciaClaseIn,
    PreferenciaCompaneroIn,
    PreferenciaProfeIn,
    PreferenciasIn,
    PrioridadIn,
)


def _sin_repetidos(valores: list, mensaje: str) -> None:
    if len(valores) != len(set(valores)):
        raise ReglaNegocio(mensaje)


def _faltantes(pedidos: set[int], encontrados: dict) -> list[int]:
    return sorted(pedidos - encontrados.keys())


def guardar(db: Session, id_estudiante: int, datos: PreferenciasIn) -> PreferenciasIn:
    estudiante = estudiantes_repo.obtener(db, id_estudiante)
    if estudiante is None:
        raise NoEncontrado(f"No existe el estudiante {id_estudiante}")

    # Clases
    ids_clases = [c.id_clase for c in datos.clases]
    _sin_repetidos(ids_clases, "Hay clases repetidas")
    clases = catalogo_repo.clases_por_ids(db, set(ids_clases))
    if faltan := _faltantes(set(ids_clases), clases):
        raise ReglaNegocio(f"No existen las clases {faltan}")

    # Franjas habilitadas
    franjas = [(dia_interno(f.dia), a_minutos(f.hora_inicio), a_minutos(f.hora_fin)) for f in datos.franjas_habilitadas]
    for i, a in enumerate(franjas):
        if any(se_cruzan(a, b) for b in franjas[i + 1 :]):
            raise ReglaNegocio("Las franjas habilitadas no pueden solaparse")

    # Profesores: deben dictar alguna de las clases pedidas.
    ids_profes = [p.id_profesor for p in datos.profesores]
    _sin_repetidos(ids_profes, "Hay profesores repetidos")
    profesores = catalogo_repo.profesores_por_ids(db, set(ids_profes))
    if faltan := _faltantes(set(ids_profes), profesores):
        raise ReglaNegocio(f"No existen los profesores {faltan}")
    dicta = catalogo_repo.clases_de_profesores(db, set(ids_profes))
    for id_profe in ids_profes:
        if not set(dicta.get(id_profe, ())) & set(ids_clases):
            raise ReglaNegocio(f"{profesores[id_profe].nombre} no dicta ninguna de las clases pedidas")

    # Compañeros y restringidos
    pares = [(c.id_estudiante, c.id_clase) for c in datos.companeros]
    _sin_repetidos(pares, "Hay compañeros repetidos para la misma clase")
    _sin_repetidos(datos.restringidos, "Hay estudiantes restringidos repetidos")
    ids_companeros = {e for e, _ in pares}
    ids_otros = ids_companeros | set(datos.restringidos)
    if id_estudiante in ids_otros:
        raise ReglaNegocio("Un estudiante no puede ser su propio compañero ni restringirse a sí mismo")
    if ambos := sorted(ids_companeros & set(datos.restringidos)):
        raise ReglaNegocio(f"Los estudiantes {ambos} no pueden ser compañeros y restringidos a la vez")
    otros = estudiantes_repo.por_ids(db, ids_otros)
    if faltan := _faltantes(ids_otros, otros):
        raise ReglaNegocio(f"No existen los estudiantes {faltan}")
    if fuera := sorted({c for _, c in pares} - set(ids_clases)):
        raise ReglaNegocio(f"Los compañeros solo se pueden pedir en clases elegidas (no en {fuera})")

    # Ranking de preferencias
    elegidas = {"clases"}
    if franjas:
        elegidas.add("horarios")
    if ids_profes:
        elegidas.add("profesores")
    if ids_otros:
        elegidas.add("estudiantes")
    if datos.preferencia_cercania:
        elegidas.add("cercania")
    if datos.preferencia_sin_huecos:
        elegidas.add("huecos")
    tipos = [p.tipo_preferencia for p in datos.prioridades]
    _sin_repetidos(tipos, "El ranking tiene preferencias repetidas")
    if sobran := sorted(set(tipos) - elegidas):
        raise ReglaNegocio(f"El ranking incluye preferencias que no se eligieron: {sobran}")
    if sorted(p.prioridad for p in datos.prioridades) != list(range(1, len(tipos) + 1)):
        raise ReglaNegocio("Las prioridades del ranking deben ir de 1 a n sin repetirse")

    preferencias = PreferenciasDeEstudiante(
        estudiante_id=id_estudiante,
        preferencia_cercania=datos.preferencia_cercania,
        preferencia_sin_huecos=datos.preferencia_sin_huecos,
        preferencia_clases=[PreferenciaClase(clase_id=c.id_clase, prioridad=c.prioridad) for c in datos.clases],
        franjas_habilitadas=[FranjaHabilitada(dia=d, hora_inicio=i, hora_fin=f) for d, i, f in franjas],
        preferencia_profes=[
            PreferenciaProfe(profesor_id=p.id_profesor, preferencia=p.preferencia) for p in datos.profesores
        ],
        preferencia_estudiantes=[PreferenciaCompanero(estudiante_preferido_id=e, clase_id=c) for e, c in pares],
        estudiantes_restringidos=[otros[i] for i in datos.restringidos],
        prioridad_preferencias=[
            PrioridadPreferencia(tipo_preferencia=p.tipo_preferencia, prioridad=p.prioridad) for p in datos.prioridades
        ],
    )
    preferencias_repo.reemplazar(db, preferencias)
    db.commit()
    return obtener(db, id_estudiante)


def obtener(db: Session, id_estudiante: int) -> PreferenciasIn:
    """Preferencias guardadas del estudiante (vacías si aún no tiene)."""
    if estudiantes_repo.obtener(db, id_estudiante) is None:
        raise NoEncontrado(f"No existe el estudiante {id_estudiante}")
    p = preferencias_repo.de_estudiantes(db, {id_estudiante}).get(id_estudiante)
    if p is None:
        return PreferenciasIn()
    return PreferenciasIn(
        clases=[PreferenciaClaseIn(id_clase=c.clase_id, prioridad=c.prioridad) for c in p.preferencia_clases],
        franjas_habilitadas=[
            FranjaIn(dia=dia_api(f.dia), hora_inicio=a_texto(f.hora_inicio), hora_fin=a_texto(f.hora_fin))
            for f in p.franjas_habilitadas
        ],
        profesores=[
            PreferenciaProfeIn(id_profesor=x.profesor_id, preferencia=x.preferencia) for x in p.preferencia_profes
        ],
        companeros=[
            PreferenciaCompaneroIn(id_estudiante=x.estudiante_preferido_id, id_clase=x.clase_id)
            for x in p.preferencia_estudiantes
        ],
        restringidos=[e.id for e in p.estudiantes_restringidos],
        preferencia_cercania=p.preferencia_cercania,
        preferencia_sin_huecos=p.preferencia_sin_huecos,
        prioridades=[
            PrioridadIn(tipo_preferencia=x.tipo_preferencia, prioridad=x.prioridad)
            for x in p.prioridad_preferencias
        ],
    )

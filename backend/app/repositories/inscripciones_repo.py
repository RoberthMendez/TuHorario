"""Inscripciones (TAD Curso.listaEstudiantes): el resultado de la asignación."""

from collections import defaultdict

from sqlalchemy import delete, func, insert, select
from sqlalchemy.orm import Session, selectinload

from app.models import Curso, Salon, SalonHorario, inscripciones


def inscritos_ajenos(db: Session, ids_cursos: set[int], ids_estudiantes: set[int]) -> dict[int, int]:
    """id curso → inscritos que no están en ``ids_estudiantes`` (ocupan cupo fijo)."""
    if not ids_cursos:
        return {}
    consulta = (
        select(inscripciones.c.curso_id, func.count())
        .where(inscripciones.c.curso_id.in_(ids_cursos))
        .where(inscripciones.c.estudiante_id.not_in(ids_estudiantes))
        .group_by(inscripciones.c.curso_id)
    )
    return {id_curso: cantidad for id_curso, cantidad in db.execute(consulta)}


def liberar(db: Session, ids_estudiantes: set[int]) -> None:
    db.execute(delete(inscripciones).where(inscripciones.c.estudiante_id.in_(ids_estudiantes)))


def inscribir(db: Session, pares: list[tuple[int, int]]) -> None:
    """Guarda pares ``(id_estudiante, id_curso)``."""
    if pares:
        db.execute(insert(inscripciones), [{"estudiante_id": e, "curso_id": c} for e, c in pares])


def cursos_de_estudiantes(db: Session, ids_estudiantes: set[int]) -> dict[int, list[Curso]]:
    """id estudiante → cursos en los que está inscrito (con clase, profesor y sesiones)."""
    if not ids_estudiantes:
        return {}
    filas = db.execute(
        select(inscripciones.c.estudiante_id, inscripciones.c.curso_id).where(
            inscripciones.c.estudiante_id.in_(ids_estudiantes)
        )
    ).all()
    ids_cursos = {c for _, c in filas}
    cursos = {
        c.id: c
        for c in db.scalars(
            select(Curso)
            .where(Curso.id.in_(ids_cursos))
            .options(
                selectinload(Curso.clase),
                selectinload(Curso.profesor),
                selectinload(Curso.salon_horarios).selectinload(SalonHorario.salon).selectinload(Salon.edificio),
            )
        )
    } if ids_cursos else {}
    resultado: dict[int, list[Curso]] = defaultdict(list)
    for id_estudiante, id_curso in filas:
        resultado[id_estudiante].append(cursos[id_curso])
    return resultado

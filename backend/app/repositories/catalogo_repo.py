"""Consultas del catálogo: clases, profesores, cursos y tipos de documento."""

from collections import defaultdict

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Clase, Curso, Profesor, Salon, SalonHorario, TipoDocumento


def hay_catalogo(db: Session) -> bool:
    return db.scalar(select(Clase.id).limit(1)) is not None


def listar_clases(db: Session) -> list[Clase]:
    return list(db.scalars(select(Clase).order_by(Clase.id)))


def clases_por_ids(db: Session, ids: set[int]) -> dict[int, Clase]:
    if not ids:
        return {}
    return {c.id: c for c in db.scalars(select(Clase).where(Clase.id.in_(ids)))}


def profesores_por_ids(db: Session, ids: set[int]) -> dict[int, Profesor]:
    if not ids:
        return {}
    return {p.id: p for p in db.scalars(select(Profesor).where(Profesor.id.in_(ids)))}


def clases_de_profesores(db: Session, ids_profesores: set[int] | None = None) -> dict[int, list[int]]:
    """id profesor → ids de las clases que dicta (según sus cursos), ordenados."""
    consulta = select(Curso.profesor_id, Curso.clase_id).where(Curso.profesor_id.is_not(None)).distinct()
    if ids_profesores is not None:
        consulta = consulta.where(Curso.profesor_id.in_(ids_profesores))
    resultado: dict[int, list[int]] = defaultdict(list)
    for id_profesor, id_clase in db.execute(consulta):
        resultado[id_profesor].append(id_clase)
    return {p: sorted(c) for p, c in resultado.items()}


def profesores_de_clases(db: Session, ids_clases: set[int] | None) -> list[Profesor]:
    """Profesores que dictan algún curso de esas clases (todos si ``ids_clases`` es None)."""
    consulta = select(Profesor).order_by(Profesor.id)
    if ids_clases is not None:
        if not ids_clases:
            return []
        dicta = select(Curso.id).where(Curso.profesor_id == Profesor.id, Curso.clase_id.in_(ids_clases))
        consulta = consulta.where(dicta.exists())
    return list(db.scalars(consulta))


def cursos_de_clases(db: Session, ids_clases: set[int]) -> list[Curso]:
    """Cursos de esas clases con profesor, sesiones, salones y edificios ya cargados."""
    if not ids_clases:
        return []
    consulta = (
        select(Curso)
        .where(Curso.clase_id.in_(ids_clases))
        .options(
            selectinload(Curso.profesor),
            selectinload(Curso.salon_horarios).selectinload(SalonHorario.salon).selectinload(Salon.edificio),
        )
        .order_by(Curso.id)
    )
    return list(db.scalars(consulta))


def tipo_documento(db: Session, tipo: str) -> TipoDocumento | None:
    return db.scalar(select(TipoDocumento).where(TipoDocumento.tipo == tipo))

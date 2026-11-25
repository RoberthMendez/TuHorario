"""Catálogo: clases y profesores que se pueden elegir."""

from sqlalchemy.orm import Session

from app.repositories import catalogo_repo
from app.schemas import ClaseOut, ProfesorOut


def listar_clases(db: Session) -> list[ClaseOut]:
    return [ClaseOut.model_validate(c) for c in catalogo_repo.listar_clases(db)]


def profesores_de_clases(db: Session, ids_clases: list[int] | None) -> list[ProfesorOut]:
    """Profesores que dictan alguna de esas clases (todos si no se filtra), con todas las clases que dictan."""
    profesores = catalogo_repo.profesores_de_clases(db, None if ids_clases is None else set(ids_clases))
    dicta = catalogo_repo.clases_de_profesores(db, {p.id for p in profesores})
    return [
        ProfesorOut(id=p.id, nombre=p.nombre, genero=p.genero, ids_clases=dicta.get(p.id, []))
        for p in profesores
    ]

"""Acceso a estudiantes y al consecutivo con el que se generan sus datos."""

import unicodedata

from sqlalchemy import delete, exists, select
from sqlalchemy.orm import Session

from app.models import Contador, Estudiante

CONTADOR_ESTUDIANTES = "estudiantes"


def obtener(db: Session, id_estudiante: int) -> Estudiante | None:
    return db.get(Estudiante, id_estudiante)


def por_ids(db: Session, ids: set[int]) -> dict[int, Estudiante]:
    if not ids:
        return {}
    return {e.id: e for e in db.scalars(select(Estudiante).where(Estudiante.id.in_(ids)))}


def correo_existe(db: Session, correo: str) -> bool:
    return db.scalar(select(exists().where(Estudiante.correo == correo))) or False


def _sin_tildes(texto: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", texto) if unicodedata.category(c) != "Mn").casefold()


def buscar(db: Session, texto: str, limite: int, excluir: int | None = None) -> list[Estudiante]:
    """Estudiantes cuyo nombre o correo contiene ``texto``, sin importar tildes ni mayúsculas.

    Quitar tildes en SQL no es portable entre PostgreSQL y SQLite, así que se
    filtra en Python: el proyecto maneja pocos estudiantes.
    """
    buscado = _sin_tildes(texto.strip())
    if not buscado:
        return []
    consulta = select(Estudiante).order_by(Estudiante.nombre, Estudiante.id)
    if excluir is not None:
        consulta = consulta.where(Estudiante.id != excluir)
    encontrados = []
    for estudiante in db.scalars(consulta):
        if buscado in _sin_tildes(estudiante.nombre) or buscado in _sin_tildes(estudiante.correo):
            encontrados.append(estudiante)
            if len(encontrados) == limite:
                break
    return encontrados


def siguiente_consecutivo(db: Session) -> int:
    """Avanza y devuelve el consecutivo de estudiantes (nunca se reutiliza)."""
    contador = db.scalar(
        select(Contador).where(Contador.nombre == CONTADOR_ESTUDIANTES).with_for_update()
    )
    if contador is None:
        contador = Contador(nombre=CONTADOR_ESTUDIANTES, valor=0)
        db.add(contador)
    contador.valor += 1
    db.flush()
    return contador.valor


def agregar(db: Session, estudiante: Estudiante) -> Estudiante:
    db.add(estudiante)
    db.flush()
    return estudiante


def eliminar(db: Session, id_estudiante: int) -> None:
    """Borra el estudiante; la base borra en cascada sus preferencias, inscripciones
    y las preferencias de otros que lo referencian."""
    db.execute(delete(Estudiante).where(Estudiante.id == id_estudiante))
    db.expire_all()

"""Acceso a las preferencias de los estudiantes."""

from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload

from app.models import PreferenciaClase, PreferenciaCompanero, PreferenciaProfe, PreferenciasDeEstudiante

_CARGAR_TODO = (
    selectinload(PreferenciasDeEstudiante.preferencia_clases).selectinload(PreferenciaClase.clase),
    selectinload(PreferenciasDeEstudiante.franjas_habilitadas),
    selectinload(PreferenciasDeEstudiante.preferencia_profes).selectinload(PreferenciaProfe.profesor),
    selectinload(PreferenciasDeEstudiante.preferencia_estudiantes).selectinload(PreferenciaCompanero.clase),
    selectinload(PreferenciasDeEstudiante.preferencia_estudiantes).selectinload(
        PreferenciaCompanero.estudiante_preferido
    ),
    selectinload(PreferenciasDeEstudiante.estudiantes_restringidos),
    selectinload(PreferenciasDeEstudiante.prioridad_preferencias),
)


def de_estudiantes(db: Session, ids: set[int]) -> dict[int, PreferenciasDeEstudiante]:
    """id estudiante → sus preferencias (con todas sus partes cargadas). Falta quien no tiene."""
    if not ids:
        return {}
    consulta = (
        select(PreferenciasDeEstudiante)
        .where(PreferenciasDeEstudiante.estudiante_id.in_(ids))
        .options(*_CARGAR_TODO)
    )
    return {p.estudiante_id: p for p in db.scalars(consulta)}


def reemplazar(db: Session, preferencias: PreferenciasDeEstudiante) -> PreferenciasDeEstudiante:
    """Borra las preferencias que tuviera el estudiante y guarda las nuevas."""
    db.execute(
        delete(PreferenciasDeEstudiante).where(
            PreferenciasDeEstudiante.estudiante_id == preferencias.estudiante_id
        )
    )
    db.expire_all()
    db.add(preferencias)
    db.flush()
    return preferencias

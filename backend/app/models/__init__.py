"""Modelos ORM (SQLAlchemy). Importarlos aquí registra todas las tablas en ``Base.metadata``."""

from app.models.catalogo import (
    Clase,
    Curso,
    Edificio,
    Profesor,
    Salon,
    SalonHorario,
    TipoDocumento,
    inscripciones,
)
from app.models.estudiante import Contador, Estudiante
from app.models.preferencias import (
    TIPOS_PREFERENCIA,
    FranjaHabilitada,
    PreferenciaClase,
    PreferenciaCompanero,
    PreferenciaProfe,
    PreferenciasDeEstudiante,
    PrioridadPreferencia,
    estudiantes_restringidos,
)

__all__ = [
    "TIPOS_PREFERENCIA",
    "Clase",
    "Contador",
    "Curso",
    "Edificio",
    "Estudiante",
    "FranjaHabilitada",
    "PreferenciaClase",
    "PreferenciaCompanero",
    "PreferenciaProfe",
    "PreferenciasDeEstudiante",
    "PrioridadPreferencia",
    "Profesor",
    "Salon",
    "SalonHorario",
    "TipoDocumento",
    "estudiantes_restringidos",
    "inscripciones",
]

"""Schemas de Pydantic: lo que entra y sale por la API (en camelCase, como los tipos de TS)."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from pydantic.alias_generators import to_camel

from app.core.dias import a_minutos, dia_api, dia_interno, validar_franja


class Esquema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


# ---------- Catálogo ----------


class ClaseOut(Esquema):
    id: int
    codigo: str
    nombre: str


class ProfesorOut(Esquema):
    id: int
    nombre: str
    genero: Literal["femenino", "masculino"]
    ids_clases: list[int]


# ---------- Estudiantes ----------


class TipoDocumentoOut(Esquema):
    id: int
    tipo: str


class EstudianteCrear(Esquema):
    nombre: str = Field(min_length=1, max_length=120)

    @field_validator("nombre")
    @classmethod
    def _limpiar(cls, valor: str) -> str:
        limpio = " ".join(valor.split())
        if not limpio:
            raise ValueError("El nombre no puede estar vacío")
        return limpio


class EstudianteOut(Esquema):
    id: int
    codigo_estudiantil: str
    tipo_documento: TipoDocumentoOut
    numero_documento: str
    nombre: str
    correo: str
    celular: str


class CompaneroOut(Esquema):
    id: int
    nombre: str
    correo: str


# ---------- Preferencias ----------

TipoPreferencia = Literal["horarios", "profesores", "estudiantes", "clases", "cercania", "huecos"]


class FranjaIn(Esquema):
    """Franja horaria. ``dia`` con o sin tilde; sale siempre con tilde, como en el front."""

    dia: str
    hora_inicio: str = Field(examples=["07:00"])
    hora_fin: str = Field(examples=["09:00"])

    @field_validator("dia")
    @classmethod
    def _dia(cls, valor: str) -> str:
        return dia_api(dia_interno(valor))

    @model_validator(mode="after")
    def _horas(self) -> "FranjaIn":
        validar_franja(a_minutos(self.hora_inicio), a_minutos(self.hora_fin))
        return self


class PreferenciaClaseIn(Esquema):
    id_clase: int
    prioridad: bool = False


class PreferenciaProfeIn(Esquema):
    id_profesor: int
    preferencia: int = Field(ge=0, le=3)


class PreferenciaCompaneroIn(Esquema):
    id_estudiante: int
    id_clase: int


class PrioridadIn(Esquema):
    tipo_preferencia: TipoPreferencia
    prioridad: int = Field(ge=1, le=6)


class PreferenciasIn(Esquema):
    """Todas las preferencias de un estudiante (``PUT`` las reemplaza completas)."""

    clases: list[PreferenciaClaseIn] = []
    franjas_habilitadas: list[FranjaIn] = []
    profesores: list[PreferenciaProfeIn] = []
    companeros: list[PreferenciaCompaneroIn] = []
    restringidos: list[int] = []
    preferencia_cercania: bool = False
    preferencia_sin_huecos: bool = False
    prioridades: list[PrioridadIn] = []


# ---------- Horarios ----------


class GenerarHorariosIn(Esquema):
    ids_estudiantes: list[int] = Field(min_length=1)


class SalonOut(Esquema):
    codigo: str
    edificio: str


class SesionOut(Esquema):
    dia: str
    hora_inicio: str
    hora_fin: str
    salon: SalonOut | None = None


class ProfesorResumenOut(Esquema):
    id: int
    nombre: str


class CursoAsignadoOut(Esquema):
    id: int
    codigo: str
    clase: ClaseOut
    profesor: ProfesorResumenOut | None
    sesiones: list[SesionOut]


class ClaseNoAsignadaOut(Esquema):
    clase: ClaseOut
    prioridad: bool


class PreferenciaNoCumplidaOut(Esquema):
    """Una preferencia que el horario no cumple, con un texto para mostrarle al estudiante."""

    tipo: TipoPreferencia
    detalle: str
    id_clase: int | None = None  # clase a la que se refiere (None en cercanía y huecos)


class HorarioEstudianteOut(Esquema):
    id_estudiante: int
    nombre: str
    cursos: list[CursoAsignadoOut]
    clases_no_asignadas: list[ClaseNoAsignadaOut]
    preferencias_no_cumplidas: list[PreferenciaNoCumplidaOut]

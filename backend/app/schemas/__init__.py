"""Schemas de Pydantic: lo que entra y sale por la API (en camelCase, como los tipos de TS)."""

from typing import Annotated, Literal

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


# ---------- Ejemplos de la sustentación ----------


class EjemploOut(Esquema):
    clave: str
    titulo: str
    descripcion: str
    cantidad_estudiantes: int


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


# Preferencias no cumplidas: un esquema por caso (``caso`` dice cuál) con los
# datos que el front necesita para dibujarlo, además de ``detalle``: el caso en
# una frase (para lectores de pantalla y textos de ayuda).


class EstudianteResumenOut(Esquema):
    id: int
    nombre: str


class ProfesorCalificadoOut(Esquema):
    """Profesor de un curso con la calificación que le dio el estudiante (None: no lo calificó)."""

    id: int
    nombre: str
    genero: Literal["femenino", "masculino"]
    nota: int | None = None


class TramoOut(Esquema):
    hora_inicio: str
    hora_fin: str


class ParadaOut(Esquema):
    """Una clase y el edificio en el que se dicta."""

    clase: ClaseOut
    edificio: str


class _NoCumplida(Esquema):
    tipo: TipoPreferencia
    detalle: str
    id_clase: int | None = None  # clase a la que se refiere (None en cercanía y huecos)


class ClaseSinCupoOut(_NoCumplida):
    caso: Literal["claseSinCupo"] = "claseSinCupo"
    clase: ClaseOut
    prioridad: bool


class FueraDeFranjaOut(_NoCumplida):
    caso: Literal["fueraDeFranja"] = "fueraDeFranja"
    clase: ClaseOut
    dia: str
    hora_inicio: str
    hora_fin: str
    parcial: bool  # solo una parte de la sesión queda fuera de las franjas


class ProfesorVetadoOut(_NoCumplida):
    caso: Literal["profesorVetado"] = "profesorVetado"
    clase: ClaseOut
    profesor: ProfesorCalificadoOut


class OtroProfesorOut(_NoCumplida):
    """Le tocó un profesor con menor calificación que el que prefería."""

    caso: Literal["otroProfesor"] = "otroProfesor"
    clase: ClaseOut
    profesor: ProfesorCalificadoOut | None  # None: el curso no tiene profesor
    preferido: ProfesorCalificadoOut


class SinCompaneroOut(_NoCumplida):
    caso: Literal["sinCompanero"] = "sinCompanero"
    clase: ClaseOut
    companero: EstudianteResumenOut
    # sinClase: no le asignaron la clase; companeroSinClase: el compañero no
    # quedó en ella; otroCurso: quedaron en cursos distintos.
    motivo: Literal["sinClase", "companeroSinClase", "otroCurso"]
    curso: str | None = None  # su curso, si quedó en la clase
    curso_companero: str | None = None  # el del compañero, si él quedó


class ConRestringidoOut(_NoCumplida):
    caso: Literal["conRestringido"] = "conRestringido"
    clase: ClaseOut
    restringido: EstudianteResumenOut
    curso: str


class SinDescansoOut(_NoCumplida):
    """Dos clases seguidas, sin hora libre, en edificios distintos."""

    caso: Literal["sinDescanso"] = "sinDescanso"
    dia: str
    hora: str  # cuando empieza la segunda
    desde: ParadaOut
    hasta: ParadaOut


class HorasLibresOut(_NoCumplida):
    caso: Literal["horasLibres"] = "horasLibres"
    dia: str
    horas: int
    tramos: list[TramoOut]


PreferenciaNoCumplidaOut = Annotated[
    ClaseSinCupoOut
    | FueraDeFranjaOut
    | ProfesorVetadoOut
    | OtroProfesorOut
    | SinCompaneroOut
    | ConRestringidoOut
    | SinDescansoOut
    | HorasLibresOut,
    Field(discriminator="caso"),
]


class HorarioEstudianteOut(Esquema):
    id_estudiante: int
    nombre: str
    cursos: list[CursoAsignadoOut]
    clases_no_asignadas: list[ClaseNoAsignadaOut]
    preferencias_no_cumplidas: list[PreferenciaNoCumplidaOut]

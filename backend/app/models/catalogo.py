"""Catálogo de la universidad: tipos de documento, profesores, clases, cursos, edificios y salones."""

from sqlalchemy import CheckConstraint, Column, Float, ForeignKey, String, Table, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

DIAS_SQL = "('lunes','martes','miercoles','jueves','viernes','sabado')"


def checks_franja(prefijo: str) -> tuple[CheckConstraint, ...]:
    """Día válido, horas en minutos, en punto y entre 7:00 (420) y 21:00 (1260)."""
    return (
        CheckConstraint(f"dia IN {DIAS_SQL}", name=f"ck_{prefijo}_dia"),
        CheckConstraint("hora_inicio % 60 = 0 AND hora_fin % 60 = 0", name=f"ck_{prefijo}_en_punto"),
        CheckConstraint("hora_inicio >= 420 AND hora_fin <= 1260 AND hora_inicio < hora_fin", name=f"ck_{prefijo}_rango"),
    )


# TAD Curso.listaEstudiantes: aquí queda el resultado de la asignación.
inscripciones = Table(
    "inscripciones",
    Base.metadata,
    Column("curso_id", ForeignKey("cursos.id", ondelete="CASCADE"), primary_key=True),
    Column("estudiante_id", ForeignKey("estudiantes.id", ondelete="CASCADE"), primary_key=True),
)


class TipoDocumento(Base):
    __tablename__ = "tipos_documento"

    id: Mapped[int] = mapped_column(primary_key=True)
    tipo: Mapped[str] = mapped_column(String(40), unique=True)


class Profesor(Base):
    __tablename__ = "profesores"
    __table_args__ = (CheckConstraint("genero IN ('femenino','masculino')", name="ck_profesor_genero"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120))
    genero: Mapped[str] = mapped_column(String(10))
    tipo_documento_id: Mapped[int | None] = mapped_column(ForeignKey("tipos_documento.id"))
    numero_documento: Mapped[str | None] = mapped_column(String(20), unique=True)
    correo: Mapped[str | None] = mapped_column(String(120), unique=True)
    celular: Mapped[str | None] = mapped_column(String(20))

    tipo_documento: Mapped[TipoDocumento | None] = relationship()
    cursos: Mapped[list["Curso"]] = relationship(back_populates="profesor")


class Clase(Base):
    __tablename__ = "clases"

    id: Mapped[int] = mapped_column(primary_key=True)
    codigo: Mapped[str] = mapped_column(String(20), unique=True)
    nombre: Mapped[str] = mapped_column(String(120))

    cursos: Mapped[list["Curso"]] = relationship(
        back_populates="clase", cascade="all, delete-orphan", passive_deletes=True, order_by="Curso.id"
    )


class Edificio(Base):
    __tablename__ = "edificios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), unique=True)
    direccion: Mapped[str] = mapped_column(String(160), default="")
    coordenada_x: Mapped[float] = mapped_column(Float)
    coordenada_y: Mapped[float] = mapped_column(Float)

    salones: Mapped[list["Salon"]] = relationship(
        back_populates="edificio", cascade="all, delete-orphan", passive_deletes=True
    )


class Salon(Base):
    __tablename__ = "salones"
    __table_args__ = (UniqueConstraint("edificio_id", "codigo", name="uq_salon_edificio_codigo"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    codigo: Mapped[str] = mapped_column(String(20))
    edificio_id: Mapped[int] = mapped_column(ForeignKey("edificios.id", ondelete="CASCADE"))

    edificio: Mapped[Edificio] = relationship(back_populates="salones")


class Curso(Base):
    __tablename__ = "cursos"
    __table_args__ = (CheckConstraint("cupo >= 0", name="ck_curso_cupo"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    codigo: Mapped[str] = mapped_column(String(30), unique=True)
    cupo: Mapped[int]
    clase_id: Mapped[int] = mapped_column(ForeignKey("clases.id", ondelete="CASCADE"))
    profesor_id: Mapped[int | None] = mapped_column(ForeignKey("profesores.id", ondelete="SET NULL"))

    clase: Mapped[Clase] = relationship(back_populates="cursos")
    profesor: Mapped[Profesor | None] = relationship(back_populates="cursos")
    salon_horarios: Mapped[list["SalonHorario"]] = relationship(
        back_populates="curso",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by=lambda: [SalonHorario.dia_orden, SalonHorario.hora_inicio],
    )
    lista_estudiantes: Mapped[list["Estudiante"]] = relationship(  # noqa: F821
        secondary=inscripciones, passive_deletes=True
    )


class SalonHorario(Base):
    """Sesión de un curso: un Horario (día y horas) en un Salón (TAD SalonHorario).

    El mismo salón no puede repetir un par día-hora de inicio (``unique``); que
    tampoco se solapen dos sesiones del mismo salón lo valida quien las crea
    (no hay una restricción portable entre SQLite y PostgreSQL para eso).
    """

    __tablename__ = "salon_horarios"
    __table_args__ = (
        UniqueConstraint("salon_id", "dia", "hora_inicio", name="uq_salon_horario"),
        CheckConstraint("dia_orden >= 0 AND dia_orden <= 5", name="ck_salon_horario_dia_orden"),
        *checks_franja("salon_horario"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    curso_id: Mapped[int] = mapped_column(ForeignKey("cursos.id", ondelete="CASCADE"))
    salon_id: Mapped[int] = mapped_column(ForeignKey("salones.id", ondelete="RESTRICT"))
    dia: Mapped[str] = mapped_column(String(10))
    # Posición del día (lunes = 0) para ordenar las sesiones dentro de la semana.
    dia_orden: Mapped[int]
    hora_inicio: Mapped[int]  # minutos desde la medianoche
    hora_fin: Mapped[int]

    curso: Mapped[Curso] = relationship(back_populates="salon_horarios")
    salon: Mapped[Salon] = relationship()

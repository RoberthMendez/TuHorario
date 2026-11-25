"""TAD PreferenciasDeEstudiante y sus partes (1:1 con Estudiante).

Todo cuelga de ``preferencias_estudiante`` con ``ON DELETE CASCADE``: al borrar
un estudiante se borran sus preferencias. Las filas de otros estudiantes que lo
referencian (como compañero o restringido) también se borran en cascada.
"""

from sqlalchemy import Boolean, CheckConstraint, Column, ForeignKey, String, Table, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.catalogo import Clase, Profesor, checks_franja
from app.models.estudiante import Estudiante

TIPOS_PREFERENCIA = ("horarios", "profesores", "estudiantes", "clases", "cercania", "huecos")
_TIPOS_SQL = "(" + ",".join(f"'{t}'" for t in TIPOS_PREFERENCIA) + ")"

_FK_PREFERENCIAS = "preferencias_estudiante.id"

estudiantes_restringidos = Table(
    "estudiantes_restringidos",
    Base.metadata,
    Column("preferencias_id", ForeignKey(_FK_PREFERENCIAS, ondelete="CASCADE"), primary_key=True),
    Column("estudiante_id", ForeignKey("estudiantes.id", ondelete="CASCADE"), primary_key=True),
)


class PreferenciasDeEstudiante(Base):
    __tablename__ = "preferencias_estudiante"

    id: Mapped[int] = mapped_column(primary_key=True)
    estudiante_id: Mapped[int] = mapped_column(ForeignKey("estudiantes.id", ondelete="CASCADE"), unique=True)
    preferencia_cercania: Mapped[bool] = mapped_column(Boolean, default=False)
    preferencia_sin_huecos: Mapped[bool] = mapped_column(Boolean, default=False)

    estudiante: Mapped[Estudiante] = relationship(back_populates="preferencias")
    _hijos = dict(back_populates="preferencias", cascade="all, delete-orphan", passive_deletes=True)
    preferencia_clases: Mapped[list["PreferenciaClase"]] = relationship(order_by="PreferenciaClase.id", **_hijos)
    franjas_habilitadas: Mapped[list["FranjaHabilitada"]] = relationship(order_by="FranjaHabilitada.id", **_hijos)
    preferencia_profes: Mapped[list["PreferenciaProfe"]] = relationship(order_by="PreferenciaProfe.id", **_hijos)
    preferencia_estudiantes: Mapped[list["PreferenciaCompanero"]] = relationship(
        order_by="PreferenciaCompanero.id", **_hijos
    )
    prioridad_preferencias: Mapped[list["PrioridadPreferencia"]] = relationship(
        order_by="PrioridadPreferencia.prioridad", **_hijos
    )
    estudiantes_restringidos: Mapped[list[Estudiante]] = relationship(
        secondary=estudiantes_restringidos, passive_deletes=True, order_by=Estudiante.id
    )
    del _hijos


class PreferenciaClase(Base):
    __tablename__ = "preferencias_clase"
    __table_args__ = (UniqueConstraint("preferencias_id", "clase_id", name="uq_preferencia_clase"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    preferencias_id: Mapped[int] = mapped_column(ForeignKey(_FK_PREFERENCIAS, ondelete="CASCADE"))
    clase_id: Mapped[int] = mapped_column(ForeignKey("clases.id", ondelete="CASCADE"))
    prioridad: Mapped[bool] = mapped_column(Boolean, default=False)

    preferencias: Mapped[PreferenciasDeEstudiante] = relationship(back_populates="preferencia_clases")
    clase: Mapped[Clase] = relationship()


class FranjaHabilitada(Base):
    """Horario en el que el estudiante prefiere tener clase (TAD franjasHabilitadas)."""

    __tablename__ = "franjas_habilitadas"
    __table_args__ = checks_franja("franja")

    id: Mapped[int] = mapped_column(primary_key=True)
    preferencias_id: Mapped[int] = mapped_column(ForeignKey(_FK_PREFERENCIAS, ondelete="CASCADE"))
    dia: Mapped[str] = mapped_column(String(10))
    hora_inicio: Mapped[int]
    hora_fin: Mapped[int]

    preferencias: Mapped[PreferenciasDeEstudiante] = relationship(back_populates="franjas_habilitadas")


class PreferenciaProfe(Base):
    __tablename__ = "preferencias_profe"
    __table_args__ = (
        UniqueConstraint("preferencias_id", "profesor_id", name="uq_preferencia_profe"),
        CheckConstraint("preferencia >= 0 AND preferencia <= 3", name="ck_preferencia_profe_rango"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    preferencias_id: Mapped[int] = mapped_column(ForeignKey(_FK_PREFERENCIAS, ondelete="CASCADE"))
    profesor_id: Mapped[int] = mapped_column(ForeignKey("profesores.id", ondelete="CASCADE"))
    preferencia: Mapped[int]

    preferencias: Mapped[PreferenciasDeEstudiante] = relationship(back_populates="preferencia_profes")
    profesor: Mapped[Profesor] = relationship()


class PreferenciaCompanero(Base):
    __tablename__ = "preferencias_companero"
    __table_args__ = (
        UniqueConstraint("preferencias_id", "estudiante_preferido_id", "clase_id", name="uq_preferencia_companero"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    preferencias_id: Mapped[int] = mapped_column(ForeignKey(_FK_PREFERENCIAS, ondelete="CASCADE"))
    estudiante_preferido_id: Mapped[int] = mapped_column(ForeignKey("estudiantes.id", ondelete="CASCADE"))
    clase_id: Mapped[int] = mapped_column(ForeignKey("clases.id", ondelete="CASCADE"))

    preferencias: Mapped[PreferenciasDeEstudiante] = relationship(back_populates="preferencia_estudiantes")
    estudiante_preferido: Mapped[Estudiante] = relationship()
    clase: Mapped[Clase] = relationship()


class PrioridadPreferencia(Base):
    """Posición de una categoría en el ranking del estudiante (1 = la más importante)."""

    __tablename__ = "prioridades_preferencia"
    __table_args__ = (
        UniqueConstraint("preferencias_id", "tipo_preferencia", name="uq_prioridad_tipo"),
        UniqueConstraint("preferencias_id", "prioridad", name="uq_prioridad_posicion"),
        CheckConstraint(f"tipo_preferencia IN {_TIPOS_SQL}", name="ck_prioridad_tipo"),
        CheckConstraint("prioridad >= 1 AND prioridad <= 6", name="ck_prioridad_rango"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    preferencias_id: Mapped[int] = mapped_column(ForeignKey(_FK_PREFERENCIAS, ondelete="CASCADE"))
    tipo_preferencia: Mapped[str] = mapped_column(String(20))
    prioridad: Mapped[int]

    preferencias: Mapped[PreferenciasDeEstudiante] = relationship(back_populates="prioridad_preferencias")

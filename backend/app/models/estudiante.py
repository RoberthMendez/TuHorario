"""Estudiantes y el contador de consecutivos (código y cédula no se reutilizan)."""

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.catalogo import TipoDocumento


class Contador(Base):
    """Consecutivos que nunca retroceden, aunque se borren filas (p. ej. ``"estudiantes"``)."""

    __tablename__ = "contadores"

    nombre: Mapped[str] = mapped_column(String(40), primary_key=True)
    valor: Mapped[int] = mapped_column(default=0)


class Estudiante(Base):
    __tablename__ = "estudiantes"

    id: Mapped[int] = mapped_column(primary_key=True)
    codigo_estudiantil: Mapped[str] = mapped_column(String(20), unique=True)
    tipo_documento_id: Mapped[int] = mapped_column(ForeignKey("tipos_documento.id"))
    numero_documento: Mapped[str] = mapped_column(String(20), unique=True)
    nombre: Mapped[str] = mapped_column(String(120))
    correo: Mapped[str] = mapped_column(String(120), unique=True)
    celular: Mapped[str] = mapped_column(String(20))

    tipo_documento: Mapped[TipoDocumento] = relationship(lazy="joined")
    preferencias: Mapped["PreferenciasDeEstudiante | None"] = relationship(  # noqa: F821
        back_populates="estudiante", cascade="all, delete-orphan", passive_deletes=True, uselist=False
    )

"""Estudiantes: se crean solo con el nombre; el resto de sus datos se genera aquí.

Reglas (las mismas que simulaba ``frontend/src/services/estudiantesService.ts``):

- Código estudiantil: ``2026`` + consecutivo de 4 cifras (20260001, 20260002…).
- Cédula: 10 cifras, consecutiva desde 1000000001 (el 3.º es 1000000003).
- Correo: inicial del nombre + primer apellido + últimas 2 cifras de la cédula,
  en minúscula y sin tildes (``rmendez01@javeriana.edu.co``). Si ese correo ya
  existe (p. ej. el estudiante 1 y el 101 se llaman igual), se usan 3, 4…
  cifras de la cédula hasta que sea único.
- Celular: ``310`` + 7 cifras al azar (``310 482 1937``).
- El consecutivo vive en la base y no se reutiliza aunque se borren estudiantes.
"""

import random
import re
import unicodedata

from sqlalchemy.orm import Session

from app.core.errores import NoEncontrado
from app.models import Estudiante, TipoDocumento
from app.repositories import catalogo_repo, estudiantes_repo

DOMINIO = "javeriana.edu.co"
CEDULA_BASE = 1_000_000_000
PREFIJO_CODIGO = "2026"
TIPO_DOCUMENTO = "Cédula"


def _normalizar(texto: str) -> str:
    """Minúsculas, sin tildes ni eñes, solo letras y números."""
    sin_tildes = "".join(c for c in unicodedata.normalize("NFD", texto) if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", sin_tildes.lower())


def primer_apellido(palabras: list[str]) -> str:
    """"Ana Ruiz" → Ruiz; "Ana Ruiz Gómez" → Ruiz; "Ana María Ruiz Gómez" → Ruiz (penúltima)."""
    if len(palabras) <= 1:
        return ""
    if len(palabras) <= 3:
        return palabras[1]
    return palabras[-2]


def usuario_correo(nombre: str, cedula: str, cifras: int = 2) -> str:
    palabras = [p for p in (_normalizar(w) for w in nombre.split()) if p]
    inicial = palabras[0][0] if palabras else "e"
    return f"{inicial}{primer_apellido(palabras)}{cedula[-cifras:]}"


def _celular() -> str:
    cifras = "".join(str(random.randint(0, 9)) for _ in range(7))
    return f"310 {cifras[:3]} {cifras[3:]}"


def crear(db: Session, nombre: str) -> Estudiante:
    n = estudiantes_repo.siguiente_consecutivo(db)
    cedula = str(CEDULA_BASE + n)
    cifras = 2
    correo = f"{usuario_correo(nombre, cedula, cifras)}@{DOMINIO}"
    while estudiantes_repo.correo_existe(db, correo) and cifras < len(cedula):
        cifras += 1
        correo = f"{usuario_correo(nombre, cedula, cifras)}@{DOMINIO}"

    tipo = catalogo_repo.tipo_documento(db, TIPO_DOCUMENTO) or TipoDocumento(tipo=TIPO_DOCUMENTO)
    estudiante = estudiantes_repo.agregar(
        db,
        Estudiante(
            codigo_estudiantil=f"{PREFIJO_CODIGO}{n:04d}",
            tipo_documento=tipo,
            numero_documento=cedula,
            nombre=nombre,
            correo=correo,
            celular=_celular(),
        ),
    )
    db.commit()
    return estudiante


def buscar(db: Session, texto: str, limite: int, excluir: int | None) -> list[Estudiante]:
    return estudiantes_repo.buscar(db, texto, limite, excluir)


def eliminar(db: Session, id_estudiante: int) -> None:
    if estudiantes_repo.obtener(db, id_estudiante) is None:
        raise NoEncontrado(f"No existe el estudiante {id_estudiante}")
    estudiantes_repo.eliminar(db, id_estudiante)
    db.commit()

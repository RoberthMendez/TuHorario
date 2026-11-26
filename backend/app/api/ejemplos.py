from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import EjemploOut, EstudianteOut
from app.services import ejemplos_service

router = APIRouter(prefix="/ejemplos", tags=["ejemplos"])


@router.get("", response_model=list[EjemploOut])
def listar_ejemplos():
    """Ejemplos de la sustentación: el completo y uno por cada nivel."""
    return ejemplos_service.listar()


@router.post("/{clave}", response_model=list[EstudianteOut], status_code=status.HTTP_201_CREATED)
def crear_ejemplo(clave: str, db: Annotated[Session, Depends(get_db)]):
    """Crea los estudiantes del ejemplo con sus preferencias (y borra los de una carga anterior)."""
    return ejemplos_service.crear(db, clave)

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import EstudianteOut
from app.services import ejemplo_service

router = APIRouter(prefix="/ejemplo", tags=["ejemplo"])


@router.post("", response_model=list[EstudianteOut], status_code=status.HTTP_201_CREATED)
def crear_ejemplo(db: Annotated[Session, Depends(get_db)]):
    """Crea los 10 estudiantes del ejemplo de la sustentación con sus preferencias."""
    return ejemplo_service.crear(db)

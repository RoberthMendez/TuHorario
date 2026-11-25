from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.parametros import lista_ids
from app.db import get_db
from app.schemas import GenerarHorariosIn, HorarioEstudianteOut
from app.services import horarios_service

router = APIRouter(prefix="/horarios", tags=["horarios"])


@router.post("/generar", response_model=list[HorarioEstudianteOut])
def generar_horarios(datos: GenerarHorariosIn, db: Annotated[Session, Depends(get_db)]):
    return horarios_service.generar(db, datos.ids_estudiantes)


@router.get("", response_model=list[HorarioEstudianteOut])
def obtener_horarios(
    db: Annotated[Session, Depends(get_db)],
    estudiantes: Annotated[str, Query(description="Ids de estudiantes separados por comas")],
):
    return horarios_service.obtener(db, lista_ids(estudiantes, "estudiantes") or [])

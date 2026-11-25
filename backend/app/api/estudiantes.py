from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import CompaneroOut, EstudianteCrear, EstudianteOut, PreferenciasIn
from app.services import estudiantes_service, preferencias_service

router = APIRouter(prefix="/estudiantes", tags=["estudiantes"])


@router.get("", response_model=list[CompaneroOut])
def buscar_estudiantes(
    db: Annotated[Session, Depends(get_db)],
    buscar: Annotated[str, Query(max_length=120)] = "",
    limite: Annotated[int, Query(ge=1, le=50)] = 5,
    excluir: int | None = None,
):
    return estudiantes_service.buscar(db, buscar, limite, excluir)


@router.post("", response_model=EstudianteOut, status_code=status.HTTP_201_CREATED)
def crear_estudiante(datos: EstudianteCrear, db: Annotated[Session, Depends(get_db)]):
    return estudiantes_service.crear(db, datos.nombre)


@router.delete("/{id_estudiante}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_estudiante(id_estudiante: int, db: Annotated[Session, Depends(get_db)]):
    estudiantes_service.eliminar(db, id_estudiante)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{id_estudiante}/preferencias", response_model=PreferenciasIn)
def obtener_preferencias(id_estudiante: int, db: Annotated[Session, Depends(get_db)]):
    return preferencias_service.obtener(db, id_estudiante)


@router.put("/{id_estudiante}/preferencias", response_model=PreferenciasIn)
def guardar_preferencias(id_estudiante: int, datos: PreferenciasIn, db: Annotated[Session, Depends(get_db)]):
    return preferencias_service.guardar(db, id_estudiante, datos)

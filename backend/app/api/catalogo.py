from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.parametros import lista_ids
from app.db import get_db
from app.schemas import ClaseOut, ProfesorOut
from app.services import catalogo_service

router = APIRouter(tags=["catálogo"])


@router.get("/clases", response_model=list[ClaseOut])
def listar_clases(db: Annotated[Session, Depends(get_db)]):
    return catalogo_service.listar_clases(db)


@router.get("/profesores", response_model=list[ProfesorOut])
def listar_profesores(
    db: Annotated[Session, Depends(get_db)],
    clases: Annotated[str | None, Query(description="Ids de clases separados por comas")] = None,
):
    return catalogo_service.profesores_de_clases(db, lista_ids(clases, "clases"))

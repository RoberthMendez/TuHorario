from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from app import models  # noqa: F401  (registra las tablas en Base.metadata)
from app.api import router
from app.core.config import settings
from app.core.errores import ErrorDominio
from app.db import Base, SessionLocal, engine
from app.db.semilla import sembrar


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    # Sin Alembic: se crean las tablas que falten y se siembra el catálogo si está vacío.
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        sembrar(db)
    yield


app = FastAPI(title="TuHorario API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ErrorDominio)
async def manejar_error_dominio(_request: Request, error: ErrorDominio) -> JSONResponse:
    return JSONResponse(status_code=error.estado, content={"detail": error.mensaje})


@app.exception_handler(IntegrityError)
async def manejar_integridad(_request: Request, _error: IntegrityError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"detail": "Los datos chocan con información ya guardada"})


app.include_router(router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

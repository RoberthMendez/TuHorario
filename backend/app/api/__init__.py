"""Controladores (routers de FastAPI): validan con los schemas y delegan en los servicios."""

from fastapi import APIRouter

from app.api import catalogo, ejemplo, estudiantes, horarios

router = APIRouter()
router.include_router(catalogo.router)
router.include_router(estudiantes.router)
router.include_router(horarios.router)
router.include_router(ejemplo.router)

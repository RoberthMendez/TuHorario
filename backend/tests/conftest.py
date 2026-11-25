"""Base SQLite en memoria (una por test) con el catálogo semilla y ``get_db`` sobreescrito."""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app import models  # noqa: F401
from app.db import Base, crear_engine, get_db
from app.db.semilla import sembrar
from app.main import app


@pytest.fixture
def sesiones() -> Iterator[sessionmaker[Session]]:
    engine = crear_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    fabrica = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    with fabrica() as db:
        sembrar(db)
    yield fabrica
    engine.dispose()


@pytest.fixture
def db(sesiones: sessionmaker[Session]) -> Iterator[Session]:
    with sesiones() as sesion:
        yield sesion


@pytest.fixture
def client(sesiones: sessionmaker[Session]) -> Iterator[TestClient]:
    def get_db_prueba() -> Iterator[Session]:
        with sesiones() as sesion:
            yield sesion

    app.dependency_overrides[get_db] = get_db_prueba
    # Sin `with`: no corre el lifespan (que usaría la base real).
    yield TestClient(app)
    app.dependency_overrides.clear()

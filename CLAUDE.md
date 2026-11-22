# CLAUDE.md

## Proyecto

TuHorario es una aplicación web full-stack para asignar horarios estudiantiles
según las preferencias de cada estudiante (Pontificia Universidad Javeriana).
Es un proyecto académico (Análisis de Algoritmos) que no va a escalar. El
documento de la primera entrega, con los TADs, está en `docs/`.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS v4 (plugin `@tailwindcss/vite`,
  sin `tailwind.config.js`), react-router-dom, oxlint (linter por defecto de la plantilla de Vite) + Prettier.
- Backend: Python + FastAPI, Pydantic, pydantic-settings, SQLAlchemy, psycopg 3.
- Base de datos: PostgreSQL 18 con Docker Compose (no se instala localmente).
- Algoritmo: módulo Python independiente en `algoritmo/`.

## Estructura

- `frontend/src/` — `assets/`, `components/`, `pages/`, `types/`, `data/` (mocks), `styles/`.
- `backend/app/` — `api/`, `core/` (config), `models/`, `schemas/`, `services/`, `db/`, `main.py`.
- `backend/tests/` — tests con pytest.
- `algoritmo/` — paquete Python con su propio `tests/`; no importa nada del backend ni de FastAPI.
- `docs/` — documentación. No modificar el PDF de la entrega.
- Configuración por variables de entorno en `.env` (plantilla: `.env.example`).

## Comandos útiles

```bash
# Base de datos (requiere Docker Desktop)
docker compose up -d
docker compose down

# Frontend
cd frontend && npm run dev       # http://localhost:5173
cd frontend && npm run build
cd frontend && npm run lint
cd frontend && npm run format

# Backend (con .venv activado)
cd backend && uvicorn app.main:app --reload   # http://localhost:8000/health
cd backend && pytest

# Algoritmo (con su .venv activado)
cd algoritmo && pytest
```

## Reglas de trabajo

- Por ahora solo front con datos mock hardcodeados (en `frontend/src/data/`).
- El backend y el algoritmo se desarrollan por separado.
- Usar Tailwind CSS para estilos.
- En el frontend, mantener la configuración por defecto de la plantilla de Vite (oxlint, versiones de TypeScript, tsconfig); no reemplazarla por otras herramientas.
- Seguir los TADs de `docs/` para nombrar tipos y entidades.
- Priorizar soluciones simples: el proyecto no va a escalar.
- No usar Alembic ni herramientas de migraciones.

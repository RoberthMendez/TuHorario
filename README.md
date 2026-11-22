# TuHorario

Aplicación web full-stack para asignar horarios estudiantiles según las
preferencias de cada estudiante (Pontificia Universidad Javeriana). Proyecto
académico de Análisis de Algoritmos.

> Estado actual: solo estructura inicial (scaffolding), sin funcionalidades.

**¿Recién llegas al proyecto?** Sigue la [guía de inicio](docs/GUIA_INICIO.md):
cómo clonar, instalar, comprobar que todo corre y cómo trabajamos con ramas y
Pull Requests.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Python + FastAPI (API REST), Pydantic, SQLAlchemy
- **Base de datos:** PostgreSQL, levantado con Docker Compose
- **Algoritmo:** módulo de Python independiente del backend

## Estructura

```
TuHorario/
├── frontend/            # React + TS + Vite + Tailwind
│   └── src/{assets,components,pages,types,data,styles}/
├── backend/             # FastAPI
│   ├── app/
│   │   ├── api/  core/  models/  schemas/  services/  db/
│   │   └── main.py
│   └── tests/
├── algoritmo/           # módulo Python independiente (sin FastAPI)
│   └── tests/
├── docs/                # documentación (entregas)
├── docker-compose.yml   # PostgreSQL
└── .env.example         # variables de entorno de ejemplo
```

## Requisitos

- Node.js 20.19+ (o 22.12+) y npm
- Python 3.12+
- Docker Desktop (solo para la base de datos)

## Instalación y ejecución

### 0. Variables de entorno

```bash
cp .env.example .env
```

### 1. Base de datos

Requiere Docker Desktop abierto. Desde la raíz:

```bash
docker compose up -d     # levantar PostgreSQL en localhost:5432
docker compose down      # detenerlo (los datos persisten en el volumen)
```

### 2. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate   |   macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload      # http://localhost:8000/health
pytest
```

El backend todavía no se conecta a la base de datos, así que arranca aunque
PostgreSQL no esté levantado.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint
npm run format
```

### 4. Algoritmo

```bash
cd algoritmo
python -m venv .venv
# Windows: .venv\Scripts\activate   |   macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
pytest
```

"""Paquete principal del backend de TuHorario."""

import sys
from pathlib import Path

# El paquete `algoritmo/` vive en la raíz del monorepo, fuera de `backend/`.
# Se añade la raíz al path para que `import algoritmo` funcione tanto con
# `uvicorn app.main:app` como con `pytest`, ambos lanzados desde `backend/`.
# (backend/app/__init__.py -> parents[2] = raíz del repo)
REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.append(str(REPO_ROOT))

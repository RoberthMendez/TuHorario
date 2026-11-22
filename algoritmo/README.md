# algoritmo

Módulo de Python independiente con el algoritmo de asignación de horarios de
TuHorario. **No** importa nada del backend ni de FastAPI; el backend lo usará
como una librería más.

Por ahora solo contiene la estructura y un test placeholder.

## Tests

Desde `algoritmo/`:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate   |   macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
pytest
```

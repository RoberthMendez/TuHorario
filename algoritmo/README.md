# algoritmo

Módulo de Python independiente con el algoritmo de asignación de horarios de
TuHorario. **No** importa nada del backend ni de FastAPI; el backend lo usará
como una librería más.

## Estado: Niveles 1 a 8 (todos)

- Puntaje por estudiante: `(prioritarias, no_prioritarias, satisfaccion)`,
  comparado lexicográficamente: una prioritaria más le gana a cualquier
  cantidad de no prioritarias, y una clase más le gana a cualquier
  satisfacción.
- Satisfacción de un curso (Nivel 3): fracción de su tiempo dentro de las
  `franjas_habilitadas` del estudiante (0–1), precalculada en `franjas.py`
  con las máscaras: `popcount(curso & franjas) / popcount(curso)`.
- Profesor (Nivel 4): calificación de 0 a 3. Un curso con profesor calificado
  con 0 se descarta (filtro); si no, suma `calificacion / 3` a la satisfacción
  (`profesores.py`). Profesor sin calificar: suma 0.
- Compañeros (Nivel 5): en cada curso, fracción de sus amigos de esa clase
  (pedidos por él o que lo pidieron a él) que ya están inscritos, menos la
  fracción de sus excluidos (en ambas direcciones) presentes, en [−1, 1]
  (`companeros.py`). Los amigos se procesan seguidos.
- Fase de mejora (Nivel 5): al final, cada estudiante libera sus cupos,
  recalcula su PD con todas sus clases y los demás fijos, y se acepta si sube
  el puntaje global. Hasta `pasadas_mejora` pasadas (5 por defecto).
- Cercanía (Nivel 6, solo si `preferencia_cercania`): la firma de la PD pasa a
  ser `(mascara, edificios)` y en el caso base se resta `distancia /
  distancia_máxima` por cada clase que empieza justo cuando termina la
  anterior el mismo día (sin hueco) (`cercania.py`).
- Sin huecos (Nivel 7, solo si `preferencia_sin_huecos`): en el caso base se
  resta `horas de hueco / 12`, con las horas de hueco de cada día =
  `(último − primero + 1) − bloques ocupados` sobre la máscara final
  (`huecos.py`). No agranda el estado.
- Prioridad entre preferencias (Nivel 8): cada criterio está normalizado a
  [0, 1] por unidad y se multiplica por `w = 2^(m − posición)` según el ranking
  del estudiante (escalado para que los pesos sumen m); lo que no está en el
  ranking pesa 0 y sin ranking todo pesa 1 (`pesos.py`). "clases" no se
  pondera: la prioridad de clases siempre domina.
- Dos rondas globales: primero todos inscriben sus prioritarias; después sus
  no prioritarias, sin cruzarse con lo ya inscrito.
- `python traza.py` muestra el algoritmo paso a paso.

| Archivo | Contenido |
|---|---|
| `tiempo.py` | 84 bloques de 1 h (lun–sáb, 7–21) y máscaras de bits. Las horas siempre son en punto. |
| `modelos.py` | `Horario`, `Curso`, `Clase`, `PreferenciaClase`, `PreferenciasDeEstudiante`, `Estudiante` (según los TADs). |
| `franjas.py` | Satisfacción de cada curso según las franjas habilitadas (Nivel 3). |
| `profesores.py` | Filtro de profesor vetado y satisfacción por calificación (Nivel 4). |
| `companeros.py` | Bono de amigos / penalización de excluidos y orden por componentes (Nivel 5). |
| `cercania.py` | Sesiones con edificio, distancias entre edificios y penalización por traslados (Nivel 6). |
| `huecos.py` | Horas de hueco por día a partir de la máscara (Nivel 7). |
| `pesos.py` | Pesos de cada criterio según el ranking de preferencias (Nivel 8). |
| `pd_estudiante.py` | `mejor_horario`: PD exacta `f(i, firma)` por estudiante. |
| `asignacion.py` | `asignar_horarios`: orden sorteado con semilla, dos rondas (prioritarias / no prioritarias) y fase de mejora. |
| `traza.py` | Ejemplo que imprime cada paso de la PD y de las rondas. |
| `generador.py` | Instancias sintéticas con semilla, para tests y experimentos. |

```python
from algoritmo import Clase, Curso, Estudiante, Horario, PreferenciaClase, PreferenciasDeEstudiante, asignar_horarios

calculo = Clase(1, "CAL", "Cálculo", [
    Curso(1, "CAL-1", cupo=30, horarios=[Horario.crear("lunes", "07:00", "09:00")]),
])
ana = Estudiante(1, nombre="Ana", preferencias=PreferenciasDeEstudiante(
    [PreferenciaClase(calculo, prioridad=True)],
    franjas_habilitadas=[Horario.crear("lunes", "07:00", "12:00")],
))

resultado = asignar_horarios([ana], semilla=2026)
resultado.horarios        # {id_estudiante: [Curso, ...]}
resultado.no_asignadas    # {id_estudiante: [PreferenciaClase, ...]}
resultado.puntajes        # {id_estudiante: (prioritarias, no_prioritarias, satisfaccion)}
resultado.cupos_restantes # {id_curso: cupos}
```

## Tests

Desde `algoritmo/`:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate   |   macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
pytest
```

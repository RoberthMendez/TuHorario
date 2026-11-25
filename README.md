# TuHorario

Aplicación web full-stack para asignar horarios estudiantiles según las
preferencias de cada estudiante (Pontificia Universidad Javeriana). Proyecto
académico de Análisis de Algoritmos.

> Estado actual: el front (Landing y Preferencias) habla con el backend, que
> guarda todo en PostgreSQL y corre el algoritmo (Niveles 1 a 8) al pulsar
> "Finalizar". Falta la pantalla de resultados: por ahora los horarios
> generados se ven en la consola del navegador.

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
│   └── src/{assets,components,pages,types,data,services,styles}/
├── backend/             # FastAPI, en capas
│   ├── app/
│   │   ├── api/           # controladores (routers): validan y delegan
│   │   ├── services/      # lógica de negocio (reglas de los TADs, algoritmo)
│   │   ├── repositories/  # todas las consultas a la base (SQLAlchemy)
│   │   ├── models/        # modelos ORM (tablas)
│   │   ├── schemas/       # schemas de Pydantic (camelCase hacia el front)
│   │   ├── db/            # engine, sesiones, get_db y datos semilla
│   │   ├── core/          # configuración, errores de dominio, días y horas
│   │   └── main.py
│   └── tests/           # pytest sobre SQLite en memoria
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

El backend necesita PostgreSQL levantado (paso 1). Al arrancar crea las
tablas que falten (`Base.metadata.create_all`, sin Alembic) y, **solo si la
base está vacía**, carga los datos semilla (`app/db/semilla.py`):

- las 20 clases y los 28 profesores que antes eran mocks del front (mismos ids);
- tipos de documento;
- 4 edificios con coordenadas y 3 salones cada uno;
- uno o dos cursos por cada par profesor–clase (cupo de 25 a 40), con sesiones
  en horas en punto de lunes a sábado entre 7:00 y 21:00, sin que un salón se
  ocupe dos veces a la misma hora. Se generan con una semilla fija, así que
  siempre salen iguales.

No se siembran estudiantes: se crean desde el front. Para empezar de cero,
borra el volumen: `docker compose down -v`.

Los tests (`pytest`) no usan PostgreSQL: corren sobre SQLite en memoria.

Documentación interactiva de la API: http://localhost:8000/docs

#### Endpoints

| Método y ruta | Qué hace |
|---|---|
| `GET /clases` | `[{id, codigo, nombre}]` |
| `GET /profesores?clases=1,7,11` | `[{id, nombre, genero, idsClases}]`, solo los que dictan alguna de esas clases (todos si no se pasa `clases`) |
| `GET /estudiantes?buscar=seb&limite=5&excluir=3` | `[{id, nombre, correo}]`: busca por nombre o correo sin importar tildes ni mayúsculas |
| `POST /estudiantes {nombre}` | 201 con el estudiante completo. Genera código `2026` + consecutivo, cédula consecutiva desde 1000000001, correo `inicial + primer apellido + 2 últimas cifras de la cédula @javeriana.edu.co` y celular `310 …`. Los consecutivos no se reutilizan |
| `DELETE /estudiantes/{id}` | 204. Borra en cascada sus preferencias, inscripciones y las referencias de otros a él |
| `GET` / `PUT /estudiantes/{id}/preferencias` | Lee o reemplaza todas sus preferencias (ver abajo) |
| `POST /horarios/generar {idsEstudiantes}` | Corre el algoritmo para esos estudiantes, guarda las inscripciones y devuelve sus horarios |
| `GET /horarios?estudiantes=1,2,3` | Los mismos horarios, leídos de la base |

Cuerpo de `PUT /estudiantes/{id}/preferencias`. Los días van con tilde, como
en el front, y las horas en punto entre `07:00` y `21:00`:

```json
{
  "clases": [{ "idClase": 1, "prioridad": true }],
  "franjasHabilitadas": [{ "dia": "miércoles", "horaInicio": "07:00", "horaFin": "10:00" }],
  "profesores": [{ "idProfesor": 2, "preferencia": 3 }],
  "companeros": [{ "idEstudiante": 5, "idClase": 1 }],
  "restringidos": [7],
  "preferenciaCercania": false,
  "preferenciaSinHuecos": true,
  "prioridades": [{ "tipoPreferencia": "clases", "prioridad": 1 }]
}
```

`tipoPreferencia` ∈ `clases, profesores, estudiantes, horarios, cercania,
huecos`. Las reglas de negocio que no se cumplen responden 400 con un
`detail`; un recurso inexistente responde 404.

- Un profesor calificado debe dictar alguna clase pedida.
- Los compañeros solo se piden en clases elegidas.
- Nadie es compañero y restringido a la vez.
- El ranking va de 1 a n y solo incluye preferencias elegidas.

Respuesta de horarios, por estudiante:
`{idEstudiante, nombre, cursos: [{id, codigo, clase, profesor, sesiones:
[{dia, horaInicio, horaFin, salon: {codigo, edificio}}]}], clasesNoAsignadas:
[{clase, prioridad}], preferenciasNoCumplidas: [{tipo, detalle, idClase}]}`.

`preferenciasNoCumplidas` lista todas las preferencias que el horario no
cumple (`app/services/cumplimiento_service.py`), con un `detalle` listo para
mostrar e `idClase` cuando se refiere a una clase (`null` en cercanía y
huecos). Se calcula desde la base, así que `GET /horarios` también la trae:

| `tipo` | Se reporta cuando… |
|---|---|
| `clases` | una clase pedida no quedó inscrita |
| `horarios` | una sesión cae (toda o en parte) fuera de las franjas habilitadas; sin franjas no se reporta |
| `profesores` | le tocó un profesor vetado (0) o uno con menor calificación que el mejor calificado (1–3) de los que dictan esa clase |
| `estudiantes` | no quedó en el mismo curso que un compañero pedido, o quedó en el mismo curso que alguien restringido |
| `cercania` | con cercanía activada: dos clases seguidas (sin hora libre) en edificios distintos |
| `huecos` | con "sin huecos" activado: horas libres entre la primera y la última clase de un día (una entrada por día) |

Al generar, el cupo disponible de cada curso es `cupo − inscritos que no
están en esta corrida`, y las inscripciones anteriores de los estudiantes de
la corrida se reemplazan.

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # opcional: URL del backend (VITE_API_URL)
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint
npm run format
```

### Todo junto

Con Docker Desktop abierto, en tres terminales:

```bash
docker compose up -d                                   # 1. PostgreSQL
cd backend && uvicorn app.main:app --reload            # 2. API (con .venv activado)
cd frontend && npm run dev                             # 3. Front
```

En http://localhost:5173 crea los estudiantes, llena sus preferencias y pulsa
"Finalizar". Los horarios generados aparecen en la consola del navegador
(`Horarios generados: …`).

### 4. Algoritmo

```bash
cd algoritmo
python -m venv .venv
# Windows: .venv\Scripts\activate   |   macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
pytest
```

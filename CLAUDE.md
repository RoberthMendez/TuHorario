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

- `frontend/src/` — `assets/`, `components/`, `pages/`, `types/`, `data/` (mocks), `services/` (acceso a la API), `styles/`.
- `backend/app/` — en capas:
  - `api/`: routers. Solo validan con los schemas, llaman al servicio y responden.
  - `services/`: la lógica de negocio.
  - `repositories/`: todas las consultas con SQLAlchemy 2.x; los servicios no escriben SQL.
  - `models/` (ORM) y `schemas/` (Pydantic, camelCase con `alias_generator=to_camel`).
  - `db/`: engine, `SessionLocal`, `Base`, `get_db` y `semilla.py`.
  - `core/`: `config.py`, `errores.py` (`NoEncontrado` → 404, `ReglaNegocio` → 400, `Conflicto` → 409) y `dias.py`.
  - `main.py`.
- `backend/tests/` — tests con pytest sobre SQLite en memoria (`conftest.py` sobreescribe `get_db`).
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
cd backend && uvicorn app.main:app --reload   # http://localhost:8000/docs (requiere Postgres)
cd backend && pytest

# Algoritmo (con su .venv activado)
cd algoritmo && pytest
```

## Reglas de trabajo

- El front habla con el backend real. Los datos del backend se piden siempre
  a través de un servicio en `frontend/src/services/` (`<recurso>Service.ts`,
  p. ej. `clasesService.obtenerClases()`), que usa `obtenerJson`, `enviarJson`
  o `eliminar` de `services/api.ts` (URL base en `VITE_API_URL`, ver
  `frontend/.env.example`). Nunca se llama a `fetch` desde un componente. En
  `frontend/src/data/` solo quedan datos fijos de la vista (semana, niveles,
  horario de ejemplo de la Landing).
- Endpoints, cuerpo de las preferencias y datos semilla: ver `README.md`.
- Base de datos: las tablas se crean con `Base.metadata.create_all` en el
  `lifespan` y el catálogo (clases, profesores, edificios, salones, cursos) se
  siembra solo si la base está vacía (`app/db/semilla.py`). Para cambiar el
  esquema en desarrollo, `docker compose down -v` y volver a arrancar.
- Usar tipos portables en los modelos (nada exclusivo de PostgreSQL): los
  tests corren sobre SQLite.
- Días y horas: en la API y el front los días llevan tilde (`miércoles`,
  `sábado`); en la base y en `algoritmo` no. Las horas se guardan en minutos
  y en la API van como `"HH:MM"`. Toda conversión pasa por `app/core/dias.py`.
- El algoritmo se usa como librería desde `services/horarios_service.py`, con
  una sola instancia por id de cada entidad y semilla fija. Ojo:
  `asignar_horarios` falla (`KeyError`) si un compañero o restringido no está
  en la lista de estudiantes que recibe; el servicio los filtra antes.
- El backend y el algoritmo se desarrollan por separado: `algoritmo/` no
  importa nada del backend.
- Las preferencias de cada estudiante viven en `PanelPreferencias` (las
  secciones reciben su valor y su setter) y suben por
  `CartaEstudiante` → `Preferencias.tsx`, que las envía al pulsar "Finalizar"
  (`preferenciasService`, que traduce las etiquetas del ranking a los tipos
  del backend, y `horariosService`).
- Usar Tailwind CSS para estilos.
- En el frontend, mantener la configuración por defecto de la plantilla de Vite (oxlint, versiones de TypeScript, tsconfig); no reemplazarla por otras herramientas.
- Seguir los TADs de `docs/` para nombrar tipos y entidades.
- Priorizar soluciones simples: el proyecto no va a escalar.
- No usar Alembic ni herramientas de migraciones.

## Organización de componentes (frontend)

- Todo elemento visual distinguible del diseño es un componente de React, sea
  reutilizable o no. Un componente por archivo `.tsx`, nombres en PascalCase.
  Las páginas solo ensamblan componentes; no concentran todo el JSX.
- Las carpetas se nombran con la primera letra en minúscula (camelCase:
  `landing`, `ilustracionHorario`); los archivos de componentes en PascalCase.
- Cada página tiene su propia carpeta `src/pages/<pagina>/` con `<Pagina>.tsx`
  en la raíz y todos los componentes que solo usa esa página.
- Cuando un elemento visual tiene más de un archivo, todos van juntos en una
  subcarpeta con el nombre del elemento: p. ej. `pages/landing/ilustracionHorario/`
  contiene `IlustracionHorario`, `EncabezadoDias`, `ColumnaHoras` y
  `BloqueClase`, y `pages/landing/titulo/` contiene `Titulo` y
  `ResaltadoTitulo`. Si el elemento es un solo archivo, va directamente en la
  carpeta padre, sin subcarpeta (p. ej. `pages/landing/Descripcion.tsx`).
- Los componentes reutilizables en varias pantallas (logo, botón, fondo de
  cuadrícula) van en `src/components/`, con la misma regla de subcarpetas.
  Nada específico de una página va ahí.
- La misma regla aplica a `src/assets/`: los SVG/imágenes que forman un mismo
  elemento visual van en una subcarpeta (p. ej. `assets/logo/` con las piezas
  del logo); un asset único de su elemento queda en `assets/`.
- Ante la duda, el componente va en la carpeta de la página.
- Antes de crear un componente, revisar `src/components/` y reutilizar el que
  ya exista si coincide con el diseño.
- Colores, tipografías y sombras del diseño se definen como variables del tema
  de Tailwind en `src/styles/tema.css`, no como valores sueltos.
- Las ventanas emergentes para elegir varios elementos (añadir clases,
  profesores…) se construyen sobre `ModalSeleccion` de
  `pages/preferencias/panelPreferencias/modalSeleccion/`: cada una solo define
  sus textos, el servicio que consulta, en qué textos se busca y cómo se ven
  su fila y su chip.
- Las preferencias dependen de las clases elegidas: el estado de las clases
  vive en `PanelPreferencias` y se pasa a las secciones que lo necesitan; el
  color de un elemento ligado a una clase es el de esa clase (`colorDeClase`).
- Todo botón con el estilo 3D (sombra sólida debajo) usa la utilidad
  `boton-3d` de `tema.css`: se levanta al pasar el mouse y se hunde al
  presionarlo. Solo se mueve el botón completo, no su contenido.

## Tamaño y responsive (todas las páginas)

- Referencia: con el navegador al 100 % de zoom en un portátil, las pantallas
  de una sola vista (como la Landing) se ven completas, sin scroll y sin
  desbordes. Las pantallas largas (listas, formularios, como Preferencias)
  usan scroll vertical normal, nunca horizontal. Con otros zooms (67 %, 75 %,
  110 %…) o tamaños de ventana debe seguir viéndose igual de bien: nada se sale
  del contenedor, no aparecen franjas vacías ni se desfasan las ilustraciones.
- También debe ser responsive para móvil y tablet.
- Cómo se logra (ver `src/styles/tema.css`):
  - `--u` es "1 px del diseño de Figma" (frames de 1440 px). Espaciado,
    tipografía, radios y sombras del tema están en `--u` (`@theme inline`),
    así que cambiar `--u` en un contenedor escala todo su contenido.
  - Usar siempre utilidades de la escala de Tailwind (`w-25`, `top-91.5`) o
    tokens del tema. Si hace falta un valor arbitrario, escribirlo en `--u`
    (`calc(var(--u)*8.5)`) o en `%`, nunca en `px`/`rem` fijos. Excepción: bordes
    y líneas de 1–2 px.
  - Variant `escritorio:` = ancho ≥ 1024 px y orientación horizontal. En
    pantallas de una sola vista la raíz fija
    `--u: min(100vw/1440, 100dvh/<alto del diseño>, 1.5px)` y usa `h-dvh` para
    que el lienzo quepa completo en la ventana. En pantallas largas la raíz fija
    `--u: clamp(0.78px, 100vw*0.8/1440, 1px)` (solo depende del ancho; el 0.8
    da una vista "alejada", como un zoom del navegador al 80 %, para ver más
    contenido a la vez) y la columna de contenido es fluida (`w-full max-w-…`).
    En móvil/tablet esas pantallas usan `--u: 0.9px`.
  - Sin `escritorio:` (móvil/tablet vertical) el layout se apila con scroll
    normal; los elementos anchos (títulos grandes, ilustraciones) ajustan su
    propio `--u` al ancho (`min(1px, (100vw - 3rem)/<ancho>)`) y vuelven a
    heredar en escritorio con `escritorio:[--u:inherit]`.
- Verificar cada pantalla en escritorio (p. ej. 1280×600, 1536×730, 1920×960)
  y en móvil/tablet (360, 390 y 768 px de ancho).

## Animaciones (todas las páginas)

- Estilo "escolar" y divertido, pero fluido y sin exagerar: entradas con un
  pequeño rebote al cargar la pantalla (escalonadas), despliegues suaves,
  giros con rebote en flechas e íconos, y pequeños "levantes" o giros al pasar
  el mouse por fichas y tarjetas.
- Usar los tokens de `src/styles/tema.css` (`animate-entrar`, `animate-pop`,
  `animate-flotar`, `animate-parpadeo`, `animate-titilar`, `boton-3d`) y la
  curva con rebote `cubic-bezier(0.34,1.56,0.64,1)` en las transiciones.
- Respetar `prefers-reduced-motion` (`motion-reduce:…`) en las animaciones
  continuas o grandes.

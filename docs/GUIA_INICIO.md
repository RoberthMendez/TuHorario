c

# Guía de inicio: clonar TuHorario y empezar a trabajar

Esta guía te lleva desde cero hasta tener el proyecto corriendo en tu
computador y hacer tu primer aporte. Los comandos están pensados para
**PowerShell en Windows**. Si usas macOS o Linux, cuando haya diferencias se
indica al lado.

---

## 1. Lo que necesitas instalado

| Herramienta                                                       | Versión                   | Para qué                                  | Cómo comprobarla   |
| ----------------------------------------------------------------- | ------------------------- | ----------------------------------------- | ------------------ |
| [Git](https://git-scm.com/downloads)                              | cualquiera reciente       | clonar y versionar                        | `git --version`    |
| [Node.js](https://nodejs.org/)                                    | **22 LTS** (mínimo 20.19) | frontend                                  | `node -v`          |
| [Python](https://www.python.org/downloads/)                       | **3.13** (mínimo 3.12)    | backend y algoritmo                       | `python --version` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | cualquiera reciente       | base de datos (**todavía no hace falta**) | `docker --version` |

> Al instalar Python en Windows, marca la casilla **"Add python.exe to PATH"**.

Además:

- Pide al dueño del repo que te agregue como **colaborador** en GitHub
  (Settings → Collaborators). Acepta la invitación que te llega al correo.
- Si es la primera vez que usas Git en tu computador, configura tu nombre y
  correo (son los que aparecerán en tus commits):

  ```powershell
  git config --global user.name "Tu Nombre"
  git config --global user.email "tu-correo@ejemplo.com"
  ```

---

## 2. Clonar el repositorio

Ubícate en la carpeta donde quieras guardar el proyecto y ejecuta:

```powershell
git clone https://github.com/RoberthMendez/TuHorario.git
cd TuHorario
```

Recomendado: abre la carpeta en VS Code con `code .`

---

## 3. Crear tu archivo `.env`

El proyecto lee su configuración de un archivo `.env` que **no se sube a
GitHub** (cada uno tiene el suyo). Créalo a partir de la plantilla:

```powershell
Copy-Item .env.example .env        # macOS/Linux: cp .env.example .env
```

Los valores de ejemplo funcionan tal cual para desarrollo, no tienes que
cambiar nada.

---

## 4. Instalar las dependencias

Haz los tres bloques desde la raíz de `TuHorario`.

### Frontend

```powershell
cd frontend
npm ci
cd ..
```

> Usa `npm ci` y no `npm install`: instala exactamente las versiones del
> `package-lock.json` sin modificarlo, y así evitamos conflictos.

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
```

### Algoritmo

```powershell
cd algoritmo
python -m venv .venv
.venv\Scripts\Activate.ps1          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
```

> Si PowerShell dice que **la ejecución de scripts está deshabilitada** al
> activar el entorno, ejecuta una sola vez
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` y vuelve a intentarlo.

---

## 5. Comprobar que todo funciona

Si los cuatro puntos salen bien, ya estás listo.

**Frontend:**

```powershell
cd frontend
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173): debe aparecer **"TuHorario"** en azul. Detén
el servidor con `Ctrl + C`.

**Backend** (en otra terminal):

```powershell
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Abre [http://localhost:8000/health](http://localhost:8000/health): debe mostrar `{"status":"ok"}`. En
[http://localhost:8000/docs](http://localhost:8000/docs) está la documentación automática de la API.
Detén el servidor con `Ctrl + C`.

**Tests del backend** (con el entorno activado, dentro de `backend/`):

```powershell
pytest
```

**Tests del algoritmo:**

```powershell
cd algoritmo
.venv\Scripts\Activate.ps1
pytest
```

Ambos deben terminar con `1 passed`.

---

## 6. Cómo trabajamos en paralelo

**Nunca trabajes directamente en `main`.** Cada tarea va en su propia rama y
entra a `main` mediante un Pull Request (PR).

### Ciclo de cada tarea

1. **Actualiza `main`** antes de empezar:

   ```powershell
   git checkout main
   git pull
   ```

2. **Crea tu rama** con un nombre que describa la tarea:

   ```powershell
   git checkout -b feature/pantalla-preferencias
   ```

   Prefijos: `feature/` para algo nuevo, `fix/` para corregir algo y
   `docs/` para documentación.

3. **Trabaja y haz commits pequeños** con mensajes claros:

   ```powershell
   git add .
   git commit -m "feat: agrega formulario de preferencias de horario"
   ```

4. **Antes de subir**, revisa que el frontend no tenga errores:

   ```powershell
   cd frontend
   npm run lint
   npm run format
   npm run build
   ```

5. **Sube tu rama:**

   ```powershell
   git push -u origin feature/pantalla-preferencias
   ```

6. **Abre el Pull Request** en GitHub. Aparece un botón _"Compare & pull
   request"_. Describe qué hiciste y pide a un compañero que lo revise.
   Cuando esté aprobado, se hace _merge_ a `main`.
7. Después del merge, vuelve al paso 1 para la siguiente tarea.

### Si `main` cambió mientras trabajabas

```powershell
git checkout main
git pull
git checkout feature/mi-rama
git merge main
```

Si hay conflictos, VS Code los marca en los archivos afectados: elige qué
versión conservar, guarda y luego haz `git add .` y `git commit`.

### Después de cada `git pull`

Si alguien agregó dependencias, vuelve a instalar:

- Si cambió `frontend/package-lock.json`: `npm ci` en `frontend/`.
- Si cambió `requirements.txt`: `pip install -r requirements.txt` con el
  entorno activado.

---

## 7. Reglas del proyecto

- **Por ahora solo trabajamos el frontend, con datos mock hardcodeados.** Los
  datos de prueba van en `frontend/src/data/` y los tipos en
  `frontend/src/types/`.
- El backend y el algoritmo se desarrollan por separado. El algoritmo
  (`algoritmo/`) **no** puede importar nada del backend ni de FastAPI.
- Los estilos se hacen con **Tailwind CSS** (clases en el `className`).
- Los nombres de tipos y entidades siguen los **TADs del documento de la
  primera entrega** (`docs/`).
- Prioriza siempre la solución más simple: el proyecto no va a escalar.
- No cambies la configuración por defecto de Vite (oxlint, TypeScript,
  `tsconfig`) sin acordarlo con el grupo.
- No subas tu `.env` ni modifiques el PDF de `docs/`.

### Dónde va cada cosa en el frontend

```
frontend/src/
├── pages/        # una pantalla completa por archivo
├── components/   # piezas reutilizables (botones, tarjetas, tablas…)
├── types/        # tipos de TypeScript (según los TADs)
├── data/         # datos mock
├── assets/       # imágenes, íconos
└── styles/       # estilos globales, solo si hacen falta
```

### Para agregar dependencias

- **Frontend:** `npm install nombre-paquete` en `frontend/`, y sube el
  `package.json` y el `package-lock.json` en el mismo commit.
- **Backend o algoritmo:** con el entorno activado,
  `pip install nombre-paquete` y luego `pip freeze > requirements.txt`. Sube
  el `requirements.txt` actualizado.

Avísale al grupo cuando agregues una dependencia.

---

## 8. Problemas comunes

| Problema                                           | Solución                                                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `uvicorn` o `pytest` "no se reconoce como comando" | No activaste el entorno: `.venv\Scripts\Activate.ps1` dentro de `backend/` o `algoritmo/`. |
| "La ejecución de scripts está deshabilitada"       | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (una sola vez).                      |
| `Port 5173 is already in use`                      | Ya tienes otro `npm run dev` abierto. Ciérralo con `Ctrl + C`.                             |
| `python` abre la Microsoft Store                   | Python no está en el PATH: reinstálalo marcando "Add python.exe to PATH".                  |
| El frontend falla tras un `git pull`               | Ejecuta `npm ci` en `frontend/`: probablemente hay dependencias nuevas.                    |
| `docker compose up -d` falla                       | Abre Docker Desktop primero y espera a que diga que está corriendo.                        |

---

## 9. Resumen de comandos

| Qué                    | Dónde                         | Comando                         |
| ---------------------- | ----------------------------- | ------------------------------- |
| Levantar frontend      | `frontend/`                   | `npm run dev`                   |
| Compilar frontend      | `frontend/`                   | `npm run build`                 |
| Revisar código         | `frontend/`                   | `npm run lint`                  |
| Formatear código       | `frontend/`                   | `npm run format`                |
| Levantar backend       | `backend/` (entorno activo)   | `uvicorn app.main:app --reload` |
| Tests backend          | `backend/` (entorno activo)   | `pytest`                        |
| Tests algoritmo        | `algoritmo/` (entorno activo) | `pytest`                        |
| Levantar base de datos | raíz                          | `docker compose up -d`          |
| Detener base de datos  | raíz                          | `docker compose down`           |

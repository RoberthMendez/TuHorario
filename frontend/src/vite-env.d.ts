/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base del backend (FastAPI). Ver `frontend/.env.example`. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

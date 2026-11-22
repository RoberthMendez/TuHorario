"""Configuración de la aplicación leída desde variables de entorno."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# .env en la raíz del monorepo (backend/app/core/config.py -> raíz)
ROOT_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ROOT_ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = "postgresql+psycopg://tuhorario:tuhorario@localhost:5432/tuhorario"
    # Orígenes permitidos separados por comas.
    CORS_ORIGINS: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()

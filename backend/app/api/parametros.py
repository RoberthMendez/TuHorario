"""Validación de parámetros de consulta comunes a varios routers."""

from fastapi import HTTPException, status


def lista_ids(texto: str | None, nombre: str) -> list[int] | None:
    """``"1,7,11"`` → ``[1, 7, 11]``; ``None`` si no se envió; ``[]`` si viene vacío."""
    if texto is None:
        return None
    try:
        return [int(parte) for parte in texto.split(",") if parte.strip()]
    except ValueError:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_CONTENT,
            f"'{nombre}' debe ser una lista de ids separados por comas (p. ej. 1,7,11)",
        ) from None

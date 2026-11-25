"""Excepciones de dominio. ``main.py`` las convierte en respuestas HTTP."""


class ErrorDominio(Exception):
    estado = 400

    def __init__(self, mensaje: str) -> None:
        super().__init__(mensaje)
        self.mensaje = mensaje


class NoEncontrado(ErrorDominio):
    """El recurso pedido no existe → 404."""

    estado = 404


class ReglaNegocio(ErrorDominio):
    """Los datos no cumplen una regla de los TADs → 400."""

    estado = 400


class Conflicto(ErrorDominio):
    """Choca con datos que ya existen → 409."""

    estado = 409

import app  # noqa: F401  (añade la raíz del repo al path)


def test_algoritmo_importable_desde_backend() -> None:
    import algoritmo

    assert algoritmo is not None

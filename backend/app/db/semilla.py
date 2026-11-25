"""Datos semilla: el catálogo con el que arranca una base vacía.

Mismas clases y profesores que tenían los mocks del front (mismos ids,
códigos, nombres, género y clases que dicta cada profesor), más tipos de
documento, edificios con coordenadas, salones y cursos con sus sesiones. No
se siembran estudiantes: los crea el usuario desde el front.

Los cursos se generan con una semilla fija (siempre salen iguales): uno o dos
por cada par profesor–clase, con sesiones en horas en punto entre lunes y
sábado, de 7:00 a 21:00, sin que dos sesiones ocupen el mismo salón a la vez.
"""

import random
import unicodedata

from sqlalchemy.orm import Session

from app.core.dias import DIAS
from app.models import Clase, Curso, Edificio, Profesor, Salon, SalonHorario, TipoDocumento
from app.repositories import catalogo_repo

TIPOS_DOCUMENTO = [(1, "Cédula"), (2, "Tarjeta de identidad"), (3, "Cédula de extranjería")]

CLASES = [
    (1, "MAT-101", "Cálculo Diferencial"),
    (2, "MAT-102", "Cálculo Integral"),
    (3, "MAT-201", "Cálculo Vectorial"),
    (4, "MAT-110", "Álgebra Lineal"),
    (5, "MAT-210", "Ecuaciones Diferenciales"),
    (6, "MAT-220", "Estadística"),
    (7, "FIS-101", "Física Mecánica"),
    (8, "FIS-102", "Física Electricidad y Magnetismo"),
    (9, "QUI-101", "Química General"),
    (10, "SIS-101", "Introducción a la Programación"),
    (11, "SIS-201", "Programación Avanzada"),
    (12, "SIS-202", "Estructuras de Datos"),
    (13, "SIS-301", "Análisis de Algoritmos"),
    (14, "SIS-302", "Bases de Datos"),
    (15, "SIS-401", "Ingeniería de Software"),
    (16, "IDI-210", "Inglés Técnico"),
    (17, "HUM-301", "Ética Profesional"),
    (18, "SIS-499", "Proyecto de Grado"),
    (19, "ADM-499", "Proyecto de Grado"),
    (20, "ARQ-499", "Proyecto de Grado"),
]

# (id, nombre, género, ids de las clases que dicta)
PROFESORES = [
    (1, "Natalia Pardo", "femenino", [1, 2]),
    (2, "Sergio Quintero", "masculino", [1]),
    (3, "Carlos Mejía", "masculino", [2, 3]),
    (4, "Laura Restrepo", "femenino", [3]),
    (5, "Andrés Rojas", "masculino", [4]),
    (6, "Marcela Hurtado", "femenino", [4, 5]),
    (7, "Julián Gómez", "masculino", [5]),
    (8, "Diana Castro", "femenino", [6]),
    (9, "Rodrigo Cañas", "masculino", [7]),
    (10, "Paola Vargas", "femenino", [7, 8]),
    (11, "Rodrigo Hurtado", "masculino", [8]),
    (12, "Camila Ortiz", "femenino", [9]),
    (13, "Felipe Salcedo", "masculino", [9]),
    (14, "Rodrigo Rueda", "masculino", [10, 11]),
    (15, "Valentina Ríos", "femenino", [10]),
    (16, "Mauricio Vargas", "masculino", [11, 12]),
    (17, "Juliana Martínez", "femenino", [12, 13]),
    (18, "Óscar Bernal", "masculino", [13]),
    (19, "Catalina Duarte", "femenino", [14]),
    (20, "Hernán Moreno", "masculino", [14, 15]),
    (21, "Lucía Fernández", "femenino", [15]),
    (22, "Daniel Herrera", "masculino", [16]),
    (23, "Sofía Navarro", "femenino", [16]),
    (24, "Germán Pineda", "masculino", [17]),
    (25, "Adriana Lozano", "femenino", [17]),
    (26, "Ricardo Silva", "masculino", [18]),
    (27, "Mónica Ramírez", "femenino", [19]),
    (28, "Esteban Ruiz", "masculino", [20]),
]

# (nombre, dirección, x, y en metros dentro del campus, prefijo de los salones)
EDIFICIOS = [
    ("Edificio José Gabriel Maldonado", "Cra. 7 # 40-62", 0.0, 0.0, "M"),
    ("Edificio Fernando Barón", "Cra. 7 # 40-62", 120.0, 80.0, "B"),
    ("Edificio Ciencias Básicas", "Cra. 7 # 43-82", 420.0, 260.0, "C"),
    ("Edificio Pablo VI", "Cra. 7 # 40-62", 200.0, 380.0, "P"),
]
SALONES_POR_EDIFICIO = 3

# Patrones de sesiones: (días, horas por sesión).
PATRONES = [
    (("lunes", "miercoles"), 2),
    (("martes", "jueves"), 2),
    (("miercoles", "viernes"), 2),
    (("lunes", "jueves"), 2),
    (("martes", "viernes"), 2),
    (("lunes", "miercoles", "viernes"), 1),
    (("viernes",), 3),
    (("sabado",), 3),
]
HORAS_INICIO = (7, 9, 11, 14, 16, 18)
CUPOS = (25, 30, 35, 40)
SEMILLA = 2026


def _correo_profesor(nombre: str) -> str:
    limpio = "".join(c for c in unicodedata.normalize("NFD", nombre) if unicodedata.category(c) != "Mn").lower()
    nombre_pila, apellido = limpio.split()[:2]
    return f"{nombre_pila[0]}{apellido}@javeriana.edu.co"


def sembrar(db: Session) -> bool:
    """Carga el catálogo si la base está vacía. Devuelve si sembró algo."""
    if catalogo_repo.hay_catalogo(db):
        return False

    rng = random.Random(SEMILLA)
    db.add_all(TipoDocumento(id=i, tipo=t) for i, t in TIPOS_DOCUMENTO)
    clases = {i: Clase(id=i, codigo=c, nombre=n) for i, c, n in CLASES}
    db.add_all(clases.values())

    salones: list[Salon] = []
    for nombre, direccion, x, y, prefijo in EDIFICIOS:
        edificio = Edificio(nombre=nombre, direccion=direccion, coordenada_x=x, coordenada_y=y)
        for n in range(1, SALONES_POR_EDIFICIO + 1):
            edificio.salones.append(Salon(codigo=f"{prefijo}-{100 * n + rng.randint(1, 9):03d}"))
        salones += edificio.salones
        db.add(edificio)

    profesores = {}
    for i, nombre, genero, _ in PROFESORES:
        profesores[i] = Profesor(
            id=i,
            nombre=nombre,
            genero=genero,
            tipo_documento_id=1,
            numero_documento=str(52_000_000 + i),
            correo=_correo_profesor(nombre),
            celular=f"320 {rng.randint(100, 999)} {rng.randint(1000, 9999)}",
        )
    db.add_all(profesores.values())
    db.flush()

    ocupado: set[tuple[int, str, int]] = set()  # (id salón, día, hora)
    consecutivo: dict[int, int] = {}
    for id_profesor, _, _, ids_clases in PROFESORES:
        for id_clase in ids_clases:
            for _ in range(rng.choice((1, 2))):
                consecutivo[id_clase] = consecutivo.get(id_clase, 0) + 1
                clase = clases[id_clase]
                curso = Curso(
                    codigo=f"{clase.codigo}-{consecutivo[id_clase]}",
                    cupo=rng.choice(CUPOS),
                    clase=clase,
                    profesor=profesores[id_profesor],
                )
                curso.salon_horarios = _sesiones(rng, salones, ocupado)
                db.add(curso)
    db.commit()
    return True


def _sesiones(rng: random.Random, salones: list[Salon], ocupado: set[tuple[int, str, int]]) -> list[SalonHorario]:
    """Elige un patrón, una hora y un salón libre para todas las sesiones del curso."""
    while True:
        dias, duracion = rng.choice(PATRONES)
        inicio = rng.choice(HORAS_INICIO)
        if inicio + duracion > 21:
            continue
        horas = [(d, h) for d in dias for h in range(inicio, inicio + duracion)]
        libres = [s for s in salones if all((s.id, d, h) not in ocupado for d, h in horas)]
        if not libres:
            continue
        salon = rng.choice(libres)
        ocupado.update((salon.id, d, h) for d, h in horas)
        return [
            SalonHorario(
                salon=salon,
                dia=d,
                dia_orden=DIAS.index(d),
                hora_inicio=inicio * 60,
                hora_fin=(inicio + duracion) * 60,
            )
            for d in dias
        ]

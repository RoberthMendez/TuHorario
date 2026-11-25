"""Ejemplo fijo para la sustentación: 10 estudiantes con sus preferencias.

Se crea con ``POST /ejemplo`` (botón "Cargar ejemplo" de Preferencias). Usa
los ids del catálogo semilla (``semilla.py``), que siempre sale igual, así
que al generar los horarios de estos 10 estudiantes (solos y en este orden)
el resultado es siempre el mismo. Entre todos usan todas las preferencias y
el resultado muestra cada caso (``tests/test_ejemplo.py`` lo comprueba):

- Camila Suárez: se le cumple todo.
- Isabella Cortés: vetó a 3 profesores y la única sección de Análisis que le
  queda choca con las dos de Estadística: se queda sin Estadística (no era
  prioritaria) y sin Santiago en esa clase.
- Santiago Álvarez: pidió a Isabella en Estadística, pero ella no quedó.
- Daniela Ospina y Samuel Guzmán: los dos ven Bases de Datos y se pidieron,
  pero Daniela prefiere a Lucía Fernández y Samuel la vetó: quedan en
  secciones distintas.
- Luciana Patiño restringió a Tomás Aguilar, pero los dos quieren a Germán
  Pineda en Ética (su única sección) y para ella pesan más los profesores.
- Valeria Cifuentes: solo quiere mañanas y eso pesa más que el profesor: le
  toca otro profesor en Programación Avanzada y una hora queda fuera.
- Nicolás Villamil: el profesor pesa más que sus franjas: Estructuras de Datos
  le queda fuera de ellas.
- Mateo Jiménez: por sus profesores favoritos pasa de Ciencias Básicas a
  Pablo VI sin descanso (la cercanía le pesa poco).
- Tomás Aguilar: por sus profesores favoritos le quedan huecos (le pesan
  menos que los profesores).

Los compañeros y restringidos se nombran por su nombre dentro del ejemplo.
Los días van con tilde (como en la API) y las horas son enteras (7 = 7:00).
"""

from dataclasses import dataclass

from app.schemas import TipoPreferencia


@dataclass(frozen=True)
class EstudianteEjemplo:
    nombre: str
    clases: tuple[tuple[int, bool], ...]  # (id clase, prioritaria)
    franjas: tuple[tuple[str, int, int], ...] = ()  # (día, hora inicio, hora fin)
    profesores: tuple[tuple[int, int], ...] = ()  # (id profesor, calificación 0–3)
    companeros: tuple[tuple[str, int], ...] = ()  # (nombre del compañero, id clase)
    restringidos: tuple[str, ...] = ()
    cercania: bool = False
    sin_huecos: bool = False
    ranking: tuple[TipoPreferencia, ...] = ("clases",)  # de la más a la menos importante


# Clases del catálogo semilla.
ESTADISTICA, FISICA_MECANICA = 6, 7
PROGRAMACION_AVANZADA, ESTRUCTURAS, ANALISIS, BASES_DE_DATOS = 11, 12, 13, 14
ING_SOFTWARE, INGLES, ETICA, PROYECTO_SIS = 15, 16, 17, 18

# Profesores del catálogo semilla.
DIANA_CASTRO, RODRIGO_HURTADO, RODRIGO_RUEDA = 8, 11, 14
JULIANA_MARTINEZ, OSCAR_BERNAL = 17, 18
CATALINA_DUARTE, HERNAN_MORENO, LUCIA_FERNANDEZ = 19, 20, 21
DANIEL_HERRERA, SOFIA_NAVARRO, GERMAN_PINEDA = 22, 23, 24
ALEJANDRO_TORRES, FERNANDO_CARDENAS = 30, 32

MANANAS = tuple((dia, 7, 13) for dia in ("lunes", "martes", "miércoles", "jueves", "viernes"))

ESTUDIANTES = (
    EstudianteEjemplo(
        nombre="Camila Suárez",
        clases=((ANALISIS, True), (ESTRUCTURAS, False)),
        franjas=tuple((dia, 7, 13) for dia in ("lunes", "martes", "miércoles", "jueves")),
        profesores=((JULIANA_MARTINEZ, 3), (OSCAR_BERNAL, 1)),
        companeros=(("Mateo Jiménez", ANALISIS),),
        cercania=True,
        sin_huecos=True,
        ranking=("clases", "profesores", "estudiantes", "horarios", "cercania", "huecos"),
    ),
    EstudianteEjemplo(
        nombre="Mateo Jiménez",
        clases=((ANALISIS, True), (FISICA_MECANICA, False)),
        profesores=((JULIANA_MARTINEZ, 3), (RODRIGO_HURTADO, 3)),
        companeros=(("Camila Suárez", ANALISIS),),
        cercania=True,
        ranking=("clases", "profesores", "estudiantes", "cercania"),
    ),
    EstudianteEjemplo(
        nombre="Isabella Cortés",
        clases=((ANALISIS, True), (ESTADISTICA, False)),
        profesores=((OSCAR_BERNAL, 0), (FERNANDO_CARDENAS, 0), (ALEJANDRO_TORRES, 0), (DIANA_CASTRO, 2)),
        companeros=(("Santiago Álvarez", ESTADISTICA),),
        ranking=("clases", "estudiantes", "profesores"),
    ),
    EstudianteEjemplo(
        nombre="Santiago Álvarez",
        clases=((ESTADISTICA, True), (INGLES, False), (ETICA, False)),
        franjas=MANANAS,
        companeros=(("Isabella Cortés", ESTADISTICA),),
        sin_huecos=True,
        ranking=("clases", "estudiantes", "horarios", "huecos"),
    ),
    EstudianteEjemplo(
        nombre="Daniela Ospina",
        clases=((BASES_DE_DATOS, True), (ING_SOFTWARE, False)),
        profesores=((LUCIA_FERNANDEZ, 3), (CATALINA_DUARTE, 1)),
        companeros=(("Samuel Guzmán", BASES_DE_DATOS),),
        ranking=("clases", "profesores", "estudiantes"),
    ),
    EstudianteEjemplo(
        nombre="Samuel Guzmán",
        clases=((BASES_DE_DATOS, True), (PROYECTO_SIS, False)),
        profesores=((LUCIA_FERNANDEZ, 0), (HERNAN_MORENO, 2)),
        companeros=(("Daniela Ospina", BASES_DE_DATOS),),
        cercania=True,
        ranking=("clases", "estudiantes", "profesores", "cercania"),
    ),
    EstudianteEjemplo(
        nombre="Luciana Patiño",
        clases=((ETICA, True), (INGLES, False)),
        profesores=((GERMAN_PINEDA, 3), (SOFIA_NAVARRO, 2)),
        restringidos=("Tomás Aguilar",),
        ranking=("clases", "profesores", "estudiantes"),
    ),
    EstudianteEjemplo(
        nombre="Tomás Aguilar",
        clases=((ETICA, True), (ANALISIS, True), (PROYECTO_SIS, False)),
        profesores=((GERMAN_PINEDA, 3), (JULIANA_MARTINEZ, 3), (RODRIGO_RUEDA, 3)),
        sin_huecos=True,
        ranking=("clases", "profesores", "huecos"),
    ),
    EstudianteEjemplo(
        nombre="Valeria Cifuentes",
        clases=((PROGRAMACION_AVANZADA, True), (INGLES, False)),
        franjas=MANANAS,
        profesores=((RODRIGO_RUEDA, 3), (DANIEL_HERRERA, 2)),
        ranking=("horarios", "profesores", "clases"),
    ),
    EstudianteEjemplo(
        nombre="Nicolás Villamil",
        clases=((ESTRUCTURAS, True), (ING_SOFTWARE, False)),
        franjas=MANANAS,
        profesores=((OSCAR_BERNAL, 3), (HERNAN_MORENO, 2)),
        cercania=True,
        ranking=("profesores", "horarios", "cercania", "clases"),
    ),
)

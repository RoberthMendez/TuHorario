"""Ejemplos fijos para la sustentación.

Se listan con ``GET /ejemplos`` y se crean con ``POST /ejemplos/{clave}``
(botón "Cargar ejemplo" de Preferencias, que abre un modal para elegir cuál).
Usan los ids y códigos del catálogo semilla (``semilla.py``), que siempre sale
igual, así que al generar los horarios de un ejemplo (sus estudiantes solos y
en su orden) el resultado es siempre el mismo. ``tests/test_ejemplos.py`` lo
comprueba.

- ``completo``: 10 estudiantes que entre todos usan todas las preferencias.
- ``nivel-1`` … ``nivel-8``: uno por nivel del documento, con lo mínimo para
  ver lo que agrega ese nivel. Casi todos tienen un estudiante "de control"
  que pide lo mismo pero sin la preferencia del nivel.

Cupos llenos (``llenos``): en el catálogo todos los cursos tienen 25 cupos o
más, así que para ver un curso lleno el ejemplo crea "ocupantes": estudiantes
ya inscritos que no entran en la corrida y solo ocupan cupo (el algoritmo
descuenta a los inscritos de otras corridas). Un ocupante puede estar en
varios cursos a la vez. Se borran, con los estudiantes de todos los ejemplos,
al cargar cualquier ejemplo.

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
    # De la más a la menos importante. None = lo que arma el front al abrirlo:
    # clases y luego las elegidas, en el orden de sus secciones.
    ranking: tuple[TipoPreferencia, ...] | None = None

    def ranking_completo(self) -> tuple[TipoPreferencia, ...]:
        if self.ranking is not None:
            return self.ranking
        elegidas: list[tuple[TipoPreferencia, bool]] = [
            ("horarios", bool(self.franjas)),
            ("profesores", bool(self.profesores)),
            ("estudiantes", bool(self.companeros or self.restringidos)),
            ("cercania", self.cercania),
            ("huecos", self.sin_huecos),
        ]
        return ("clases", *(t for t, elegida in elegidas if elegida))


@dataclass(frozen=True)
class Ejemplo:
    clave: str
    titulo: str
    descripcion: str
    estudiantes: tuple[EstudianteEjemplo, ...]
    llenos: tuple[tuple[str, int], ...] = ()  # (código del curso, cupos que le quedan libres)


# Clases del catálogo semilla.
CALCULO_DIFERENCIAL, ALGEBRA_LINEAL, ESTADISTICA = 1, 4, 6
FISICA_MECANICA, FISICA_ELECTRICIDAD, QUIMICA = 7, 8, 9
PROGRAMACION_AVANZADA, ESTRUCTURAS, ANALISIS, BASES_DE_DATOS = 11, 12, 13, 14
ING_SOFTWARE, INGLES, ETICA, PROYECTO_SIS = 15, 16, 17, 18

# Profesores del catálogo semilla.
DIANA_CASTRO, RODRIGO_HURTADO, RODRIGO_RUEDA = 8, 11, 14
JULIANA_MARTINEZ, OSCAR_BERNAL = 17, 18
CATALINA_DUARTE, HERNAN_MORENO, LUCIA_FERNANDEZ = 19, 20, 21
DANIEL_HERRERA, SOFIA_NAVARRO, GERMAN_PINEDA = 22, 23, 24
BEATRIZ_SALAZAR, ALEJANDRO_TORRES, FERNANDO_CARDENAS = 29, 30, 32

LUNES_A_VIERNES = ("lunes", "martes", "miércoles", "jueves", "viernes")
MANANAS = tuple((dia, 7, 13) for dia in LUNES_A_VIERNES)


# ---------- Ejemplo completo ----------
#
# - Camila Suárez: se le cumple todo.
# - Isabella Cortés: vetó a 3 profesores y la única sección de Análisis que le
#   queda choca con las dos de Estadística: se queda sin Estadística (no era
#   prioritaria) y sin Santiago en esa clase.
# - Santiago Álvarez: pidió a Isabella en Estadística, pero ella no quedó.
# - Daniela Ospina y Samuel Guzmán: los dos ven Bases de Datos y se pidieron,
#   pero Daniela prefiere a Lucía Fernández y Samuel la vetó: quedan en
#   secciones distintas.
# - Luciana Patiño restringió a Tomás Aguilar, pero los dos quieren a Germán
#   Pineda en Ética (su única sección) y para ella pesan más los profesores.
# - Valeria Cifuentes: solo quiere mañanas y eso pesa más que el profesor: le
#   toca otro profesor en Programación Avanzada y una hora queda fuera.
# - Nicolás Villamil: el profesor pesa más que sus franjas: Estructuras de Datos
#   le queda fuera de ellas.
# - Mateo Jiménez: por sus profesores favoritos pasa de Ciencias Básicas a
#   Pablo VI sin descanso (la cercanía le pesa poco).
# - Tomás Aguilar: por sus profesores favoritos le quedan huecos (le pesan
#   menos que los profesores).

COMPLETO = Ejemplo(
    clave="completo",
    titulo="Ejemplo completo",
    descripcion=(
        "10 estudiantes que usan todas las preferencias: a unos se les cumple todo "
        "y a otros les queda pendiente algo de cada tipo."
    ),
    estudiantes=(
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
    ),
)


# ---------- Nivel 1: clases y cupos ----------
#
# Química General: QUI-101-1, -3 y -4 llenos; a QUI-101-2 (mar y vie 7–9) le
# queda 1 cupo y lo quieren Andrés y Paula. Carlos no compite por nada.

QUIMICA_CON_UN_CUPO = (("QUI-101-1", 0), ("QUI-101-3", 0), ("QUI-101-4", 0), ("QUI-101-2", 1))

NIVEL_1 = Ejemplo(
    clave="nivel-1",
    titulo="Nivel 1 · Clases y cupos",
    descripcion=(
        "Química General solo tiene 1 cupo libre (en QUI-101-2) y la piden Andrés y Paula: "
        "uno de los dos se queda sin ella. Nadie recibe un curso lleno ni dos clases que se crucen, "
        "y Carlos recibe todas las suyas."
    ),
    llenos=QUIMICA_CON_UN_CUPO,
    estudiantes=(
        EstudianteEjemplo("Andrés Pérez", clases=((QUIMICA, False), (ALGEBRA_LINEAL, False))),
        EstudianteEjemplo("Paula Gómez", clases=((QUIMICA, False), (FISICA_MECANICA, False))),
        EstudianteEjemplo(
            "Carlos Rincón",
            clases=((CALCULO_DIFERENCIAL, False), (FISICA_MECANICA, False), (ALGEBRA_LINEAL, False)),
        ),
    ),
)


# ---------- Nivel 2: prioridad de las clases ----------
#
# El mismo cupo de Química, ahora entre Daniel (prioritaria) y Elena (no
# prioritaria). Además, a Elena solo le quedan HUM-301-1 de Ética y
# IDI-210-4 de Inglés, los dos mar y vie 11–13.

NIVEL_2 = Ejemplo(
    clave="nivel-2",
    titulo="Nivel 2 · Prioridad de las clases",
    descripcion=(
        "Daniel necesita Química este semestre y Elena no: el único cupo es para Daniel, sin "
        "importar el orden. A Elena, Ética (prioritaria) e Inglés se le cruzan y gana Ética; "
        "Cálculo Diferencial, aunque no sea prioritaria, sí le queda."
    ),
    llenos=QUIMICA_CON_UN_CUPO
    + tuple((f"HUM-301-{i}", 0) for i in (2, 3, 4, 5))
    + tuple((f"IDI-210-{i}", 0) for i in (1, 2, 3, 5)),
    estudiantes=(
        EstudianteEjemplo(
            "Elena Vargas",
            clases=((INGLES, False), (QUIMICA, False), (ETICA, True), (CALCULO_DIFERENCIAL, False)),
        ),
        EstudianteEjemplo("Daniel Mora", clases=((QUIMICA, True),)),
    ),
)


# ---------- Nivel 3: franjas horarias ----------

NIVEL_3 = Ejemplo(
    clave="nivel-3",
    titulo="Nivel 3 · Franjas horarias",
    descripcion=(
        "Felipe solo quiere mañanas y Juliana nada después de las 6 p. m. Hugo solo marcó el lunes en "
        "la mañana: ningún curso le encaja del todo y recibe el que más se acerca; Física Electricidad "
        "no tiene nada el lunes y aun así se la asignan. Isabel y Jorge, sin franjas, son el control: "
        "reciben las mismas clases de noche."
    ),
    estudiantes=(
        EstudianteEjemplo("Felipe Ortiz", clases=((CALCULO_DIFERENCIAL, False),), franjas=MANANAS),
        EstudianteEjemplo(
            "Juliana Ríos",
            clases=((QUIMICA, False),),
            franjas=tuple((dia, 7, 18) for dia in (*LUNES_A_VIERNES, "sábado")),
        ),
        EstudianteEjemplo(
            "Hugo Salas",
            clases=((CALCULO_DIFERENCIAL, False), (FISICA_ELECTRICIDAD, False)),
            franjas=(("lunes", 7, 13),),
        ),
        EstudianteEjemplo("Isabel Castro", clases=((CALCULO_DIFERENCIAL, False),)),
        EstudianteEjemplo("Jorge Lara", clases=((QUIMICA, False),)),
    ),
)


# ---------- Nivel 4: profesores ----------
#
# Bases de Datos: Lucía Fernández dicta SIS-302-5 y SIS-302-6; se deja libre
# un solo cupo entre las dos.

VETA_ESTADISTICA = ((DIANA_CASTRO, 0), (BEATRIZ_SALAZAR, 0), (ALEJANDRO_TORRES, 0))

NIVEL_4 = Ejemplo(
    clave="nivel-4",
    titulo="Nivel 4 · Profesores",
    descripcion=(
        "Karen y Luis califican a Lucía Fernández con 3, a Hernán Moreno con 2 y vetan a Catalina "
        "Duarte, pero a Lucía le queda 1 cupo: uno la recibe y el otro baja a Hernán, nunca a Catalina. "
        "Karen vetó a todos los de Estadística y se queda sin ella. Mónica no califica a nadie."
    ),
    llenos=(("SIS-302-5", 1), ("SIS-302-6", 0)),
    estudiantes=(
        EstudianteEjemplo(
            "Karen Duque",
            clases=((BASES_DE_DATOS, False), (ESTADISTICA, False)),
            profesores=((LUCIA_FERNANDEZ, 3), (HERNAN_MORENO, 2), (CATALINA_DUARTE, 0), *VETA_ESTADISTICA),
        ),
        EstudianteEjemplo(
            "Luis Peña",
            clases=((BASES_DE_DATOS, False),),
            profesores=((LUCIA_FERNANDEZ, 3), (HERNAN_MORENO, 2), (CATALINA_DUARTE, 0)),
        ),
        EstudianteEjemplo("Mónica Ruiz", clases=((BASES_DE_DATOS, False),)),
    ),
)


# ---------- Nivel 5: compañeros ----------

NIVEL_5 = Ejemplo(
    clave="nivel-5",
    titulo="Nivel 5 · Compañeros",
    descripcion=(
        "Natalia pidió a Pablo solo en Análisis de Algoritmos: ahí quedan juntos, y en Inglés Técnico "
        "cada uno va por su lado. Olga no quiere coincidir con Natalia y queda en otra sección."
    ),
    estudiantes=(
        EstudianteEjemplo(
            "Natalia León",
            clases=((ANALISIS, False), (INGLES, False)),
            franjas=tuple((dia, 11, 12) for dia in ("lunes", "miércoles", "viernes")),
            companeros=(("Pablo Herrera", ANALISIS),),
            ranking=("clases", "estudiantes", "horarios"),
        ),
        EstudianteEjemplo(
            "Pablo Herrera",
            clases=((ANALISIS, False), (INGLES, False)),
            franjas=(("martes", 7, 13), ("jueves", 7, 13)),
        ),
        EstudianteEjemplo("Olga Rivas", clases=((ANALISIS, False),), restringidos=("Natalia León",)),
    ),
)


# ---------- Nivel 6: cercanía entre salones ----------
#
# Solo queda FIS-102-2 (vie 11–14, Maldonado) de Física Electricidad, y de
# Física Mecánica FIS-101-2 (Pablo VI) y FIS-101-3 (Maldonado), las dos mar y
# vie 14–16: el viernes empiezan justo cuando termina la otra.

NIVEL_6 = Ejemplo(
    clave="nivel-6",
    titulo="Nivel 6 · Cercanía entre salones",
    descripcion=(
        "Los viernes, Física Electricidad termina a las 2 p. m. en el Edificio Maldonado y Física Mecánica "
        "empieza ahí mismo a las 2, en Maldonado o en Pablo VI (al otro lado del campus). Rosa activó la "
        "cercanía y se queda en Maldonado; Simón, sin ella, tiene que cruzar el campus."
    ),
    llenos=tuple((f"FIS-102-{i}", 0) for i in (1, 3, 4, 5)) + tuple((f"FIS-101-{i}", 0) for i in (1, 4, 5)),
    estudiantes=(
        EstudianteEjemplo("Rosa Medina", clases=((FISICA_ELECTRICIDAD, False), (FISICA_MECANICA, False)), cercania=True),
        EstudianteEjemplo("Simón Torres", clases=((FISICA_ELECTRICIDAD, False), (FISICA_MECANICA, False))),
    ),
)


# ---------- Nivel 7: horarios sin huecos ----------
#
# Solo queda SIS-499-1 de Proyecto de Grado (mié y vie 11–13). De Ética
# quedan HUM-301-2 (mié y vie 14–16, con 1 h libre antes) y HUM-301-4 (mié y
# vie 9–11, justo antes); las demás se cruzan o están llenas.

NIVEL_7 = Ejemplo(
    clave="nivel-7",
    titulo="Nivel 7 · Horarios sin huecos",
    descripcion=(
        "Proyecto de Grado es miércoles y viernes de 11 a 1. Ética se puede ver justo antes (9 a 11) o "
        "después de almuerzo (2 a 4), dejando una hora libre cada día. Tatiana pidió no tener huecos y "
        "le queda seguida; Ulises, sin esa preferencia, recibe la primera opción."
    ),
    llenos=tuple((f"SIS-499-{i}", 0) for i in (2, 3, 4, 5)) + (("HUM-301-3", 0),),
    estudiantes=(
        EstudianteEjemplo("Tatiana Gil", clases=((PROYECTO_SIS, False), (ETICA, False)), sin_huecos=True),
        EstudianteEjemplo("Ulises Rojas", clases=((PROYECTO_SIS, False), (ETICA, False))),
    ),
)


# ---------- Nivel 8: prioridad entre preferencias ----------
#
# Bases de Datos sin SIS-302-6: Lucía Fernández solo queda de noche
# (SIS-302-5, lun y mié 18–20) y Hernán Moreno en la mañana (SIS-302-3).

PREFIERE_LUCIA = ((LUCIA_FERNANDEZ, 3), (HERNAN_MORENO, 1))

NIVEL_8 = Ejemplo(
    clave="nivel-8",
    titulo="Nivel 8 · Prioridad entre preferencias",
    descripcion=(
        "Sara y Viviana quieren mañanas y prefieren a Lucía Fernández, que solo dicta Bases de Datos de "
        "noche. Sara puso primero los profesores y recibe a Lucía; Viviana puso primero las franjas y "
        "recibe a Hernán en la mañana. Uriel quiere noches, pero puso primero a sus compañeros y va con Viviana."
    ),
    llenos=(("SIS-302-6", 0),),
    estudiantes=(
        EstudianteEjemplo(
            "Sara Molina",
            clases=((BASES_DE_DATOS, False),),
            franjas=MANANAS,
            profesores=PREFIERE_LUCIA,
            ranking=("clases", "profesores", "horarios"),
        ),
        EstudianteEjemplo(
            "Viviana Prieto",
            clases=((BASES_DE_DATOS, False),),
            franjas=MANANAS,
            profesores=PREFIERE_LUCIA,
            ranking=("clases", "horarios", "profesores"),
        ),
        EstudianteEjemplo(
            "Uriel Cano",
            clases=((BASES_DE_DATOS, False),),
            franjas=tuple((dia, 18, 21) for dia in LUNES_A_VIERNES),
            companeros=(("Viviana Prieto", BASES_DE_DATOS),),
            ranking=("clases", "estudiantes", "horarios"),
        ),
    ),
)


EJEMPLOS = (COMPLETO, NIVEL_1, NIVEL_2, NIVEL_3, NIVEL_4, NIVEL_5, NIVEL_6, NIVEL_7, NIVEL_8)
POR_CLAVE = {e.clave: e for e in EJEMPLOS}

# Ocupantes: "Ocupante 1", "Ocupante 2"… (a lo sumo tantos como el cupo más grande).
PREFIJO_OCUPANTE = "Ocupante"


def nombre_ocupante(i: int) -> str:
    return f"{PREFIJO_OCUPANTE} {i}"

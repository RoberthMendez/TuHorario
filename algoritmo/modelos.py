"""Entidades de entrada del algoritmo (subconjunto de los TADs de docs/).

Solo se modela lo que usan los Niveles 1 a 4 (clases, cursos, horarios, cupos,
prioridad de cada clase, franjas habilitadas y profesores). Los niveles siguientes agregan campos (profesor, salones, preferencias…) sin
cambiar la recurrencia de la PD.

Las horas se guardan como enteros (minutos desde la medianoche), no como texto.
Regla de negocio: las clases y franjas siempre empiezan y terminan en horas en
punto (7:00, 8:00…), así que cada una ocupa bloques de 1 hora completos.
"""

from dataclasses import dataclass, field

from algoritmo.tiempo import (
    MINUTO_FIN,
    MINUTO_INICIO,
    a_minutos,
    indice_dia,
    mascara_de_franja,
)


@dataclass(frozen=True)
class Horario:
    """Franja de un día: ``dia`` entre lunes y sábado, horas en minutos y en punto."""

    dia: str
    hora_inicio: int
    hora_fin: int

    def __post_init__(self) -> None:
        indice_dia(self.dia)  # valida el día
        if not MINUTO_INICIO <= self.hora_inicio < self.hora_fin <= MINUTO_FIN:
            raise ValueError(
                f"Horario inválido {self.dia} {self.hora_inicio}-{self.hora_fin}: "
                "debe estar entre 7:00 y 21:00 y la hora de inicio debe ser menor que la de fin"
            )
        if self.hora_inicio % 60 or self.hora_fin % 60:
            raise ValueError(
                f"Horario inválido {self.dia} {self.hora_inicio}-{self.hora_fin}: "
                "las horas deben ser en punto (7:00, 8:00…)"
            )

    @classmethod
    def crear(cls, dia: str, hora_inicio: str, hora_fin: str) -> "Horario":
        """Atajo con horas en texto: ``Horario.crear("lunes", "07:00", "09:00")``."""
        return cls(dia, a_minutos(hora_inicio), a_minutos(hora_fin))

    @property
    def mascara(self) -> int:
        return mascara_de_franja(self.dia, self.hora_inicio, self.hora_fin)


@dataclass(eq=False)
class Profesor:
    id: int
    nombre: str = ""


@dataclass(eq=False)
class Curso:
    """Sección concreta de una clase (p. ej. Cálculo grupo 3).

    ``cupo`` es la capacidad inicial; el algoritmo no lo modifica, lleva los
    cupos restantes aparte. ``mascara`` se precalcula una sola vez.
    """

    id: int
    codigo: str
    cupo: int
    horarios: list[Horario]
    profesor: Profesor | None = None
    mascara: int = field(init=False)

    def __post_init__(self) -> None:
        if self.cupo < 0:
            raise ValueError(f"El cupo del curso {self.codigo} no puede ser negativo")
        mascara = 0
        for horario in self.horarios:
            if mascara & horario.mascara:
                raise ValueError(f"El curso {self.codigo} tiene sesiones que se cruzan")
            mascara |= horario.mascara
        self.mascara = mascara


@dataclass(eq=False)
class Clase:
    """Asignatura (p. ej. Cálculo) con todos sus cursos."""

    id: int
    codigo: str
    nombre: str
    cursos: list[Curso] = field(default_factory=list)


@dataclass
class PreferenciaClase:
    """Clase que el estudiante quiere inscribir y si es prioritaria (obligatoria este semestre)."""

    clase: Clase
    prioridad: bool = False


CALIFICACION_MAXIMA = 3  # TAD PreferenciaProfe: 0 a 3


@dataclass
class PreferenciaProfe:
    """Calificación del estudiante a un profesor.

    0 = no quiere ver clase con él (el curso se descarta); 1 a 3 = nivel de
    preferencia, 3 la mayor.
    """

    profesor: Profesor
    preferencia: int

    def __post_init__(self) -> None:
        if not 0 <= self.preferencia <= CALIFICACION_MAXIMA:
            raise ValueError(f"La preferencia de profesor debe estar entre 0 y {CALIFICACION_MAXIMA}")


@dataclass
class PreferenciasDeEstudiante:
    preferencia_clases: list[PreferenciaClase] = field(default_factory=list)
    # Nivel 3: franjas en las que el estudiante prefiere tener clase. Vacío = sin preferencia.
    franjas_habilitadas: list[Horario] = field(default_factory=list)
    # Nivel 4: calificaciones a profesores. Un profesor sin calificar no suma ni se descarta.
    preferencia_profes: list[PreferenciaProfe] = field(default_factory=list)


@dataclass(eq=False)
class Estudiante:
    id: int
    codigo_estudiantil: str = ""
    nombre: str = ""
    preferencias: PreferenciasDeEstudiante = field(default_factory=PreferenciasDeEstudiante)

    def preferencias_de_clase(self) -> list[PreferenciaClase]:
        """Clases pedidas, en el orden en que las registró y sin repetidas.

        Si una clase aparece repetida, es prioritaria si alguna de sus
        apariciones lo es.
        """
        por_clase: dict[int, PreferenciaClase] = {}
        for preferencia in self.preferencias.preferencia_clases:
            anterior = por_clase.get(preferencia.clase.id)
            if anterior is None:
                por_clase[preferencia.clase.id] = preferencia
            elif preferencia.prioridad and not anterior.prioridad:
                por_clase[preferencia.clase.id] = PreferenciaClase(anterior.clase, True)
        return list(por_clase.values())

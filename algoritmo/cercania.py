"""Nivel 6: cercanía entre los salones de clases seguidas.

A diferencia de franjas, profesor y compañeros, este criterio **no** se puede
sumar curso por curso: depende de qué clase va antes y después de cuál. Por
eso la firma de la PD pasa a ser ``(mascara, edificios)``, donde
``edificios`` es la tupla ordenada de las sesiones ya elegidas::

    (bloque_inicio, bloque_fin, id_edificio)      # bloque_fin exclusivo

y la penalización se calcula en el caso base, cuando ya se conocen todas::

    penalización = Σ  distancia(a, b) / distancia_máxima
                 sesiones a, b del mismo día con b empezando justo cuando termina a

- Solo cuenta cuando una clase es inmediatamente después de la otra (sin
  hueco): ahí el estudiante tiene que cruzar el campus sin tiempo. Si hay
  aunque sea una hora libre entre las dos, no se penaliza.
- La distancia es en línea recta (TAD ``Edificio.calcular_distancia``). Como
  cumple la desigualdad triangular, no hace falta Floyd–Warshall; si se
  usaran tiempos reales de caminata, se precalcularía con Floyd–Warshall.
- Se divide por la distancia máxima del campus, así cada traslado pesa a lo
  sumo 1 (igual que los demás criterios hasta el Nivel 8).

Costo: con la tupla de edificios en el estado, dos caminos solo se juntan si
eligieron las mismas sesiones en los mismos edificios, así que hay más
estados. Por eso solo se activa si el estudiante pidió cercanía.
"""

from algoritmo.modelos import Curso, Edificio
from algoritmo.tiempo import HORAS_POR_DIA, numero_de_bloque

Sesion = tuple[int, int, int]  # (bloque_inicio, bloque_fin exclusivo, id_edificio)


def sesiones_con_edificio(curso: Curso) -> tuple[Sesion, ...]:
    """Sesiones del curso que tienen salón asignado, con su edificio."""
    if not curso.salones:
        return ()
    sesiones = []
    for i, horario in enumerate(curso.horarios):
        salon = curso.salones[0] if len(curso.salones) == 1 else curso.salones[i]
        inicio = numero_de_bloque(horario.dia, horario.hora_inicio // 60)
        fin = inicio + (horario.hora_fin - horario.hora_inicio) // 60
        sesiones.append((inicio, fin, salon.edificio.id))
    return tuple(sesiones)


def agregar(edificios: tuple[Sesion, ...], nuevas: tuple[Sesion, ...]) -> tuple[Sesion, ...]:
    """Une las sesiones y las deja ordenadas (para que el mismo conjunto dé la misma tupla)."""
    return tuple(sorted(edificios + nuevas)) if nuevas else edificios


class Campus:
    """Edificios conocidos y distancias entre ellos (precalculadas una vez)."""

    def __init__(self, cursos: list[Curso]) -> None:
        self.edificios: dict[int, Edificio] = {}
        for curso in cursos:
            for salon in curso.salones:
                self.edificios[salon.edificio.id] = salon.edificio
        lista = list(self.edificios.values())
        self.distancia_maxima = max(
            (a.calcular_distancia(b) for a in lista for b in lista), default=0.0
        )
        self._cache: dict[tuple[int, int], float] = {}

    def distancia_normalizada(self, a: int, b: int) -> float:
        """Distancia entre los edificios a y b dividida por la máxima (0–1)."""
        if a == b or self.distancia_maxima == 0:
            return 0.0
        clave = (a, b) if a < b else (b, a)
        if clave not in self._cache:
            d = self.edificios[a].calcular_distancia(self.edificios[b])
            self._cache[clave] = d / self.distancia_maxima
        return self._cache[clave]

    def nombre(self, id_edificio: int) -> str:
        return self.edificios[id_edificio].nombre or str(id_edificio)

    def penalizacion(self, edificios: tuple[Sesion, ...]) -> float:
        """Penalización por traslados entre clases inmediatamente seguidas del mismo día."""
        total = 0.0
        for a, b in zip(edificios, edificios[1:]):
            mismo_dia = a[0] // HORAS_POR_DIA == b[0] // HORAS_POR_DIA
            if mismo_dia and b[0] == a[1]:  # b empieza justo cuando termina a
                total += self.distancia_normalizada(a[2], b[2])
        return total


def penalizacion_cursos(cursos: list[Curso], campus: Campus) -> float:
    """Penalización de cercanía de un horario completo."""
    edificios: tuple[Sesion, ...] = ()
    for curso in cursos:
        edificios = agregar(edificios, sesiones_con_edificio(curso))
    return campus.penalizacion(edificios)

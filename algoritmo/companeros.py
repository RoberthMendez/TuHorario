"""Nivel 5: preferencias de compañeros.

Para el estudiante e y el curso c de la clase k, con ``P`` = estudiantes ya
inscritos en c:

    compañeros(e, c) = BONO_AMIGO        · |amigos que e pidió para k   ∩ P|
                     + BONO_AMIGO        · |quienes pidieron a e para k ∩ P|
                     - PENALIZACION_EXCLUSION · |excluidos ∩ P|     (en ambas direcciones)

El segundo término ("quien me pidió") hace que la ganancia de e también
cuente lo que gana el otro al tenerlo en su sección, así la PD de e no ignora
a quien ya está esperando por él.

Es un término del puntaje que depende de quién está inscrito en ese momento:
la coordinación global lo calcula antes de cada PD (no cambia el estado).
Como va en la componente de satisfacción, nunca hace perder una clase: solo
decide entre secciones de la misma clase.

Para que los amigos puedan encontrarse, la coordinación procesa seguidos a
los estudiantes de cada componente conexa del grafo de amistad.
"""

from collections import deque
from dataclasses import dataclass, field

from algoritmo.modelos import Estudiante

BONO_AMIGO = 1.0
PENALIZACION_EXCLUSION = 1.0


@dataclass
class RedCompaneros:
    """Relaciones entre estudiantes, precalculadas una vez (por ids)."""

    pedidos: dict[tuple[int, int], set[int]] = field(default_factory=dict)  # (e, clase) → amigos que e pidió
    pedido_por: dict[tuple[int, int], set[int]] = field(default_factory=dict)  # (e, clase) → quienes pidieron a e
    excluidos: dict[int, set[int]] = field(default_factory=dict)  # e → excluidos en ambas direcciones
    amistad: dict[int, set[int]] = field(default_factory=dict)  # grafo no dirigido de amistad

    def vecinos(self, e: int) -> set[int]:
        """Estudiantes cuyo puntaje puede cambiar si e cambia de horario."""
        resultado = set(self.amistad.get(e, ())) | self.excluidos.get(e, set())
        return resultado - {e}


def construir_red(estudiantes: list[Estudiante]) -> RedCompaneros:
    red = RedCompaneros()
    for e in estudiantes:
        for p in e.preferencias.preferencia_estudiantes:
            amigo = p.estudiante_preferido.id
            if amigo == e.id:
                continue
            red.pedidos.setdefault((e.id, p.clase.id), set()).add(amigo)
            red.pedido_por.setdefault((amigo, p.clase.id), set()).add(e.id)
            red.amistad.setdefault(e.id, set()).add(amigo)
            red.amistad.setdefault(amigo, set()).add(e.id)
        for otro in e.preferencias.estudiantes_restringidos:
            if otro.id == e.id:
                continue
            red.excluidos.setdefault(e.id, set()).add(otro.id)
            red.excluidos.setdefault(otro.id, set()).add(e.id)
    return red


def satisfaccion_companeros(e: int, clase: int, presentes: set[int], red: RedCompaneros) -> float:
    """Bono/penalización de compañeros de e en un curso de ``clase`` con esos ``presentes``."""
    if not presentes:
        return 0.0
    amigos = len(red.pedidos.get((e, clase), set()) & presentes)
    me_pidieron = len(red.pedido_por.get((e, clase), set()) & presentes)
    excluidos = len(red.excluidos.get(e, set()) & presentes)
    return BONO_AMIGO * (amigos + me_pidieron) - PENALIZACION_EXCLUSION * excluidos


def ordenar_por_componentes(orden: list[Estudiante], red: RedCompaneros) -> list[Estudiante]:
    """Mantiene el orden sorteado, pero pone seguidos a los de cada componente de amistad.

    Se recorre ``orden``; al encontrar un estudiante aún no visitado se agrega
    toda su componente (en orden BFS desde él).
    """
    por_id = {e.id: e for e in orden}
    posicion = {e.id: i for i, e in enumerate(orden)}
    visitados: set[int] = set()
    resultado = []
    for inicio in orden:
        if inicio.id in visitados:
            continue
        visitados.add(inicio.id)
        cola = deque([inicio.id])
        while cola:
            actual = cola.popleft()
            resultado.append(por_id[actual])
            vecinos = [v for v in red.amistad.get(actual, ()) if v in por_id]
            for vecino in sorted(vecinos, key=posicion.__getitem__):
                if vecino not in visitados:
                    visitados.add(vecino)
                    cola.append(vecino)
    return resultado

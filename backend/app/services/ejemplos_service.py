"""Ejemplo de la sustentación: crea los 10 estudiantes de ``app/db/ejemplo.py``.

1. Borra a los de una carga anterior (los que se llamen igual): si siguieran
   inscritos, ocuparían cupos y el resultado ya no sería el mismo.
2. Crea a todos (así cada uno ya tiene id para que los demás lo pidan como
   compañero o lo restrinjan) y luego guarda sus preferencias con las mismas
   reglas que ``PUT /estudiantes/{id}/preferencias``.

Cada carga crea estudiantes nuevos (código, cédula y correo nuevos); sus
preferencias son siempre las mismas.
"""

from sqlalchemy.orm import Session

from app.core.dias import a_texto
from app.db.ejemplo import ESTUDIANTES, EstudianteEjemplo
from app.models import Estudiante
from app.repositories import estudiantes_repo
from app.schemas import (
    FranjaIn,
    PreferenciaClaseIn,
    PreferenciaCompaneroIn,
    PreferenciaProfeIn,
    PreferenciasIn,
    PrioridadIn,
)
from app.services import estudiantes_service, preferencias_service


def _preferencias(e: EstudianteEjemplo, ids: dict[str, int]) -> PreferenciasIn:
    return PreferenciasIn(
        clases=[PreferenciaClaseIn(id_clase=c, prioridad=p) for c, p in e.clases],
        franjas_habilitadas=[
            FranjaIn(dia=d, hora_inicio=a_texto(i * 60), hora_fin=a_texto(f * 60)) for d, i, f in e.franjas
        ],
        profesores=[PreferenciaProfeIn(id_profesor=p, preferencia=n) for p, n in e.profesores],
        companeros=[PreferenciaCompaneroIn(id_estudiante=ids[n], id_clase=c) for n, c in e.companeros],
        restringidos=[ids[n] for n in e.restringidos],
        preferencia_cercania=e.cercania,
        preferencia_sin_huecos=e.sin_huecos,
        prioridades=[PrioridadIn(tipo_preferencia=t, prioridad=i) for i, t in enumerate(e.ranking, start=1)],
    )


def crear(db: Session) -> list[Estudiante]:
    """Crea los estudiantes del ejemplo con sus preferencias, en su orden."""
    estudiantes_repo.eliminar_con_nombres(db, {e.nombre for e in ESTUDIANTES})
    db.commit()
    estudiantes = [estudiantes_service.crear(db, e.nombre) for e in ESTUDIANTES]
    ids = {e.nombre: creado.id for e, creado in zip(ESTUDIANTES, estudiantes)}
    for e, creado in zip(ESTUDIANTES, estudiantes):
        preferencias_service.guardar(db, creado.id, _preferencias(e, ids))
    return estudiantes

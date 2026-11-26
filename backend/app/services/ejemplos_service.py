"""Ejemplos de la sustentación (``app/db/ejemplos.py``): listarlos y crearlos.

Al crear uno:

1. Borra a los estudiantes de una carga anterior de cualquier ejemplo y a los
   ocupantes (los que se llamen igual): si siguieran inscritos, ocuparían
   cupos y el resultado ya no sería el mismo.
2. Crea los ocupantes que hagan falta y los inscribe en los cursos que el
   ejemplo deja llenos (cada uno puede estar en varios cursos).
3. Crea a los estudiantes del ejemplo (así cada uno ya tiene id para que los
   demás lo pidan como compañero o lo restrinjan) y luego guarda sus
   preferencias con las mismas reglas que ``PUT /estudiantes/{id}/preferencias``.

Cada carga crea estudiantes nuevos (código, cédula y correo nuevos); sus
preferencias son siempre las mismas.
"""

from sqlalchemy.orm import Session

from app.core.dias import a_texto
from app.core.errores import NoEncontrado, ReglaNegocio
from app.db.ejemplos import EJEMPLOS, POR_CLAVE, Ejemplo, EstudianteEjemplo, nombre_ocupante
from app.models import Estudiante
from app.repositories import catalogo_repo, estudiantes_repo, inscripciones_repo
from app.schemas import (
    EjemploOut,
    FranjaIn,
    PreferenciaClaseIn,
    PreferenciaCompaneroIn,
    PreferenciaProfeIn,
    PreferenciasIn,
    PrioridadIn,
)
from app.services import estudiantes_service, preferencias_service

MAXIMO_OCUPANTES = 100  # más que el cupo más grande del catálogo


def listar() -> list[EjemploOut]:
    return [
        EjemploOut(clave=e.clave, titulo=e.titulo, descripcion=e.descripcion, cantidad_estudiantes=len(e.estudiantes))
        for e in EJEMPLOS
    ]


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
        prioridades=[
            PrioridadIn(tipo_preferencia=t, prioridad=i) for i, t in enumerate(e.ranking_completo(), start=1)
        ],
    )


def _borrar_cargas_anteriores(db: Session) -> None:
    nombres = {e.nombre for ejemplo in EJEMPLOS for e in ejemplo.estudiantes}
    nombres |= {nombre_ocupante(i) for i in range(1, MAXIMO_OCUPANTES + 1)}
    estudiantes_repo.eliminar_con_nombres(db, nombres)
    db.commit()


def _llenar_cursos(db: Session, ejemplo: Ejemplo) -> None:
    """Crea ocupantes e inscribe a ``cupo − libres`` de ellos en cada curso lleno."""
    cursos = catalogo_repo.cursos_por_codigos(db, {codigo for codigo, _ in ejemplo.llenos})
    if faltan := sorted({codigo for codigo, _ in ejemplo.llenos} - cursos.keys()):
        raise ReglaNegocio(f"El ejemplo usa cursos que no existen: {faltan}")
    por_curso = {cursos[codigo].id: max(0, cursos[codigo].cupo - libres) for codigo, libres in ejemplo.llenos}
    cantidad = max(por_curso.values(), default=0)
    if cantidad > MAXIMO_OCUPANTES:
        raise ReglaNegocio(f"El ejemplo necesita más de {MAXIMO_OCUPANTES} ocupantes")
    ocupantes = [estudiantes_service.crear(db, nombre_ocupante(i)).id for i in range(1, cantidad + 1)]
    inscripciones_repo.inscribir(db, [(o, curso) for curso, n in por_curso.items() for o in ocupantes[:n]])
    db.commit()


def crear(db: Session, clave: str) -> list[Estudiante]:
    """Crea los estudiantes del ejemplo con sus preferencias, en su orden."""
    ejemplo = POR_CLAVE.get(clave)
    if ejemplo is None:
        raise NoEncontrado(f"No existe el ejemplo {clave!r}")
    _borrar_cargas_anteriores(db)
    _llenar_cursos(db, ejemplo)
    estudiantes = [estudiantes_service.crear(db, e.nombre) for e in ejemplo.estudiantes]
    ids = {e.nombre: creado.id for e, creado in zip(ejemplo.estudiantes, estudiantes)}
    for e, creado in zip(ejemplo.estudiantes, estudiantes):
        preferencias_service.guardar(db, creado.id, _preferencias(e, ids))
    return estudiantes

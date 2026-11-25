"""Preferencias que no se cumplieron en el horario guardado de un estudiante.

Se calcula a partir de lo que está en la base (preferencias e inscripciones),
así que sirve igual después de generar y al consultar ``GET /horarios``. Usa
los mismos criterios que el algoritmo:

- **clases**: clase pedida en la que no quedó inscrito.
- **horarios**: sesión que se sale (toda o en parte) de las franjas habilitadas.
- **profesores**: le tocó un profesor que vetó (0) o uno con menor
  calificación que el mejor calificado (1–3) de los que dictan esa clase.
- **estudiantes**: no quedó en el mismo curso que el compañero que pidió.
- **restringidos** (tipo ``estudiantes``): quedó en un curso con alguien que restringió.
- **cercania**: dos clases seguidas (sin hora libre) en edificios distintos.
- **huecos**: horas libres entre la primera y la última clase de un día.

Cada caso sale con los datos para dibujarlo (``schemas``: ``caso`` dice cuál)
y con ``detalle``, el mismo caso en una frase.
"""

from dataclasses import dataclass

from app import models
from app.core.dias import DIAS, a_texto, dia_api
from app.schemas import (
    ClaseOut,
    ClaseSinCupoOut,
    ConRestringidoOut,
    EstudianteResumenOut,
    FueraDeFranjaOut,
    HorasLibresOut,
    OtroProfesorOut,
    ParadaOut,
    PreferenciaNoCumplidaOut,
    ProfesorCalificadoOut,
    ProfesorVetadoOut,
    SinCompaneroOut,
    SinDescansoOut,
    TramoOut,
)

# Orden en que se listan (el mismo del ranking por defecto del front).
_ORDEN_TIPOS = ("clases", "horarios", "profesores", "estudiantes", "cercania", "huecos")


@dataclass(frozen=True)
class _Sesion:
    dia_orden: int
    inicio: int  # minutos
    fin: int
    curso: models.Curso
    edificio: models.Edificio


def _sesiones(cursos: list[models.Curso]) -> list[_Sesion]:
    return sorted(
        (
            _Sesion(s.dia_orden, s.hora_inicio, s.hora_fin, c, s.salon.edificio)
            for c in cursos
            for s in c.salon_horarios
        ),
        key=lambda s: (s.dia_orden, s.inicio),
    )


def _cuando(s: _Sesion) -> str:
    return f"el {dia_api(DIAS[s.dia_orden])} de {a_texto(s.inicio)} a {a_texto(s.fin)}"


def _clase(clase: models.Clase) -> ClaseOut:
    return ClaseOut.model_validate(clase)


def _calificado(profesor: models.Profesor, nota: int | None) -> ProfesorCalificadoOut:
    return ProfesorCalificadoOut(id=profesor.id, nombre=profesor.nombre, genero=profesor.genero, nota=nota)


def _clases(p: models.PreferenciasDeEstudiante, por_clase: dict[int, models.Curso]):
    for pc in p.preferencia_clases:
        if pc.clase_id not in por_clase:
            prioridad = " (era prioritaria)" if pc.prioridad else ""
            yield ClaseSinCupoOut(
                tipo="clases",
                detalle=f"No te asignaron {pc.clase.nombre}{prioridad}.",
                id_clase=pc.clase_id,
                clase=_clase(pc.clase),
                prioridad=bool(pc.prioridad),
            )


def _franjas(p: models.PreferenciasDeEstudiante, sesiones: list[_Sesion]):
    if not p.franjas_habilitadas:
        return
    habilitadas = {
        (f.dia, h) for f in p.franjas_habilitadas for h in range(f.hora_inicio, f.hora_fin, 60)
    }
    for s in sesiones:
        horas = range(s.inicio, s.fin, 60)
        fuera = sum((DIAS[s.dia_orden], h) not in habilitadas for h in horas)
        if fuera:
            parcial = fuera < len(horas)
            cuanto = "queda en parte fuera" if parcial else "queda fuera"
            yield FueraDeFranjaOut(
                tipo="horarios",
                detalle=f"{s.curso.clase.nombre} {_cuando(s)} {cuanto} de tus franjas.",
                id_clase=s.curso.clase_id,
                clase=_clase(s.curso.clase),
                dia=dia_api(DIAS[s.dia_orden]),
                hora_inicio=a_texto(s.inicio),
                hora_fin=a_texto(s.fin),
                parcial=parcial,
            )


def _nota(calificacion: int | None) -> str:
    return "sin calificar" if calificacion is None else f"{calificacion}/3"


def _profesores(
    p: models.PreferenciasDeEstudiante,
    cursos: list[models.Curso],
    clases_de_profesor: dict[int, list[int]],
):
    calif = {pp.profesor_id: pp for pp in p.preferencia_profes}
    for c in cursos:
        tocado = calif.get(c.profesor_id) if c.profesor_id is not None else None
        nota = tocado.preferencia if tocado else None
        nombre = c.profesor.nombre if c.profesor else "un curso sin profesor"
        if nota == 0:
            yield ProfesorVetadoOut(
                tipo="profesores",
                detalle=f"En {c.clase.nombre} te tocó {nombre}, a quien no querías ver.",
                id_clase=c.clase_id,
                clase=_clase(c.clase),
                profesor=_calificado(c.profesor, 0),
            )
            continue
        candidatos = [pp for pp in calif.values() if c.clase_id in clases_de_profesor.get(pp.profesor_id, ())]
        mejor = max(candidatos, key=lambda pp: pp.preferencia, default=None)
        if mejor and mejor.preferencia >= 1 and (nota or 0) < mejor.preferencia:
            yield OtroProfesorOut(
                tipo="profesores",
                detalle=(
                    f"En {c.clase.nombre} te tocó {nombre} ({_nota(nota)}) y preferías a "
                    f"{mejor.profesor.nombre} ({_nota(mejor.preferencia)})."
                ),
                id_clase=c.clase_id,
                clase=_clase(c.clase),
                profesor=_calificado(c.profesor, nota) if c.profesor else None,
                preferido=_calificado(mejor.profesor, mejor.preferencia),
            )


def _companeros(
    p: models.PreferenciasDeEstudiante,
    por_clase: dict[int, models.Curso],
    cursos_de: dict[int, list[models.Curso]],
):
    for pe in p.preferencia_estudiantes:
        otro = pe.estudiante_preferido.nombre
        mio = por_clase.get(pe.clase_id)
        suyo = next((c for c in cursos_de.get(pe.estudiante_preferido_id, []) if c.clase_id == pe.clase_id), None)
        if mio and suyo and mio.id == suyo.id:
            continue
        if mio is None:
            motivo, texto = "sinClase", "no te asignaron la clase"
        elif suyo is None:
            motivo, texto = "companeroSinClase", f"{otro} no quedó inscrito en esa clase"
        else:
            motivo, texto = "otroCurso", f"tú quedaste en {mio.codigo} y {otro} en {suyo.codigo}"
        yield SinCompaneroOut(
            tipo="estudiantes",
            detalle=f"No quedaste con {otro} en {pe.clase.nombre}: {texto}.",
            id_clase=pe.clase_id,
            clase=_clase(pe.clase),
            companero=EstudianteResumenOut(id=pe.estudiante_preferido_id, nombre=otro),
            motivo=motivo,
            curso=mio.codigo if mio else None,
            curso_companero=suyo.codigo if suyo else None,
        )


def _restringidos(
    p: models.PreferenciasDeEstudiante,
    cursos: list[models.Curso],
    cursos_de: dict[int, list[models.Curso]],
):
    for r in p.estudiantes_restringidos:
        suyos = {c.id for c in cursos_de.get(r.id, [])}
        for c in cursos:
            if c.id in suyos:
                yield ConRestringidoOut(
                    tipo="estudiantes",
                    detalle=f"Quedaste con {r.nombre} en {c.clase.nombre} ({c.codigo}).",
                    id_clase=c.clase_id,
                    clase=_clase(c.clase),
                    restringido=EstudianteResumenOut(id=r.id, nombre=r.nombre),
                    curso=c.codigo,
                )


def _cercania(p: models.PreferenciasDeEstudiante, sesiones: list[_Sesion]):
    if not p.preferencia_cercania:
        return
    for a, b in zip(sesiones, sesiones[1:]):
        if a.dia_orden == b.dia_orden and b.inicio == a.fin and a.edificio.id != b.edificio.id:
            yield SinDescansoOut(
                tipo="cercania",
                detalle=(
                    f"El {dia_api(DIAS[a.dia_orden])} a las {a_texto(b.inicio)} pasas de {a.curso.clase.nombre} "
                    f"en {a.edificio.nombre} a {b.curso.clase.nombre} en {b.edificio.nombre} sin tiempo libre."
                ),
                dia=dia_api(DIAS[a.dia_orden]),
                hora=a_texto(b.inicio),
                desde=ParadaOut(clase=_clase(a.curso.clase), edificio=a.edificio.nombre),
                hasta=ParadaOut(clase=_clase(b.curso.clase), edificio=b.edificio.nombre),
            )


def _huecos(p: models.PreferenciasDeEstudiante, sesiones: list[_Sesion]):
    if not p.preferencia_sin_huecos:
        return
    for d, dia in enumerate(DIAS):
        libres, ocupado_hasta = [], None
        for s in (s for s in sesiones if s.dia_orden == d):
            if ocupado_hasta is not None and s.inicio > ocupado_hasta:
                libres.append((ocupado_hasta, s.inicio))
            ocupado_hasta = max(ocupado_hasta or 0, s.fin)
        if not libres:
            continue
        horas = sum(fin - inicio for inicio, fin in libres) // 60
        tramos = ", ".join(f"{a_texto(i)}–{a_texto(f)}" for i, f in libres)
        plural = "hora libre" if horas == 1 else "horas libres"
        yield HorasLibresOut(
            tipo="huecos",
            detalle=f"El {dia_api(dia)} tienes {horas} {plural} entre clases ({tramos}).",
            dia=dia_api(dia),
            horas=horas,
            tramos=[TramoOut(hora_inicio=a_texto(i), hora_fin=a_texto(f)) for i, f in libres],
        )


def no_cumplidas(
    p: models.PreferenciasDeEstudiante | None,
    cursos: list[models.Curso],
    cursos_de: dict[int, list[models.Curso]],
    clases_de_profesor: dict[int, list[int]],
) -> list[PreferenciaNoCumplidaOut]:
    """Todas las preferencias de ``p`` que no se cumplen con esos ``cursos``.

    ``cursos_de`` trae los cursos inscritos de sus compañeros y restringidos;
    ``clases_de_profesor``, las clases que dicta cada profesor que calificó.
    """
    if p is None:
        return []
    por_clase = {c.clase_id: c for c in cursos}
    sesiones = _sesiones(cursos)
    hallazgos = [
        *_clases(p, por_clase),
        *_franjas(p, sesiones),
        *_profesores(p, cursos, clases_de_profesor),
        *_companeros(p, por_clase, cursos_de),
        *_restringidos(p, cursos, cursos_de),
        *_cercania(p, sesiones),
        *_huecos(p, sesiones),
    ]
    hallazgos.sort(key=lambda h: _ORDEN_TIPOS.index(h.tipo))  # estable: respeta el orden dentro de cada tipo
    return hallazgos

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
"""

from dataclasses import dataclass

from app import models
from app.core.dias import DIAS, a_texto, dia_api
from app.schemas import PreferenciaNoCumplidaOut

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


def _clases(p: models.PreferenciasDeEstudiante, por_clase: dict[int, models.Curso]):
    for pc in p.preferencia_clases:
        if pc.clase_id not in por_clase:
            prioridad = " (era prioritaria)" if pc.prioridad else ""
            yield "clases", f"No te asignaron {pc.clase.nombre}{prioridad}.", pc.clase_id


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
            cuanto = "queda fuera" if fuera == len(horas) else "queda en parte fuera"
            yield "horarios", f"{s.curso.clase.nombre} {_cuando(s)} {cuanto} de tus franjas.", s.curso.clase_id


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
            yield "profesores", f"En {c.clase.nombre} te tocó {nombre}, a quien no querías ver.", c.clase_id
            continue
        candidatos = [pp for pp in calif.values() if c.clase_id in clases_de_profesor.get(pp.profesor_id, ())]
        mejor = max(candidatos, key=lambda pp: pp.preferencia, default=None)
        if mejor and mejor.preferencia >= 1 and (nota or 0) < mejor.preferencia:
            yield (
                "profesores",
                f"En {c.clase.nombre} te tocó {nombre} ({_nota(nota)}) y preferías a "
                f"{mejor.profesor.nombre} ({_nota(mejor.preferencia)}).",
                c.clase_id,
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
            motivo = "no te asignaron la clase"
        elif suyo is None:
            motivo = f"{otro} no quedó inscrito en esa clase"
        else:
            motivo = f"tú quedaste en {mio.codigo} y {otro} en {suyo.codigo}"
        yield "estudiantes", f"No quedaste con {otro} en {pe.clase.nombre}: {motivo}.", pe.clase_id


def _restringidos(
    p: models.PreferenciasDeEstudiante,
    cursos: list[models.Curso],
    cursos_de: dict[int, list[models.Curso]],
):
    for r in p.estudiantes_restringidos:
        suyos = {c.id for c in cursos_de.get(r.id, [])}
        for c in cursos:
            if c.id in suyos:
                yield "estudiantes", f"Quedaste con {r.nombre} en {c.clase.nombre} ({c.codigo}).", c.clase_id


def _cercania(p: models.PreferenciasDeEstudiante, sesiones: list[_Sesion]):
    if not p.preferencia_cercania:
        return
    for a, b in zip(sesiones, sesiones[1:]):
        if a.dia_orden == b.dia_orden and b.inicio == a.fin and a.edificio.id != b.edificio.id:
            yield (
                "cercania",
                f"El {dia_api(DIAS[a.dia_orden])} a las {a_texto(b.inicio)} pasas de {a.curso.clase.nombre} "
                f"en {a.edificio.nombre} a {b.curso.clase.nombre} en {b.edificio.nombre} sin tiempo libre.",
                None,
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
        yield "huecos", f"El {dia_api(dia)} tienes {horas} {plural} entre clases ({tramos}).", None


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
    hallazgos.sort(key=lambda h: _ORDEN_TIPOS.index(h[0]))  # estable: respeta el orden dentro de cada tipo
    return [PreferenciaNoCumplidaOut(tipo=t, detalle=d, id_clase=c) for t, d, c in hallazgos]

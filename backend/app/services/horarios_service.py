"""Generación de horarios: base de datos → módulo ``algoritmo`` → base de datos.

1. Lee las preferencias de los estudiantes de la corrida y libera sus
   inscripciones anteriores.
2. Convierte los modelos ORM a las dataclasses del algoritmo, con una sola
   instancia por id de cada Clase, Curso, Profesor, Edificio, Salón y
   Estudiante (compartida entre todos los estudiantes).
   - Cupo de cada curso = cupo − inscritos que no están en esta corrida.
   - Los compañeros y restringidos que no están en la corrida se descartan:
     ``asignar_horarios`` solo conoce a los estudiantes que recibe (si no,
     falla con ``KeyError`` en la fase de mejora).
3. Ejecuta ``asignar_horarios`` con una semilla fija (reproducible) y guarda
   las inscripciones (TAD ``Curso.listaEstudiantes``).
4. Devuelve los horarios leídos de la base, igual que ``GET /horarios``, con
   las preferencias que no se cumplieron (``cumplimiento_service``).
"""

from sqlalchemy.orm import Session

import algoritmo
from algoritmo.modelos import Edificio as EdificioAlg
from algoritmo.modelos import Salon as SalonAlg

from app import models
from app.core.dias import a_texto, dia_api
from app.core.errores import NoEncontrado
from app.repositories import catalogo_repo, estudiantes_repo, inscripciones_repo, preferencias_repo
from app.schemas import (
    ClaseNoAsignadaOut,
    ClaseOut,
    CursoAsignadoOut,
    HorarioEstudianteOut,
    ProfesorResumenOut,
    SalonOut,
    SesionOut,
)
from app.services import cumplimiento_service

SEMILLA = 2026


def _estudiantes_existentes(db: Session, ids: list[int]) -> dict[int, models.Estudiante]:
    estudiantes = estudiantes_repo.por_ids(db, set(ids))
    if faltan := sorted(set(ids) - estudiantes.keys()):
        raise NoEncontrado(f"No existen los estudiantes {faltan}")
    return estudiantes


class _Conversor:
    """Construye (y reutiliza) una instancia del algoritmo por cada id."""

    def __init__(self) -> None:
        self.profesores: dict[int, algoritmo.Profesor] = {}
        self.edificios: dict[int, EdificioAlg] = {}
        self.salones: dict[int, SalonAlg] = {}
        self.clases: dict[int, algoritmo.Clase] = {}

    def profesor(self, p: models.Profesor) -> algoritmo.Profesor:
        if p.id not in self.profesores:
            self.profesores[p.id] = algoritmo.Profesor(p.id, p.nombre)
        return self.profesores[p.id]

    def salon(self, s: models.Salon) -> SalonAlg:
        if s.id not in self.salones:
            e = s.edificio
            if e.id not in self.edificios:
                self.edificios[e.id] = EdificioAlg(e.id, e.nombre, e.coordenada_x, e.coordenada_y)
            self.salones[s.id] = SalonAlg(s.id, s.codigo, self.edificios[e.id])
        return self.salones[s.id]

    def curso(self, c: models.Curso, cupo: int) -> algoritmo.Curso:
        sesiones = c.salon_horarios
        return algoritmo.Curso(
            c.id,
            c.codigo,
            cupo=cupo,
            horarios=[algoritmo.Horario(s.dia, s.hora_inicio, s.hora_fin) for s in sesiones],
            profesor=self.profesor(c.profesor) if c.profesor else None,
            salones=[self.salon(s.salon) for s in sesiones],
        )


def generar(db: Session, ids_estudiantes: list[int]) -> list[HorarioEstudianteOut]:
    ids = list(dict.fromkeys(ids_estudiantes))  # sin repetidos, en orden
    en_corrida = set(ids)
    estudiantes = _estudiantes_existentes(db, ids)
    preferencias = preferencias_repo.de_estudiantes(db, en_corrida)

    inscripciones_repo.liberar(db, en_corrida)

    # Clases y cursos que pidió alguien de la corrida.
    ids_clases = {pc.clase_id for p in preferencias.values() for pc in p.preferencia_clases}
    cursos = catalogo_repo.cursos_de_clases(db, ids_clases)
    ajenos = inscripciones_repo.inscritos_ajenos(db, {c.id for c in cursos}, en_corrida)

    conv = _Conversor()
    for clase in catalogo_repo.clases_por_ids(db, ids_clases).values():
        conv.clases[clase.id] = algoritmo.Clase(clase.id, clase.codigo, clase.nombre)
    for curso in cursos:
        cupo = max(0, curso.cupo - ajenos.get(curso.id, 0))
        conv.clases[curso.clase_id].cursos.append(conv.curso(curso, cupo))

    # Primero todos los estudiantes (para poder referenciarse entre sí), luego sus preferencias.
    alumnos = {i: algoritmo.Estudiante(i, estudiantes[i].codigo_estudiantil, estudiantes[i].nombre) for i in ids}
    for i in ids:
        p = preferencias.get(i)
        if p is None:
            continue
        alumnos[i].preferencias = algoritmo.PreferenciasDeEstudiante(
            preferencia_clases=[
                algoritmo.PreferenciaClase(conv.clases[pc.clase_id], pc.prioridad) for pc in p.preferencia_clases
            ],
            franjas_habilitadas=[algoritmo.Horario(f.dia, f.hora_inicio, f.hora_fin) for f in p.franjas_habilitadas],
            preferencia_profes=[
                algoritmo.PreferenciaProfe(conv.profesor(pp.profesor), pp.preferencia) for pp in p.preferencia_profes
            ],
            preferencia_estudiantes=[
                algoritmo.PreferenciaCompanero(alumnos[pe.estudiante_preferido_id], conv.clases[pe.clase_id])
                for pe in p.preferencia_estudiantes
                if pe.estudiante_preferido_id in en_corrida and pe.clase_id in conv.clases
            ],
            estudiantes_restringidos=[alumnos[r.id] for r in p.estudiantes_restringidos if r.id in en_corrida],
            preferencia_cercania=p.preferencia_cercania,
            preferencia_sin_huecos=p.preferencia_sin_huecos,
            prioridad_preferencias=[
                algoritmo.PrioridadPreferencia(x.tipo_preferencia, x.prioridad) for x in p.prioridad_preferencias
            ],
        )

    resultado = algoritmo.asignar_horarios([alumnos[i] for i in ids], semilla=SEMILLA)

    inscripciones_repo.inscribir(db, [(i, c.id) for i in ids for c in resultado.horarios[i]])
    db.commit()
    return obtener(db, ids)


def obtener(db: Session, ids_estudiantes: list[int]) -> list[HorarioEstudianteOut]:
    """Horario guardado de cada estudiante, las clases que no quedaron inscritas
    y todas las preferencias que no se cumplieron."""
    ids = list(dict.fromkeys(ids_estudiantes))
    estudiantes = _estudiantes_existentes(db, ids)
    preferencias = preferencias_repo.de_estudiantes(db, set(ids))
    # También los cursos de sus compañeros y restringidos (aunque no estén en la corrida).
    otros = set()
    for p in preferencias.values():
        otros |= {pe.estudiante_preferido_id for pe in p.preferencia_estudiantes}
        otros |= {r.id for r in p.estudiantes_restringidos}
    cursos = inscripciones_repo.cursos_de_estudiantes(db, set(ids) | otros)
    calificados = {pp.profesor_id for p in preferencias.values() for pp in p.preferencia_profes}
    clases_de_profesor = catalogo_repo.clases_de_profesores(db, calificados) if calificados else {}

    horarios = []
    for i in ids:
        mis_cursos = sorted(cursos.get(i, []), key=lambda c: (c.clase.nombre, c.codigo))
        tomadas = {c.clase_id for c in mis_cursos}
        pedidas = preferencias[i].preferencia_clases if i in preferencias else []
        horarios.append(
            HorarioEstudianteOut(
                id_estudiante=i,
                nombre=estudiantes[i].nombre,
                cursos=[_curso_out(c) for c in mis_cursos],
                clases_no_asignadas=[
                    ClaseNoAsignadaOut(clase=ClaseOut.model_validate(pc.clase), prioridad=pc.prioridad)
                    for pc in pedidas
                    if pc.clase_id not in tomadas
                ],
                preferencias_no_cumplidas=cumplimiento_service.no_cumplidas(
                    preferencias.get(i), mis_cursos, cursos, clases_de_profesor
                ),
            )
        )
    return horarios


def _curso_out(c: models.Curso) -> CursoAsignadoOut:
    return CursoAsignadoOut(
        id=c.id,
        codigo=c.codigo,
        clase=ClaseOut.model_validate(c.clase),
        profesor=ProfesorResumenOut(id=c.profesor.id, nombre=c.profesor.nombre) if c.profesor else None,
        sesiones=[
            SesionOut(
                dia=dia_api(s.dia),
                hora_inicio=a_texto(s.hora_inicio),
                hora_fin=a_texto(s.hora_fin),
                salon=SalonOut(codigo=s.salon.codigo, edificio=s.salon.edificio.nombre),
            )
            for s in c.salon_horarios
        ],
    )

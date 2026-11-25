import type { HorarioEstudiante } from '../types/HorarioEstudiante'
import { enviarJson, obtenerJson } from './api'

/*
 * Servicio de horarios.
 *
 *   POST /horarios/generar  { "idsEstudiantes": [1, 2, 3] }
 *     →  200 [{ "idEstudiante": 1, "nombre": "…", "cursos": […],
 *               "clasesNoAsignadas": […] }, …]
 *   GET /horarios?estudiantes=1,2,3  →  lo mismo, leído de la base.
 *
 * Generar corre el algoritmo con las preferencias ya guardadas de esos
 * estudiantes y guarda las inscripciones.
 */

/** Corre el algoritmo para esos estudiantes y devuelve sus horarios. */
export function generarHorarios(
  idsEstudiantes: number[],
  signal?: AbortSignal,
): Promise<HorarioEstudiante[]> {
  return enviarJson<HorarioEstudiante[]>(
    'POST',
    '/horarios/generar',
    { idsEstudiantes },
    { signal },
  )
}

/** Horarios ya generados de esos estudiantes. */
export function obtenerHorarios(
  idsEstudiantes: number[],
  signal?: AbortSignal,
): Promise<HorarioEstudiante[]> {
  return obtenerJson<HorarioEstudiante[]>(
    `/horarios?estudiantes=${idsEstudiantes.join(',')}`,
    { signal },
  )
}

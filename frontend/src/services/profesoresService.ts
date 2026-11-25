import type { Profesor } from '../types/Preferencias'
import { obtenerJson } from './api'

/*
 * Servicio de profesores.
 *
 *   GET /profesores?clases=1,7,11
 *     →  200 [{ "id": 1, "nombre": "…", "genero": "femenino",
 *               "idsClases": [1, 2] }, …]
 *
 * Devuelve solo los profesores que dictan al menos una de esas clases.
 */

/** Profesores que dictan alguna de las clases indicadas. */
export function obtenerProfesoresDeClases(
  idsClases: number[],
  signal?: AbortSignal,
): Promise<Profesor[]> {
  return obtenerJson<Profesor[]>(`/profesores?clases=${idsClases.join(',')}`, {
    signal,
  })
}

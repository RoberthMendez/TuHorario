import { profesoresDisponibles } from '../data/profesores'
import type { Profesor } from '../types/Preferencias'
import { simularRespuesta } from './simulacion'

/*
 * Servicio de profesores. Endpoint previsto en el backend:
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
  // TODO: cuando exista el endpoint, reemplazar por:
  //   return obtenerJson<Profesor[]>(
  //     `/profesores?clases=${idsClases.join(',')}`,
  //     { signal },
  //   )
  // (importando `obtenerJson` de './api').
  const ids = new Set(idsClases)
  return simularRespuesta(
    profesoresDisponibles.filter((profe) =>
      profe.idsClases.some((id) => ids.has(id)),
    ),
    signal,
  )
}

import { clasesDisponibles } from '../data/clases'
import type { Clase } from '../types/Preferencias'
import { simularRespuesta } from './simulacion'

/*
 * Servicio de clases. Endpoint previsto en el backend:
 *
 *   GET /clases  →  200 [{ "id": 1, "codigo": "MAT-101", "nombre": "…" }, …]
 */

/** Todas las clases que ofrece el sistema (las que se pueden inscribir). */
export function obtenerClases(signal?: AbortSignal): Promise<Clase[]> {
  // TODO: cuando exista el endpoint, reemplazar por:
  //   return obtenerJson<Clase[]>('/clases', { signal })
  // (importando `obtenerJson` de './api').
  return simularRespuesta(clasesDisponibles, signal)
}

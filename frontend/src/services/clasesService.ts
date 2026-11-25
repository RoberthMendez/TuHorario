import type { Clase } from '../types/Preferencias'
import { obtenerJson } from './api'

/*
 * Servicio de clases.
 *
 *   GET /clases  →  200 [{ "id": 1, "codigo": "MAT-101", "nombre": "…" }, …]
 */

/** Todas las clases que ofrece el sistema (las que se pueden inscribir). */
export function obtenerClases(signal?: AbortSignal): Promise<Clase[]> {
  return obtenerJson<Clase[]>('/clases', { signal })
}

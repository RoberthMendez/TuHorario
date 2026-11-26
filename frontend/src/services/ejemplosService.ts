import type { Ejemplo } from '../types/Ejemplo'
import type { Estudiante } from '../types/Estudiante'
import { enviarJson, obtenerJson } from './api'

/*
 * Ejemplos de la sustentación (ver backend/app/db/ejemplos.py).
 *
 *   GET  /ejemplos          →  200 [{ "clave": "completo", "titulo": "Ejemplo completo",
 *                                     "descripcion": "…", "cantidadEstudiantes": 10 }, …]
 *   POST /ejemplos/{clave}  →  201 [{ "id": 11, "nombre": "Camila Suárez", … }, …]
 *
 * Crear un ejemplo crea sus estudiantes (siempre los mismos, con sus
 * preferencias ya guardadas) y borra los de una carga anterior de cualquier
 * ejemplo, para que sus cupos no cambien el resultado.
 */

/** El ejemplo completo y uno por cada nivel del algoritmo. */
export function obtenerEjemplos(signal?: AbortSignal): Promise<Ejemplo[]> {
  return obtenerJson<Ejemplo[]>('/ejemplos', { signal })
}

/** Crea los estudiantes del ejemplo, en su orden. */
export function crearEjemplo(
  clave: string,
  signal?: AbortSignal,
): Promise<Estudiante[]> {
  return enviarJson<Estudiante[]>(
    'POST',
    `/ejemplos/${encodeURIComponent(clave)}`,
    {},
    { signal },
  )
}

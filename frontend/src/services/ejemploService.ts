import type { Estudiante } from '../types/Estudiante'
import { enviarJson } from './api'

/*
 * Ejemplo de la sustentación.
 *
 *   POST /ejemplo  →  201 [{ "id": 11, "nombre": "Camila Suárez", … }, …]
 *
 * Crea los 10 estudiantes del ejemplo (siempre los mismos, con sus
 * preferencias ya guardadas; ver backend/app/db/ejemplo.py) y borra los de
 * una carga anterior, para que sus cupos no cambien el resultado.
 */

/** Crea los estudiantes del ejemplo, en su orden. */
export function crearEjemplo(signal?: AbortSignal): Promise<Estudiante[]> {
  return enviarJson<Estudiante[]>('POST', '/ejemplo', {}, { signal })
}

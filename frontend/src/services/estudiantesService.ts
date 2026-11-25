import type { Estudiante } from '../types/Estudiante'
import { eliminar, enviarJson } from './api'

/*
 * Servicio de estudiantes.
 *
 *   POST /estudiantes  { "nombre": "Roberth Méndez" }
 *     →  201 { "id": 1, "codigoEstudiantil": "20260001", … }
 *   DELETE /estudiantes/{id}  →  204
 *
 * El backend genera los demás datos (código 2026 + consecutivo, cédula
 * consecutiva, correo inicial + primer apellido + 2 cifras de la cédula y
 * celular 310…) y borra en cascada sus preferencias e inscripciones. El
 * consecutivo no se reutiliza: código y cédula no se repiten.
 */

/** Crea un estudiante con solo su nombre; el resto se genera. */
export function crearEstudiante(
  nombre: string,
  signal?: AbortSignal,
): Promise<Estudiante> {
  return enviarJson<Estudiante>(
    'POST',
    '/estudiantes',
    { nombre: nombre.trim().replace(/\s+/g, ' ') },
    { signal },
  )
}

/** Elimina un estudiante (con sus clases y preferencias). */
export function eliminarEstudiante(
  id: number,
  signal?: AbortSignal,
): Promise<void> {
  return eliminar(`/estudiantes/${id}`, { signal })
}

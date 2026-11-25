import type { Estudiante } from '../types/Estudiante'
import { eliminar, enviarJson, obtenerJson } from './api'

/*
 * Servicio de estudiantes.
 *
 *   POST /estudiantes  { "nombre": "Roberth Méndez" }
 *     →  201 { "id": 1, "codigoEstudiantil": "20260001", … }
 *   GET /estudiantes/{id}  →  200 (el mismo estudiante) o 404
 *   PUT /estudiantes/{id}  { "nombre": "Ana Gómez" }  →  200 (con su correo rehecho)
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

/** Un estudiante ya creado, con todos sus datos. */
export function obtenerEstudiante(
  id: number,
  signal?: AbortSignal,
): Promise<Estudiante> {
  return obtenerJson<Estudiante>(`/estudiantes/${id}`, { signal })
}

/**
 * Le cambia el nombre a un estudiante. El backend rehace su correo con el
 * nombre nuevo; código, cédula y celular se quedan igual.
 */
export function renombrarEstudiante(
  id: number,
  nombre: string,
  signal?: AbortSignal,
): Promise<Estudiante> {
  return enviarJson<Estudiante>(
    'PUT',
    `/estudiantes/${id}`,
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

import type { Companero } from '../types/Preferencias'
import { obtenerJson } from './api'

/*
 * Servicio de compañeros (otros estudiantes).
 *
 *   GET /estudiantes?buscar=seb&limite=5&excluir=3
 *     →  200 [{ "id": 101, "nombre": "…", "correo": "…" }, …]
 *
 * Busca por nombre o correo (sin importar tildes ni mayúsculas) y devuelve
 * como mucho `limite` estudiantes, como las sugerencias de un correo.
 * `excluir` es el propio estudiante, para no sugerírselo a sí mismo.
 */

export const LIMITE_SUGERENCIAS = 5

/** Primeros estudiantes cuyo nombre o correo contiene `consulta`. */
export function buscarCompaneros(
  consulta: string,
  excluir?: number,
  signal?: AbortSignal,
): Promise<Companero[]> {
  const parametros = new URLSearchParams({
    buscar: consulta,
    limite: String(LIMITE_SUGERENCIAS),
  })
  if (excluir !== undefined) parametros.set('excluir', String(excluir))
  return obtenerJson<Companero[]>(`/estudiantes?${parametros}`, { signal })
}

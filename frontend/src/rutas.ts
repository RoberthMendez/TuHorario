/*
 * Rutas de la app y cómo viaja el intento entre páginas: los ids de sus
 * estudiantes van en la URL (`?estudiantes=1,2,3`), así una recarga o el
 * botón "atrás" no pierden a nadie (lo demás está guardado en el backend).
 */

/** Estado de navegación que deja "Finalizar" al ir a Horarios. */
export interface EstadoHorarios {
  /** Correr el algoritmo (si no, se leen los horarios ya guardados). */
  generar: boolean
}

const conIds = (ruta: string, ids: number[]) =>
  ids.length > 0 ? `${ruta}?estudiantes=${ids.join(',')}` : ruta

/** Preferencias, vacía o con los estudiantes de un intento. */
export const rutaPreferencias = (ids: number[] = []) =>
  conIds('/preferencias', ids)

/** Horarios de los estudiantes de un intento. */
export const rutaHorarios = (ids: number[]) => conIds('/horarios', ids)

/** "1,2,3" → [1, 2, 3] (ignora lo que no sea un id). */
export function idsDeTexto(texto: string | null): number[] {
  const ids = (texto ?? '')
    .split(',')
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0)
  return [...new Set(ids)]
}

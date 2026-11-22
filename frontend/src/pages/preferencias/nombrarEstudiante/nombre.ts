/*
 * Reglas del nombre de un estudiante: siempre "Nombre Apellido", cada palabra
 * con la primera letra en mayúscula y el resto en minúscula, escriba como
 * escriba el usuario ("aNA maría RUIZ" → "Ana María Ruiz"). Las partes
 * separadas por guion o apóstrofo también ("ana-maría" → "Ana-María").
 */

const palabra = /\p{L}+/gu

const capitalizar = (p: string) =>
  p.charAt(0).toLocaleUpperCase('es') + p.slice(1).toLocaleLowerCase('es')

/**
 * Pone mayúscula inicial a cada palabra. No cambia el largo ni los espacios,
 * así que se puede aplicar mientras se escribe sin mover el cursor.
 */
export const formatearNombre = (texto: string) =>
  texto.replace(palabra, capitalizar)

/** Sin espacios sobrantes (al crear el estudiante). */
export const limpiarNombre = (texto: string) =>
  formatearNombre(texto).trim().replace(/\s+/g, ' ')

export type ProblemaNombre = 'vacio' | 'sinApellido' | null

/**
 * Nombre y apellido: al menos dos palabras con dos letras o más (una inicial
 * como "M." se permite de más, pero no cuenta).
 */
export function revisarNombre(texto: string): ProblemaNombre {
  const completas = (texto.match(palabra) ?? []).filter((p) => p.length >= 2)
  if (completas.length === 0) return 'vacio'
  if (completas.length === 1) return 'sinApellido'
  return null
}

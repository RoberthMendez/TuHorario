/** "Sebastián Vargas Pardo" → "SV" (primer nombre y primer apellido). */
export function iniciales(nombre: string) {
  const [primero = '', segundo = ''] = nombre.split(' ')
  return (primero.charAt(0) + segundo.charAt(0)).toUpperCase()
}

/** "Sebastián Vargas" → "Sebastián". */
export function primerNombre(nombre: string) {
  return nombre.split(' ')[0]
}

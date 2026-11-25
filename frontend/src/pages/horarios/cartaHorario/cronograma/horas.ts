// La grilla va de 7:00 a. m. a 9:00 p. m.: una fila por hora.
export const PRIMERA_HORA = 7
export const ULTIMA_HORA = 20
export const HORAS = Array.from(
  { length: ULTIMA_HORA - PRIMERA_HORA + 1 },
  (_, i) => PRIMERA_HORA + i,
)

/** Alto de una fila (una hora), en unidades del diseño. */
export const ALTO_HORA = 56

/** "07:30" → 450 (minutos desde la medianoche). */
export function aMinutos(hora: string) {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

/** "7:00 a. m.", "12:00 p. m.", "8:00 p. m.". */
export function etiquetaHora(hora: number) {
  const sufijo = hora < 12 ? 'a. m.' : 'p. m.'
  return `${hora > 12 ? hora - 12 : hora}:00 ${sufijo}`
}

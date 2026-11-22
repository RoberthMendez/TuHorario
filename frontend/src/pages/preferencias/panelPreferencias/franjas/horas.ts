import { diasFranjas, horasFranjas } from '../../../../data/preferenciasEjemplo'
import type { Dia } from '../../../../types/Horario'
import type { FranjaHabilitada } from '../../../../types/Preferencias'

/*
 * Las franjas se guardan como el conjunto de horas marcadas ("lunes|14" =
 * lunes de 2:00 a 3:00 p. m.) y se muestran como bloques: horas seguidas del
 * mismo día forman una sola franja.
 */

export const clave = (dia: Dia, hora: number) => `${dia}|${hora}`

const ULTIMA_HORA = horasFranjas[horasFranjas.length - 1]
// Mañana: 7:00 a. m. – 12:00 m.; tarde: 12:00 m. – 9:00 p. m. (hasta el
// final de la grilla). Entre las dos cubren toda la semana.
const MEDIODIA = 12

/** Horas de `desde` (incluida) a `hasta` (excluida) en esos días. */
function rango(dias: Dia[], desde: number, hasta: number) {
  const horas = new Set<string>()
  for (const dia of dias) {
    for (let hora = desde; hora < hasta; hora++) horas.add(clave(dia, hora))
  }
  return horas
}

const todosLosDias = diasFranjas.map((d) => d.dia)
export const MANANAS = rango(todosLosDias, horasFranjas[0], MEDIODIA)
export const TARDES = rango(todosLosDias, MEDIODIA, ULTIMA_HORA + 1)
export const TODAS = rango(todosLosDias, horasFranjas[0], ULTIMA_HORA + 1)

/** Añade una franja (se une con lo que ya estaba marcado). */
export function agregar(horas: Set<string>, franja: FranjaHabilitada) {
  return new Set([...horas, ...rango([franja.dia], franja.desde, franja.hasta)])
}

/** Quita todas las horas de una franja. */
export function quitar(horas: Set<string>, franja: FranjaHabilitada) {
  const fuera = rango([franja.dia], franja.desde, franja.hasta)
  return new Set([...horas].filter((h) => !fuera.has(h)))
}

/** Bloques de horas seguidas, día por día. */
export function bloques(horas: Set<string>): FranjaHabilitada[] {
  const franjas: FranjaHabilitada[] = []
  for (const { dia } of diasFranjas) {
    let desde: number | null = null
    for (const hora of [...horasFranjas, ULTIMA_HORA + 1]) {
      const marcada = horas.has(clave(dia, hora))
      if (marcada && desde === null) desde = hora
      if (!marcada && desde !== null) {
        franjas.push({ dia, desde, hasta: hora })
        desde = null
      }
    }
  }
  return franjas
}

/** "7:00 a. m.", "12:00 p. m.", "8:00 p. m.". */
export function etiquetaHora(hora: number) {
  const sufijo = hora < 12 ? 'a. m.' : 'p. m.'
  const hora12 = hora > 12 ? hora - 12 : hora
  return `${hora12}:00 ${sufijo}`
}

/** "7 a. m. – 12 p. m." (corto, para dentro de los bloques). */
export function etiquetaFranja({ desde, hasta }: FranjaHabilitada) {
  const corta = (hora: number) =>
    `${hora > 12 ? hora - 12 : hora} ${hora < 12 ? 'a. m.' : 'p. m.'}`
  return `${corta(desde)} – ${corta(hasta)}`
}

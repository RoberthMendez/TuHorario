import { DIAS_SEMANA } from '../../../../../data/semana'
import type { Dia } from '../../../../../types/Horario'

// Las clases y franjas van siempre en horas en punto ("HH:00").
const horaDe = (hhmm: string) => Number(hhmm.split(':')[0])
const sufijo = (hora: number) => (hora < 12 ? 'a. m.' : 'p. m.')
const en12 = (hora: number) => (hora > 12 ? hora - 12 : hora)

/** "14:00" → "2 p. m." */
export function horaCorta(hhmm: string) {
  const hora = horaDe(hhmm)
  return `${en12(hora)} ${sufijo(hora)}`
}

/** "09:00"–"11:00" → "9 – 11 a. m."; "11:00"–"13:00" → "11 a. m. – 1 p. m." */
export function rangoHoras(inicio: string, fin: string) {
  const desde = horaDe(inicio)
  const hasta = horaDe(fin)
  return sufijo(desde) === sufijo(hasta)
    ? `${en12(desde)} – ${en12(hasta)} ${sufijo(hasta)}`
    : `${horaCorta(inicio)} – ${horaCorta(fin)}`
}

/** "miércoles" → "MIÉ". */
export const abreviaturaDia = (dia: Dia) =>
  DIAS_SEMANA.find((d) => d.dia === dia)?.abreviatura ?? dia

import type { Dia } from '../types/Horario'

export const DIAS_SEMANA: { dia: Dia; abreviatura: string }[] = [
  { dia: 'lunes', abreviatura: 'LUN' },
  { dia: 'martes', abreviatura: 'MAR' },
  { dia: 'miércoles', abreviatura: 'MIÉ' },
  { dia: 'jueves', abreviatura: 'JUE' },
  { dia: 'viernes', abreviatura: 'VIE' },
  { dia: 'sábado', abreviatura: 'SÁB' },
]

// Horas visibles en la ilustración del horario (una fila por hora).
export const HORA_INICIO_ILUSTRACION = 7
export const HORAS_ILUSTRACION = [
  '7:00',
  '8:00',
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
]

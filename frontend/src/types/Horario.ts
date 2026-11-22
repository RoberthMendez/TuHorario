// TAD Horario (docs/): franja horaria de lunes a sábado entre 7 am y 9 pm.
export type Dia =
  'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado'

export interface Horario {
  id: number
  dia: Dia
  horaInicio: string
  horaFin: string
}

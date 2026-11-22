import type { Horario } from './Horario'

// Tipo de vista: un curso de una Clase ubicado en un Horario y un Salón.
export type ColorBloque = 'azul' | 'amarillo' | 'indigo' | 'crema'

export interface BloqueHorario {
  id: number
  clase: string // Clase.nombre
  salon: string // Salón (código con prefijo, p. ej. "Salón B-204")
  profesor: string // Profesor.nombre
  horario: Horario
  color: ColorBloque
  conector?: 'derecha' | 'izquierda'
}

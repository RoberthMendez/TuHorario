import type { Dia } from './Horario'

// Colores pastel del diseño para clases, filas y tarjetas (solo vista).
export type ColorPastel =
  | 'beeswax'
  | 'white-ice'
  | 'tuft-bush'
  | 'titan-white'
  | 'carousel-pink'
  | 'mabel'
  | 'snuff'
  | 'wheatfield'

// TAD Clase (docs/), sin los cursos (no se usan en la vista).
export interface Clase {
  id: number
  codigo: string
  nombre: string
}

// TAD Preferencias De Clase: clase a inscribir y si es prioridad.
export interface PreferenciaClase {
  clase: Clase
  prioridad: boolean
  color: ColorPastel
}

// TAD Profesor (docs/), solo los campos que muestra la vista.
export interface Profesor {
  id: number
  nombre: string
}

// TAD Preferencia de Profesor: 0 = no quiere verlo, 3 = prioridad máxima.
export type NivelPreferencia = 0 | 1 | 2 | 3

export interface PreferenciaProfe {
  profesor: Profesor
  preferencia: NivelPreferencia
}

// TAD Prioridad Preferencias: 1 = más importante.
export interface PrioridadPreferencias {
  tipoPreferencia: string
  prioridad: number
}

// Franja seleccionada en la grilla (horas en formato 24 h, fin exclusivo).
export interface FranjaHabilitada {
  dia: Dia
  desde: number
  hasta: number
}

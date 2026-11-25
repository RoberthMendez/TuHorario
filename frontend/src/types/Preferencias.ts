import type { Estudiante } from './Estudiante'
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

export type Genero = 'femenino' | 'masculino'

// TAD Profesor (docs/), solo los campos que muestra la vista. `genero` elige
// el avatar; `idsClases` son las clases que dicta (para filtrar y colorear).
export interface Profesor {
  id: number
  nombre: string
  genero: Genero
  idsClases: number[]
}

// TAD Preferencia de Profesor: 0 = no quiere verlo, 3 = prioridad máxima.
export type NivelPreferencia = 0 | 1 | 2 | 3

export interface PreferenciaProfe {
  profesor: Profesor
  preferencia: NivelPreferencia
}

// Compañero: un Estudiante (TAD) con los datos que muestra la búsqueda.
export type Companero = Pick<Estudiante, 'id' | 'nombre' | 'correo'>

// TAD Preferencias De Compañero: con quién se quiere ver una clase concreta
// (una preferencia por cada par compañero–clase).
export interface PreferenciaCompanero {
  estudiantePreferido: Companero
  clase: Clase
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

// TAD Preferencias De Estudiante, tal como lo arma el panel: solo lo que
// cuenta (secciones activas, profesores y compañeros de clases elegidas,
// interruptores encendidos). `prioridades` usa las etiquetas de la vista;
// `preferenciasService` las traduce a los tipos del backend.
export interface PreferenciasEstudiante {
  clases: PreferenciaClase[]
  profesores: PreferenciaProfe[]
  companeros: PreferenciaCompanero[]
  restringidos: Companero[]
  franjasHabilitadas: FranjaHabilitada[]
  preferenciaCercania: boolean
  preferenciaSinHuecos: boolean
  prioridades: PrioridadPreferencias[]
}

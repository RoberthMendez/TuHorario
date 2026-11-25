import type { Dia } from './Horario'
import type { Clase } from './Preferencias'

// Respuesta de `POST /horarios/generar` y `GET /horarios`: el horario que el
// algoritmo le asignó a cada estudiante (TAD Curso con sus SalonHorario).

export interface SalonSesion {
  codigo: string
  edificio: string // Edificio.nombre
}

// Una sesión del curso: un Horario en un Salón (TAD SalonHorario).
export interface SesionCurso {
  dia: Dia
  horaInicio: string // "HH:MM"
  horaFin: string
  salon: SalonSesion | null
}

export interface CursoAsignado {
  id: number
  codigo: string
  clase: Clase
  profesor: { id: number; nombre: string } | null
  sesiones: SesionCurso[]
}

export interface ClaseNoAsignada {
  clase: Clase
  prioridad: boolean
}

export interface HorarioEstudiante {
  idEstudiante: number
  nombre: string
  cursos: CursoAsignado[]
  clasesNoAsignadas: ClaseNoAsignada[]
}

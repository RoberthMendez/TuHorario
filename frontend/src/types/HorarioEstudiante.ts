import type { Dia } from './Horario'
import type {
  Clase,
  Genero,
  NivelPreferencia,
  TipoPreferencia,
} from './Preferencias'

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

export interface EstudianteResumen {
  id: number
  nombre: string
}

// Profesor de un curso con la calificación que le dio el estudiante (null:
// no lo calificó).
export interface ProfesorCalificado {
  id: number
  nombre: string
  genero: Genero
  nota: NivelPreferencia | null
}

export interface Tramo {
  horaInicio: string
  horaFin: string
}

// Una clase y el edificio en el que se dicta.
export interface Parada {
  clase: Clase
  edificio: string
}

interface BaseNoCumplida {
  tipo: TipoPreferencia
  /** El caso en una frase (lectores de pantalla y textos de ayuda). */
  detalle: string
  idClase: number | null // null en cercanía y huecos
}

// Una preferencia que el horario no cumple: `caso` dice cuál y trae los datos
// para dibujarla.
export type PreferenciaNoCumplida = BaseNoCumplida &
  (
    | { caso: 'claseSinCupo'; clase: Clase; prioridad: boolean }
    | {
        caso: 'fueraDeFranja'
        clase: Clase
        dia: Dia
        horaInicio: string
        horaFin: string
        /** Solo una parte de la sesión queda fuera. */
        parcial: boolean
      }
    | { caso: 'profesorVetado'; clase: Clase; profesor: ProfesorCalificado }
    | {
        caso: 'otroProfesor'
        clase: Clase
        /** null: el curso no tiene profesor. */
        profesor: ProfesorCalificado | null
        preferido: ProfesorCalificado
      }
    | {
        caso: 'sinCompanero'
        clase: Clase
        companero: EstudianteResumen
        motivo: 'sinClase' | 'companeroSinClase' | 'otroCurso'
        /** Su curso, si quedó en la clase. */
        curso: string | null
        /** El del compañero, si él quedó. */
        cursoCompanero: string | null
      }
    | {
        caso: 'conRestringido'
        clase: Clase
        restringido: EstudianteResumen
        curso: string
      }
    | {
        caso: 'sinDescanso'
        dia: Dia
        /** Cuando empieza la segunda clase. */
        hora: string
        desde: Parada
        hasta: Parada
      }
    | { caso: 'horasLibres'; dia: Dia; horas: number; tramos: Tramo[] }
  )

/** Una preferencia no cumplida de un caso en particular. */
export type NoCumplida<C extends PreferenciaNoCumplida['caso']> = Extract<
  PreferenciaNoCumplida,
  { caso: C }
>

export interface HorarioEstudiante {
  idEstudiante: number
  nombre: string
  cursos: CursoAsignado[]
  clasesNoAsignadas: ClaseNoAsignada[]
  preferenciasNoCumplidas: PreferenciaNoCumplida[]
}

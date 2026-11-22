import type {
  Genero,
  NivelPreferencia,
  PrioridadPreferencias,
} from '../types/Preferencias'
import type { Dia } from '../types/Horario'

// Preferencias de ejemplo (iguales para todos los estudiantes por ahora).

// Escala de niveles de preferencia por un profesor (leyenda de la sección).
export const nivelesProfesor: {
  nivel: NivelPreferencia
  titulo: string
  descripcion: string
  /** Cara de ejemplo de la leyenda (alterna profe y profa). */
  genero: Genero
}[] = [
  {
    nivel: 0,
    titulo: 'Ni de riesgos',
    descripcion: 'No quieres ver clase con este profe.',
    genero: 'masculino',
  },
  {
    nivel: 1,
    titulo: 'Si toca, toca',
    descripcion: 'Buen profe, pero no es de tus primeras opciones.',
    genero: 'femenino',
  },
  {
    nivel: 2,
    titulo: 'Ojalá me toque',
    descripcion: 'Lo prefieres, aunque no es lo máximo.',
    genero: 'masculino',
  },
  {
    nivel: 3,
    titulo: '¡Sí o sí!',
    descripcion: 'Prioridad máxima: que el algoritmo te ponga con él o ella.',
    genero: 'femenino',
  },
]

export const diasFranjas: { dia: Dia; nombre: string }[] = [
  { dia: 'lunes', nombre: 'Lunes' },
  { dia: 'martes', nombre: 'Martes' },
  { dia: 'miércoles', nombre: 'Miércoles' },
  { dia: 'jueves', nombre: 'Jueves' },
  { dia: 'viernes', nombre: 'Viernes' },
  { dia: 'sábado', nombre: 'Sábado' },
]

// 7:00 a. m. a 8:00 p. m. (una fila por hora).
export const horasFranjas = Array.from({ length: 14 }, (_, i) => 7 + i)

export const prioridades: PrioridadPreferencias[] = [
  { tipoPreferencia: 'Clases con prioridad', prioridad: 1 },
  { tipoPreferencia: 'Profesores', prioridad: 2 },
  { tipoPreferencia: 'Compañeros', prioridad: 3 },
  { tipoPreferencia: 'Franjas Habilitadas', prioridad: 4 },
  { tipoPreferencia: 'Horario sin huecos', prioridad: 5 },
  { tipoPreferencia: 'Cercanía entre salones', prioridad: 6 },
]

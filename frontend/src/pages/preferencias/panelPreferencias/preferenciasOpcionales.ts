import iconoCercania from '../../../assets/cercania/icono-seccion.svg'
import iconoCompaneros from '../../../assets/companeros/icono-seccion.svg'
import iconoFranjas from '../../../assets/franjas/icono-seccion.svg'
import iconoProfesores from '../../../assets/profesores/icono-seccion.svg'

/*
 * Preferencias que el estudiante puede añadir además de las clases (que son
 * obligatorias). `tipo` es el nombre con el que aparece en la lista de
 * Prioridad de preferencias (TAD Prioridad Preferencias).
 */
export type IdPreferencia = 'profesores' | 'companeros' | 'franjas' | 'cercania'

export interface PreferenciaOpcional {
  id: IdPreferencia
  tipo: string
  titulo: string
  descripcion: string
  icono: string
  /** Se basa en las clases elegidas: sin clases no se puede añadir. */
  requiereClases: boolean
}

export const TIPO_CLASES = 'Clases con prioridad'
// Va dentro de Franjas Habilitadas, pero se prioriza por aparte (solo si
// está encendido).
export const TIPO_SIN_HUECOS = 'Horario sin huecos'

// En este orden se muestran las secciones en el panel.
export const PREFERENCIAS_OPCIONALES: PreferenciaOpcional[] = [
  {
    id: 'profesores',
    tipo: 'Profesores',
    titulo: 'Profesores',
    descripcion: 'Elige con qué profesores quieres ver tus clases.',
    icono: iconoProfesores,
    requiereClases: true,
  },
  {
    id: 'companeros',
    tipo: 'Compañeros',
    titulo: 'Compañeros',
    descripcion: 'Ve clases con tus amigos (o evita a alguien).',
    icono: iconoCompaneros,
    requiereClases: true,
  },
  {
    id: 'franjas',
    tipo: 'Franjas Habilitadas',
    titulo: 'Franjas Habilitadas',
    descripcion: 'Marca las horas en las que quieres ver clase.',
    icono: iconoFranjas,
    requiereClases: false,
  },
  {
    id: 'cercania',
    tipo: 'Cercanía entre salones',
    titulo: 'Cercanía entre salones',
    descripcion: 'Que tus salones queden cerca entre sí.',
    icono: iconoCercania,
    requiereClases: false,
  },
]

/** Nombre con el que una preferencia aparece en Prioridad de preferencias. */
export const tipoDe = (id: IdPreferencia) =>
  PREFERENCIAS_OPCIONALES.find((o) => o.id === id)?.tipo ?? id

import iconoCercania from '../../../../../assets/cercania/icono-seccion.svg'
import iconoClases from '../../../../../assets/clases/icono-seccion.svg'
import iconoCompaneros from '../../../../../assets/companeros/icono-seccion.svg'
import iconoFranjas from '../../../../../assets/franjas/icono-seccion.svg'
import iconoSinHuecos from '../../../../../assets/franjas/icono-sin-huecos.svg'
import iconoProfesores from '../../../../../assets/profesores/icono-seccion.svg'
import { COLORES_PRIORIDAD } from '../../../../../styles/colores'
import type { TipoPreferencia } from '../../../../../types/Preferencias'

/*
 * Cómo se ve cada tipo de preferencia en su ficha: el ícono de su sección en
 * Preferencias y el color que tiene en Prioridad de preferencias (en el orden
 * de ese ranking), para que se reconozca de un vistazo.
 */
export const TIPOS: Record<
  TipoPreferencia,
  {
    etiqueta: string
    icono: string
    colores: { fondo: string; numero: string }
  }
> = {
  clases: {
    etiqueta: 'Clases',
    icono: iconoClases,
    colores: COLORES_PRIORIDAD[0],
  },
  profesores: {
    etiqueta: 'Profesores',
    icono: iconoProfesores,
    colores: COLORES_PRIORIDAD[1],
  },
  estudiantes: {
    etiqueta: 'Compañeros',
    icono: iconoCompaneros,
    colores: COLORES_PRIORIDAD[2],
  },
  horarios: {
    etiqueta: 'Franjas habilitadas',
    icono: iconoFranjas,
    colores: COLORES_PRIORIDAD[3],
  },
  huecos: {
    etiqueta: 'Horario sin huecos',
    icono: iconoSinHuecos,
    colores: COLORES_PRIORIDAD[4],
  },
  cercania: {
    etiqueta: 'Cercanía entre salones',
    icono: iconoCercania,
    colores: COLORES_PRIORIDAD[5],
  },
}

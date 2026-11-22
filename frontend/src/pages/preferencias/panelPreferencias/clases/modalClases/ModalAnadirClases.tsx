import iconoSeccion from '../../../../../assets/clases/icono-seccion.svg'
import { obtenerClases } from '../../../../../services/clasesService'
import type { Clase } from '../../../../../types/Preferencias'
import ModalSeleccion from '../../modalSeleccion/ModalSeleccion'
import type { TextosModal } from '../../modalSeleccion/ModalSeleccion'
import ChipClase from './ChipClase'
import FilaClase from './FilaClase'

const textos: TextosModal = {
  titulo: 'Añadir clases',
  descripcion: 'Busca por nombre o código y elige todas las que necesites.',
  placeholder: 'Ej.: Cálculo, Proyecto de grado o MAT-101',
  etiquetaBuscar: 'Buscar clases por nombre o código',
  unidad: ['clase', 'clases'],
  pista: 'Toca una o varias clases para elegirlas.',
  sinResultados: 'No encontramos esa clase',
  listaVacia: {
    titulo: 'No hay clases disponibles',
    texto: 'Todavía no hay clases en el sistema.',
  },
  error: 'No pudimos traer las clases',
  yaAgregado: 'Ya agregada',
}

interface ModalAnadirClasesProps {
  /** Clases que el estudiante ya tiene: salen marcadas y no se pueden elegir. */
  idsAgregados: Set<number>
  onConfirmar: (clases: Clase[]) => void
  onCerrar: () => void
}

// Ventana emergente para añadir varias clases a la vez (busca por nombre o
// código).
export default function ModalAnadirClases({
  idsAgregados,
  onConfirmar,
  onCerrar,
}: ModalAnadirClasesProps) {
  return (
    <ModalSeleccion<Clase>
      icono={iconoSeccion}
      textos={textos}
      consultar={obtenerClases}
      idDe={(clase) => clase.id}
      textosBusqueda={(clase) => [clase.nombre, clase.codigo]}
      idsAgregados={idsAgregados}
      contenidoFila={(clase, consulta) => (
        <FilaClase clase={clase} consulta={consulta} />
      )}
      chip={(clase, quitar) => <ChipClase clase={clase} onQuitar={quitar} />}
      onConfirmar={onConfirmar}
      onCerrar={onCerrar}
    />
  )
}

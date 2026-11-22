import iconoSeccion from '../../../../../assets/profesores/icono-seccion.svg'
import { obtenerProfesoresDeClases } from '../../../../../services/profesoresService'
import type {
  PreferenciaClase,
  Profesor,
} from '../../../../../types/Preferencias'
import ModalSeleccion from '../../modalSeleccion/ModalSeleccion'
import type { TextosModal } from '../../modalSeleccion/ModalSeleccion'
import { clasesDelProfesor } from '../clasesDelProfesor'
import ChipProfesor from './ChipProfesor'
import FilaProfesor from './FilaProfesor'

const textos: TextosModal = {
  titulo: 'Añadir profesores',
  descripcion:
    'Solo salen los profesores de tus clases. Búscalos por nombre o por asignatura.',
  placeholder: 'Ej.: Natalia o Cálculo',
  etiquetaBuscar: 'Buscar profesores por nombre o asignatura',
  unidad: ['profesor', 'profesores'],
  pista: 'Toca uno o varios profesores para elegirlos.',
  sinResultados: 'No encontramos ese profesor',
  listaVacia: {
    titulo: 'No hay profesores para tus clases',
    texto: 'Todavía no hay profesores asignados a las clases que elegiste.',
  },
  error: 'No pudimos traer los profesores',
  yaAgregado: 'Ya agregado',
}

interface ModalAnadirProfesoresProps {
  /** Clases del estudiante: solo se consultan los profesores que las dictan. */
  clases: PreferenciaClase[]
  idsAgregados: Set<number>
  onConfirmar: (profesores: Profesor[]) => void
  onCerrar: () => void
}

// Ventana emergente para añadir varios profesores a la vez.
export default function ModalAnadirProfesores({
  clases,
  idsAgregados,
  onConfirmar,
  onCerrar,
}: ModalAnadirProfesoresProps) {
  return (
    <ModalSeleccion<Profesor>
      icono={iconoSeccion}
      textos={textos}
      consultar={(signal) =>
        obtenerProfesoresDeClases(
          clases.map((p) => p.clase.id),
          signal,
        )
      }
      idDe={(profesor) => profesor.id}
      textosBusqueda={(profesor) => [
        profesor.nombre,
        ...clasesDelProfesor(profesor, clases).map((p) => p.clase.nombre),
      ]}
      idsAgregados={idsAgregados}
      contenidoFila={(profesor, consulta) => (
        <FilaProfesor
          profesor={profesor}
          clases={clasesDelProfesor(profesor, clases)}
          consulta={consulta}
        />
      )}
      chip={(profesor, quitar) => (
        <ChipProfesor
          profesor={profesor}
          clases={clasesDelProfesor(profesor, clases)}
          onQuitar={quitar}
        />
      )}
      onConfirmar={onConfirmar}
      onCerrar={onCerrar}
    />
  )
}

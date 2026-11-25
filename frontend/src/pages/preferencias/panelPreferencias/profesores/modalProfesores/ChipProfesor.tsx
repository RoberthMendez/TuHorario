import type {
  PreferenciaClase,
  Profesor,
} from '../../../../../types/Preferencias'
import { FONDO_PASTEL } from '../../../../../styles/colores'
import ChipSeleccion from '../../modalSeleccion/ChipSeleccion'

interface ChipProfesorProps {
  profesor: Profesor
  clases: PreferenciaClase[]
  onQuitar: () => void
}

// Profesor elegido en el modal: nombre y su (primera) asignatura.
export default function ChipProfesor({
  profesor,
  clases,
  onQuitar,
}: ChipProfesorProps) {
  const [primera] = clases
  return (
    <ChipSeleccion
      fondo={FONDO_PASTEL[primera?.color ?? 'titan-white']}
      etiquetaQuitar={`Quitar a ${profesor.nombre} de la selección`}
      onQuitar={onQuitar}
    >
      <span className="font-jakarta text-13 font-extrabold text-bunting">
        {profesor.nombre}
      </span>
      {primera && (
        <span className="font-dm-sans text-11 text-east-bay">
          {primera.clase.nombre}
          {clases.length > 1 && ` +${clases.length - 1}`}
        </span>
      )}
    </ChipSeleccion>
  )
}

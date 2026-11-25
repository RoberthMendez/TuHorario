import type { Clase } from '../../../../../types/Preferencias'
import { colorDeClase, FONDO_PASTEL } from '../../../../../styles/colores'
import ChipSeleccion from '../../modalSeleccion/ChipSeleccion'

interface ChipClaseProps {
  clase: Clase
  onQuitar: () => void
}

// Clase elegida en el modal: nombre y código.
export default function ChipClase({ clase, onQuitar }: ChipClaseProps) {
  return (
    <ChipSeleccion
      fondo={FONDO_PASTEL[colorDeClase(clase.id)]}
      etiquetaQuitar={`Quitar ${clase.nombre} (${clase.codigo}) de la selección`}
      onQuitar={onQuitar}
    >
      <span className="font-jakarta text-13 font-extrabold text-bunting">
        {clase.nombre}
      </span>
      <span className="font-dm-sans text-11 text-east-bay">{clase.codigo}</span>
    </ChipSeleccion>
  )
}

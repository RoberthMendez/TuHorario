import {
  FONDO_ACENTO,
  FONDO_PASTEL,
  colorDeClase,
} from '../../../../../styles/colores'
import type { Clase } from '../../../../../types/Preferencias'

interface ChipClaseProps {
  clase: Clase
}

// La clase como pastilla, con su color (el mismo del cronograma y de
// Preferencias).
export default function ChipClase({ clase }: ChipClaseProps) {
  const color = colorDeClase(clase.id)
  return (
    <span
      className={`inline-flex h-7 max-w-full min-w-0 items-center gap-1.5 rounded-full border-[1.5px] border-bunting px-2.5 ${FONDO_PASTEL[color]}`}
    >
      <span
        className={`size-2.5 shrink-0 rounded-full border-[1.333px] border-bunting ${FONDO_ACENTO[color]}`}
      />
      <span className="truncate font-jakarta text-13 font-extrabold text-bunting">
        {clase.nombre}
      </span>
    </span>
  )
}

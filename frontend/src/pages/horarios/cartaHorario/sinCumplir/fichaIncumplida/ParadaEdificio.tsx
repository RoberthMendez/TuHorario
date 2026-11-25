import type { Parada } from '../../../../../types/HorarioEstudiante'
import ChipClase from './ChipClase'

interface ParadaEdificioProps {
  parada: Parada
}

// Una parada del recorrido: la clase y, debajo, el edificio donde se dicta.
export default function ParadaEdificio({ parada }: ParadaEdificioProps) {
  return (
    <span className="inline-flex max-w-full min-w-0 flex-col items-start gap-1">
      <ChipClase clase={parada.clase} />
      <span className="max-w-full truncate pl-1 font-dm-sans text-12 font-bold text-east-bay">
        {parada.edificio}
      </span>
    </span>
  )
}

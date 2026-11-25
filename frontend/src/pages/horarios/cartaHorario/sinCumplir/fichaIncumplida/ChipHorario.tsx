import type { Dia } from '../../../../../types/Horario'
import { abreviaturaDia } from './horas'

interface ChipHorarioProps {
  dia: Dia
  /** Las horas ya escritas ("9 – 11 a. m."). */
  horas: string
}

// Cuándo: el día abreviado en una pastilla índigo y las horas al lado.
export default function ChipHorario({ dia, horas }: ChipHorarioProps) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full border-[1.5px] border-bunting bg-white pr-2.5 pl-0.75 font-dm-sans text-12 font-bold whitespace-nowrap text-bunting">
      <span className="rounded-full bg-bunting px-1.5 py-0.25 font-jakarta text-11 font-extrabold tracking-etiqueta text-white">
        {abreviaturaDia(dia)}
      </span>
      {horas}
    </span>
  )
}

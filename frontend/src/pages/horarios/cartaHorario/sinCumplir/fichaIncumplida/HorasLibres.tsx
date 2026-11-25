import type {
  CursoAsignado,
  NoCumplida,
} from '../../../../../types/HorarioEstudiante'
import ChipHorario from './ChipHorario'
import { rangoHoras } from './horas'
import LineaDia from './LineaDia'
import PiezasFicha from './PiezasFicha'
import TituloFicha from './TituloFicha'

interface HorasLibresProps {
  preferencia: NoCumplida<'horasLibres'>
  /** Cursos del estudiante, para dibujar su día. */
  cursos: CursoAsignado[]
}

// Horas libres entre clases de un mismo día, con el día dibujado en una línea.
export default function HorasLibres({ preferencia, cursos }: HorasLibresProps) {
  const { dia, horas, tramos } = preferencia
  return (
    <>
      <TituloFicha>
        {horas} {horas === 1 ? 'hora libre' : 'horas libres'} entre clases
      </TituloFicha>
      <PiezasFicha>
        <ChipHorario
          dia={dia}
          horas={tramos
            .map((t) => rangoHoras(t.horaInicio, t.horaFin))
            .join(' · ')}
        />
      </PiezasFicha>
      <LineaDia dia={dia} cursos={cursos} />
    </>
  )
}

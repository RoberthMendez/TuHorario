import type { NoCumplida } from '../../../../../types/HorarioEstudiante'
import ChipClase from './ChipClase'
import InsigniaFicha from './InsigniaFicha'
import PiezasFicha from './PiezasFicha'
import TituloFicha from './TituloFicha'

interface ClaseSinCupoProps {
  preferencia: NoCumplida<'claseSinCupo'>
}

// Una clase pedida que no entró en el horario (y si era prioritaria).
export default function ClaseSinCupo({ preferencia }: ClaseSinCupoProps) {
  return (
    <>
      <TituloFicha>No cupo en tu horario</TituloFicha>
      <PiezasFicha>
        <ChipClase clase={preferencia.clase} />
        {preferencia.prioridad && (
          <InsigniaFicha>Era prioritaria</InsigniaFicha>
        )}
      </PiezasFicha>
    </>
  )
}

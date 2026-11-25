import type { NoCumplida } from '../../../../../types/HorarioEstudiante'
import ChipClase from './ChipClase'
import ChipHorario from './ChipHorario'
import { rangoHoras } from './horas'
import PiezasFicha from './PiezasFicha'
import TituloFicha from './TituloFicha'

interface FueraDeFranjaProps {
  preferencia: NoCumplida<'fueraDeFranja'>
}

// Una sesión que cae (toda o en parte) fuera de las franjas habilitadas.
export default function FueraDeFranja({ preferencia }: FueraDeFranjaProps) {
  const { clase, dia, horaInicio, horaFin, parcial } = preferencia
  return (
    <>
      <TituloFicha>
        {parcial
          ? 'Se sale un poco de tus franjas'
          : 'Quedó fuera de tus franjas'}
      </TituloFicha>
      <PiezasFicha>
        <ChipClase clase={clase} />
        <ChipHorario dia={dia} horas={rangoHoras(horaInicio, horaFin)} />
      </PiezasFicha>
    </>
  )
}

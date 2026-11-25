import type { NoCumplida } from '../../../../../types/HorarioEstudiante'
import ChipHorario from './ChipHorario'
import FlechaRecorrido from './FlechaRecorrido'
import { horaCorta } from './horas'
import ParadaEdificio from './ParadaEdificio'
import ParejaFicha from './ParejaFicha'
import PiezasFicha from './PiezasFicha'
import TituloFicha from './TituloFicha'

interface SinDescansoProps {
  preferencia: NoCumplida<'sinDescanso'>
}

// Dos clases seguidas en edificios distintos: el recorrido de uno al otro.
export default function SinDescanso({ preferencia }: SinDescansoProps) {
  const { dia, hora, desde, hasta } = preferencia
  return (
    <>
      <TituloFicha>Sin tiempo para cambiar de edificio</TituloFicha>
      <PiezasFicha>
        <ChipHorario dia={dia} horas={`A las ${horaCorta(hora)}`} />
      </PiezasFicha>
      <ParejaFicha
        arriba
        sangria="ml-3"
        primero={<ParadaEdificio parada={desde} />}
        signo={<FlechaRecorrido />}
        segundo={<ParadaEdificio parada={hasta} />}
      />
    </>
  )
}

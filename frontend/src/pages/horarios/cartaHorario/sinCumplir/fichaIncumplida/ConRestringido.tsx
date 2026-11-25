import { primerNombre } from '../../../../../components/avatarCompanero/iniciales'
import { FONDO_COMPANERO } from '../../../../../styles/colores'
import type { NoCumplida } from '../../../../../types/HorarioEstudiante'
import ChipClase from './ChipClase'
import InsigniaFicha from './InsigniaFicha'
import ParejaFicha from './ParejaFicha'
import PiezasFicha from './PiezasFicha'
import PuestoEstudiante from './PuestoEstudiante'
import SignoComparacion from './SignoComparacion'
import TituloFicha from './TituloFicha'

interface ConRestringidoProps {
  preferencia: NoCumplida<'conRestringido'>
  /** Nombre del dueño del horario (el "Tú"). */
  estudiante: string
}

// "Quedaste con Eva": lo contrario de un compañero que no se cumplió. Los dos
// puestos llevan el mismo curso, unidos por un = en rojo.
export default function ConRestringido({
  preferencia,
  estudiante,
}: ConRestringidoProps) {
  const { clase, restringido, curso } = preferencia
  const nombre = primerNombre(restringido.nombre)
  return (
    <>
      <TituloFicha>Quedaste con {nombre}</TituloFicha>
      <PiezasFicha>
        <ChipClase clase={clase} />
        <InsigniaFicha>No querías coincidir</InsigniaFicha>
      </PiezasFicha>
      <ParejaFicha
        sangria="ml-1"
        primero={
          <PuestoEstudiante
            nombre={estudiante}
            etiqueta="Tú"
            fondo="bg-supernova"
            curso={curso}
            sinCurso="No quedaste"
          />
        }
        signo={<SignoComparacion signo="igual" />}
        segundo={
          <PuestoEstudiante
            nombre={restringido.nombre}
            etiqueta={nombre}
            fondo={FONDO_COMPANERO[restringido.id % FONDO_COMPANERO.length]}
            curso={curso}
            sinCurso="No quedó"
          />
        }
      />
    </>
  )
}

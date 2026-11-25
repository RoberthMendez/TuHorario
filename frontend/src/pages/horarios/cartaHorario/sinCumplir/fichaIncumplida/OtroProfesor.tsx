import type { NoCumplida } from '../../../../../types/HorarioEstudiante'
import ChipClase from './ChipClase'
import FichaProfesor from './FichaProfesor'
import ParejaFicha from './ParejaFicha'
import PiezasFicha from './PiezasFicha'
import SignoComparacion from './SignoComparacion'
import TituloFicha from './TituloFicha'

interface OtroProfesorProps {
  preferencia: NoCumplida<'otroProfesor'>
}

// Te tocó un profesor con menos nota que el que preferías: los dos, cara a
// cara, con su calificación.
export default function OtroProfesor({ preferencia }: OtroProfesorProps) {
  const { clase, profesor, preferido } = preferencia
  return (
    <>
      <TituloFicha>No te tocó el profe que preferías</TituloFicha>
      <PiezasFicha>
        <ChipClase clase={clase} />
      </PiezasFicha>
      <ParejaFicha
        sangria="ml-2.5"
        primero={
          <FichaProfesor profesor={profesor} rotulo="Te tocó" clase={clase} />
        }
        signo={<SignoComparacion signo="distinto" />}
        segundo={
          <FichaProfesor
            profesor={preferido}
            rotulo="Preferías"
            clase={clase}
          />
        }
      />
    </>
  )
}

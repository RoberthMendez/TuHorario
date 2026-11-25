import type { NoCumplida } from '../../../../../types/HorarioEstudiante'
import ChipClase from './ChipClase'
import FichaProfesor from './FichaProfesor'
import PiezasFicha from './PiezasFicha'
import TituloFicha from './TituloFicha'

interface ProfesorVetadoProps {
  preferencia: NoCumplida<'profesorVetado'>
}

// Te tocó un profesor que calificaste con 0: su cara triste y en gris.
export default function ProfesorVetado({ preferencia }: ProfesorVetadoProps) {
  return (
    <>
      <TituloFicha>Te tocó a quien no querías</TituloFicha>
      <PiezasFicha>
        <ChipClase clase={preferencia.clase} />
      </PiezasFicha>
      <PiezasFicha>
        <FichaProfesor
          profesor={preferencia.profesor}
          rotulo="Te tocó"
          clase={preferencia.clase}
        />
      </PiezasFicha>
    </>
  )
}

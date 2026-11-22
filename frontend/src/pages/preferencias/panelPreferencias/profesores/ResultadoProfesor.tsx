import type { ColorPastel } from '../../../../types/Preferencias'
import { FONDO_PASTEL } from '../colores'
import TextoCoincidencia from '../TextoCoincidencia'

interface ResultadoProfesorProps {
  nombre: string
  consulta: string
  color: ColorPastel
}

export default function ResultadoProfesor({
  nombre,
  consulta,
  color,
}: ResultadoProfesorProps) {
  return (
    <li
      className={`flex h-10.75 cursor-pointer items-center border-b-[1.5px] border-bunting/12 px-4 transition-[padding] duration-200 last:border-b-0 hover:pl-5.5 ${FONDO_PASTEL[color]}`}
    >
      <TextoCoincidencia texto={nombre} consulta={consulta} />
    </li>
  )
}

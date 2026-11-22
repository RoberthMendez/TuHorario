import type { CSSProperties, ReactNode } from 'react'
import { DIAS_SEMANA, HORA_INICIO_ILUSTRACION } from '../../../data/semana'
import type { Horario } from '../../../types/Horario'
import type { BloqueHorario } from '../../../types/BloqueHorario'
import BloqueClase from './BloqueClase'
import ColumnaHoras from './ColumnaHoras'
import EncabezadoDias from './EncabezadoDias'

function ubicacionEnCuadricula(horario: Horario): CSSProperties {
  const columna = DIAS_SEMANA.findIndex(({ dia }) => dia === horario.dia) + 1
  const fila = (hora: string) =>
    Number.parseInt(hora, 10) - HORA_INICIO_ILUSTRACION + 1
  return {
    gridColumn: columna,
    gridRow: `${fila(horario.horaInicio)} / ${fila(horario.horaFin)}`,
  }
}

interface IlustracionHorarioProps {
  bloques: BloqueHorario[]
  /** Elementos superpuestos, posicionados respecto a la tarjeta. */
  children?: ReactNode
}

export default function IlustracionHorario({
  bloques,
  children,
}: IlustracionHorarioProps) {
  return (
    <div className="relative h-141 w-178 rounded-tarjeta border-2 border-madison bg-zircon shadow-tarjeta">
      <EncabezadoDias />
      <ColumnaHoras />
      <div className="absolute top-12 left-12 grid h-124 w-162 grid-cols-6 grid-rows-8 bg-[linear-gradient(to_right,var(--color-linea-horario)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-linea-horario)_1px,transparent_1px)] bg-size-[calc(100%/6)_calc(100%/8)]">
        {bloques.map((bloque) => (
          <BloqueClase
            key={bloque.id}
            bloque={bloque}
            className="mx-1 my-0.75"
            style={ubicacionEnCuadricula(bloque.horario)}
          />
        ))}
      </div>
      {children}
    </div>
  )
}

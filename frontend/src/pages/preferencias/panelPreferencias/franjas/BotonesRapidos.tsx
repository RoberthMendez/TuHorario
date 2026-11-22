import iconoLimpiar from '../../../../assets/franjas/icono-limpiar.svg'
import iconoMananas from '../../../../assets/franjas/icono-mananas.svg'
import iconoSeleccionarTodo from '../../../../assets/franjas/icono-seleccionar-todo.svg'
import iconoTardes from '../../../../assets/franjas/icono-tardes.svg'
import BotonRapido from './BotonRapido'
import { MANANAS, TARDES, TODAS } from './horas'

interface BotonesRapidosProps {
  /** Reemplaza las horas marcadas por estas. */
  onMarcar: (horas: Set<string>) => void
}

export default function BotonesRapidos({ onMarcar }: BotonesRapidosProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <BotonRapido
        icono={iconoMananas}
        texto="Solo mañanas"
        onClick={() => onMarcar(MANANAS)}
      />
      <BotonRapido
        icono={iconoTardes}
        texto="Solo tardes"
        onClick={() => onMarcar(TARDES)}
      />
      <BotonRapido
        icono={iconoSeleccionarTodo}
        texto="Seleccionar todo"
        onClick={() => onMarcar(TODAS)}
      />
      <BotonRapido
        icono={iconoLimpiar}
        texto="Limpiar"
        onClick={() => onMarcar(new Set())}
        peligro
      />
    </div>
  )
}

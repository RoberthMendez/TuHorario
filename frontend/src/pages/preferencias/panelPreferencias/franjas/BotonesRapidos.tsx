import iconoLimpiar from '../../../../assets/franjas/icono-limpiar.svg'
import iconoMananas from '../../../../assets/franjas/icono-mananas.svg'
import iconoSeleccionarTodo from '../../../../assets/franjas/icono-seleccionar-todo.svg'
import iconoTardes from '../../../../assets/franjas/icono-tardes.svg'
import BotonRapido from './BotonRapido'

export default function BotonesRapidos() {
  return (
    <div className="flex flex-wrap gap-3">
      <BotonRapido icono={iconoMananas} texto="Solo mañanas" />
      <BotonRapido icono={iconoTardes} texto="Solo tardes" />
      <BotonRapido icono={iconoSeleccionarTodo} texto="Seleccionar todo" />
      <BotonRapido icono={iconoLimpiar} texto="Limpiar" peligro />
    </div>
  )
}

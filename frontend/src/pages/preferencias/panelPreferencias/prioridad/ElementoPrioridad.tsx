import iconoArrastrar from '../../../../assets/prioridad/icono-arrastrar.svg'
import type { PrioridadPreferencias } from '../../../../types/Preferencias'

interface ElementoPrioridadProps {
  prioridad: PrioridadPreferencias
  colores: { fondo: string; numero: string }
}

// Bloque arrastrable de la lista de prioridades (arrastre todavía sin lógica).
export default function ElementoPrioridad({
  prioridad,
  colores,
}: ElementoPrioridadProps) {
  return (
    <div
      className={`flex min-h-15.75 cursor-grab items-center gap-3.5 rounded-caja border-2 border-bunting py-2 pr-6.5 pl-3.5 shadow-base-4 transition-[translate,rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:rotate-[-0.6deg] active:cursor-grabbing ${colores.fondo}`}
    >
      <span
        className={`flex size-8.5 shrink-0 items-center justify-center rounded-full border-2 border-bunting font-jakarta text-15 font-extrabold text-bunting ${colores.numero}`}
      >
        {prioridad.prioridad}
      </span>
      <span className="font-jakarta text-16 font-extrabold text-bunting">
        {prioridad.tipoPreferencia}
      </span>
      <img src={iconoArrastrar} alt="" className="ml-auto size-5 shrink-0" />
    </div>
  )
}

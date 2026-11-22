import type { KeyboardEvent, PointerEvent } from 'react'
import iconoArrastrar from '../../../../assets/prioridad/icono-arrastrar.svg'
import type { PrioridadPreferencias } from '../../../../types/Preferencias'

interface ElementoPrioridadProps {
  prioridad: PrioridadPreferencias
  total: number
  colores: { fondo: string; numero: string }
  /** Se está arrastrando: va levantado e inclinado. */
  arrastrando: boolean
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
}

/*
 * Bloque de la lista de prioridades. Se arrastra con el mouse desde
 * cualquier parte (en el celular, desde los puntitos de la derecha, para no
 * estorbar el scroll) o se mueve con las flechas del teclado.
 */
export default function ElementoPrioridad({
  prioridad,
  total,
  colores,
  arrastrando,
  onPointerDown,
  onKeyDown,
}: ElementoPrioridadProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-roledescription="elemento arrastrable"
      aria-label={`${prioridad.tipoPreferencia}: puesto ${prioridad.prioridad} de ${total}. Usa las flechas arriba y abajo para moverlo.`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={`relative flex min-h-15.75 items-center gap-3.5 rounded-caja border-2 border-bunting py-2 pr-6.5 pl-3.5 select-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sapphire ${colores.fondo} ${
        arrastrando
          ? 'z-10 scale-[1.03] -rotate-1 cursor-grabbing shadow-[0_calc(var(--u)*12)_0_var(--color-bunting)] transition-[scale,rotate,box-shadow] duration-200'
          : 'cursor-grab shadow-base-4 transition-[translate,rotate,scale,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:rotate-[-0.6deg]'
      }`}
    >
      <span
        key={prioridad.prioridad}
        className={`flex size-8.5 shrink-0 animate-pop items-center justify-center rounded-full border-2 border-bunting font-jakarta text-15 font-extrabold text-bunting motion-reduce:animate-none ${colores.numero}`}
      >
        {prioridad.prioridad}
      </span>
      <span className="font-jakarta text-16 font-extrabold text-bunting">
        {prioridad.tipoPreferencia}
      </span>
      <span
        data-asa
        className="-my-2 -mr-4 ml-auto flex touch-none items-center self-stretch px-2"
      >
        <img src={iconoArrastrar} alt="" className="size-5 shrink-0" />
      </span>
    </div>
  )
}

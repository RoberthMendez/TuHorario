import type { Ref } from 'react'

interface BotonEliminarProps {
  ref?: Ref<HTMLButtonElement>
  nombre: string
  /** Ya se está pidiendo confirmación: queda marcado en rojo. */
  activo: boolean
  idConfirmacion: string
  onClick: () => void
}

/*
 * Caneca discreta en la cabecera de la carta. Al pasarle el mouse se pone
 * roja y la tapa se levanta; no elimina de una, abre la confirmación.
 */
export default function BotonEliminar({
  ref,
  nombre,
  activo,
  idConfirmacion,
  onClick,
}: BotonEliminarProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={activo}
      aria-controls={idConfirmacion}
      aria-label={`Eliminar a ${nombre}`}
      title="Eliminar estudiante"
      className={`group/eliminar flex size-9.5 shrink-0 cursor-pointer items-center justify-center rounded-icono border-[1.5px] transition-[translate,background-color,border-color,color] duration-200 hover:-translate-y-0.5 hover:border-alizarin hover:bg-fair-pink hover:text-alizarin focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire ${
        activo
          ? 'border-alizarin bg-fair-pink text-alizarin'
          : 'border-transparent text-casper'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="size-5 overflow-visible"
      >
        <g
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Tapa: se levanta e inclina con rebote. */}
          <path
            d="M4 6.5H20M9.5 6.5V4.5H14.5V6.5"
            className={`origin-[20px_6.5px] transition-[translate,rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/eliminar:-translate-y-0.5 group-hover/eliminar:rotate-12 ${
              activo ? '-translate-y-0.5 rotate-12' : ''
            }`}
          />
          <path d="M6 6.5L7 19.5C7 20.3 7.7 21 8.5 21H15.5C16.3 21 17 20.3 17 19.5L18 6.5M10 10.5V17M14 10.5V17" />
        </g>
      </svg>
    </button>
  )
}

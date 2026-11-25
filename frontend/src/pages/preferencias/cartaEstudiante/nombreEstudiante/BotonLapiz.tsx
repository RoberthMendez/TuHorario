import type { Ref } from 'react'

interface BotonLapizProps {
  ref?: Ref<HTMLButtonElement>
  nombre: string
  onClick: () => void
}

/*
 * Lápiz discreto junto al nombre (antes del ojo): gris claro, y al pasarle
 * el mouse se pone azul y "escribe" (se inclina con rebote).
 */
export default function BotonLapiz({ ref, nombre, onClick }: BotonLapizProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={`Editar el nombre de ${nombre}`}
      title="Editar nombre"
      className="group/lapiz flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-casper transition-colors hover:bg-zircon-21 hover:text-sapphire focus-visible:outline-2 focus-visible:outline-sapphire"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="size-4.5 origin-[20%_80%] transition-[rotate,translate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/lapiz:-translate-y-px group-hover/lapiz:-rotate-12 motion-reduce:transition-none"
      >
        <path
          d="M4 20L4.8 16.2L15.6 5.4C16.4 4.6 17.6 4.6 18.4 5.4L18.6 5.6C19.4 6.4 19.4 7.6 18.6 8.4L7.8 19.2L4 20ZM14 7L17 10"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

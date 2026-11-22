import type { ReactNode } from 'react'

interface ChipSeleccionProps {
  /** Clase de fondo pastel (p. ej. `bg-beeswax`). */
  fondo: string
  etiquetaQuitar: string
  onQuitar: () => void
  children: ReactNode
}

// Elemento elegido en el modal, con una x para soltarlo.
export default function ChipSeleccion({
  fondo,
  etiquetaQuitar,
  onQuitar,
  children,
}: ChipSeleccionProps) {
  return (
    <span
      className={`flex h-7.5 animate-entrar-chip items-center gap-1.5 rounded-full border-[1.5px] border-bunting pr-1 pl-3 ${fondo}`}
    >
      {children}
      <button
        type="button"
        onClick={onQuitar}
        aria-label={etiquetaQuitar}
        className="flex size-5.5 cursor-pointer items-center justify-center rounded-full text-bunting transition-colors hover:bg-white/70 hover:text-alizarin"
      >
        <svg viewBox="0 0 13 13" fill="none" aria-hidden className="size-3">
          <path
            d="M3.25 3.25L9.75 9.75M9.75 3.25L3.25 9.75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </span>
  )
}

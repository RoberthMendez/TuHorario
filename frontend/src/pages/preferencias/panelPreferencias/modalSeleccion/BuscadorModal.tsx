import type { Ref } from 'react'
import iconoBuscar from '../../../../assets/profesores/icono-buscar.svg'

interface BuscadorModalProps {
  ref?: Ref<HTMLInputElement>
  valor: string
  onCambiar: (valor: string) => void
  /** Enter: elegir el primer resultado. */
  onEnter: () => void
  /** Resultados visibles (`null` mientras cargan). */
  cantidad: number | null
  unidad: [singular: string, plural: string]
  placeholder: string
  etiqueta: string
}

export default function BuscadorModal({
  ref,
  valor,
  onCambiar,
  onEnter,
  cantidad,
  unidad,
  placeholder,
  etiqueta,
}: BuscadorModalProps) {
  return (
    <div className="flex h-13 items-center gap-2.5 rounded-bloque border-2 border-bunting bg-white px-4 transition-shadow focus-within:shadow-[0_0_0_calc(var(--u)*4)_var(--color-hawkes-blue)]">
      <img src={iconoBuscar} alt="" className="size-5.5 shrink-0" />
      <input
        ref={ref}
        type="search"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onEnter()
          }
        }}
        placeholder={placeholder}
        aria-label={etiqueta}
        autoComplete="off"
        spellCheck={false}
        className="h-full min-w-0 flex-1 bg-transparent font-dm-sans text-16 font-medium text-bunting caret-sapphire outline-none placeholder:font-normal placeholder:text-east-bay/60 [&::-webkit-search-cancel-button]:hidden"
      />
      {valor.trim() !== '' && (
        <button
          type="button"
          onClick={() => onCambiar('')}
          aria-label="Borrar búsqueda"
          className="flex size-6 shrink-0 animate-pop cursor-pointer items-center justify-center rounded-full bg-zircon-21 text-east-bay transition-colors hover:bg-link-water hover:text-bunting"
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
      )}
      {cantidad !== null && (
        <span
          aria-live="polite"
          className="shrink-0 font-dm-sans text-12 font-bold whitespace-nowrap text-east-bay"
        >
          {cantidad} {cantidad === 1 ? unidad[0] : unidad[1]}
        </span>
      )}
    </div>
  )
}

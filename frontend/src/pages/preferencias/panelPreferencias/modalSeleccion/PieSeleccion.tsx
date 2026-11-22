import type { ReactNode } from 'react'

interface PieSeleccionProps {
  cantidad: number
  unidad: [singular: string, plural: string]
  pista: string
  /** Chips de lo elegido (cada uno ya envuelto en su `<li>`). */
  chips: ReactNode
  onCancelar: () => void
  onConfirmar: () => void
}

// Parte de abajo del modal: lo elegido (chips que se pueden quitar) y los
// botones para cancelar o añadir todo.
export default function PieSeleccion({
  cantidad: n,
  unidad,
  pista,
  chips,
  onCancelar,
  onConfirmar,
}: PieSeleccionProps) {
  return (
    <footer className="rounded-b-[calc(var(--radius-tarjeta)-2px)] border-t-2 border-bunting bg-zircon-10 px-5 py-4 sm:px-7">
      {n === 0 ? (
        <p className="font-dm-sans text-13 text-east-bay">
          {pista}{' '}
          <span className="hidden sm:inline">
            También puedes escribir y presionar Enter.
          </span>
        </p>
      ) : (
        <div>
          <p className="font-dm-sans text-12 font-bold tracking-etiqueta text-east-bay uppercase">
            Elegidos ({n})
          </p>
          {/* Margen interno (compensado con margen negativo) para que los chips
              no se salgan de la caja al animarse y no aparezca scroll. */}
          <ul className="barra-scroll -mx-1.5 mt-0.5 -mb-1 flex max-h-22 flex-wrap gap-2 overflow-x-hidden overflow-y-auto p-1.5">
            {chips}
          </ul>
        </div>
      )}
      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="h-10.5 cursor-pointer rounded-icono px-4 font-dm-sans text-15 font-bold text-east-bay transition-colors hover:bg-link-water hover:text-bunting focus-visible:outline-2 focus-visible:outline-sapphire"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirmar}
          disabled={n === 0}
          className="boton-3d h-10.5 rounded-icono border-2 border-bunting bg-buttercup px-5 font-jakarta text-15 font-extrabold text-bunting [--boton-3d-altura:4] [--boton-3d-color:var(--color-bunting)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire disabled:pointer-events-none disabled:opacity-45"
        >
          {n === 0
            ? `Añadir ${unidad[1]}`
            : `Añadir ${n} ${n === 1 ? unidad[0] : unidad[1]}`}
        </button>
      </div>
    </footer>
  )
}

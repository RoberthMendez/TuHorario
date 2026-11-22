import type { ReactNode } from 'react'
import iconoCheck from '../../../../assets/companeros/icono-check-blanco.svg'

interface FilaSeleccionProps {
  seleccionada: boolean
  /** Ya está agregado: se muestra, pero no se puede elegir. */
  agregada: boolean
  textoAgregada: string
  onAlternar: () => void
  /** Contenido propio de cada lista (ficha, nombre, detalle). */
  children: ReactNode
}

// Fila de la lista del modal: se marca al tocarla (círculo con check).
// El contenido usa `group-hover/fila:` para reaccionar al pasar el mouse.
export default function FilaSeleccion({
  seleccionada,
  agregada,
  textoAgregada,
  onAlternar,
  children,
}: FilaSeleccionProps) {
  const estilo = agregada
    ? 'cursor-not-allowed border-transparent bg-zircon-10 opacity-60'
    : seleccionada
      ? 'cursor-pointer border-sapphire bg-zircon-21'
      : 'cursor-pointer border-transparent bg-white hover:border-link-water-27 hover:bg-zircon-10'

  return (
    <button
      type="button"
      onClick={onAlternar}
      disabled={agregada}
      aria-pressed={seleccionada}
      className={`group/fila flex w-full items-center gap-3 rounded-bloque border-2 px-3 py-2.25 text-left transition-[background-color,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sapphire ${estilo}`}
    >
      {children}
      {agregada ? (
        <span className="ml-auto shrink-0 rounded-full bg-link-water px-2.5 py-0.5 font-dm-sans text-12 font-bold text-east-bay">
          {textoAgregada}
        </span>
      ) : (
        <span
          aria-hidden
          className={`ml-auto flex size-6.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
            seleccionada
              ? 'border-bunting bg-sapphire'
              : 'border-periwinkle-gray bg-white group-hover/fila:border-sapphire'
          }`}
        >
          {seleccionada && (
            <img src={iconoCheck} alt="" className="size-3.5 animate-pop" />
          )}
        </span>
      )}
    </button>
  )
}

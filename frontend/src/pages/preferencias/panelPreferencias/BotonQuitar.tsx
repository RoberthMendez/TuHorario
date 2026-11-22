interface BotonQuitarProps {
  /** Texto para lectores de pantalla, p. ej. "Quitar Cálculo". */
  etiqueta: string
  /** Tooltip, p. ej. "Quitar clase". */
  titulo: string
  onQuitar: () => void
}

// X para quitar un elemento (clase, profesor…): aparece al pasar el mouse por la clase; al
// ponerle el mouse encima el fondo se tiñe de rojo pastel y la X se pone roja
// (SVG del diseño en línea para poder cambiarle el color).
export default function BotonQuitar({
  etiqueta,
  titulo,
  onQuitar,
}: BotonQuitarProps) {
  return (
    <button
      type="button"
      onClick={onQuitar}
      aria-label={etiqueta}
      title={titulo}
      className="pointer-events-none absolute -top-2 -right-2 flex size-7 cursor-pointer items-center justify-center rounded-bloque border-[1.5px] border-bunting bg-white text-bunting opacity-0 transition-[background-color,border-color,color,scale] duration-200 [will-change:scale] group-has-focus-visible:pointer-events-auto group-has-focus-visible:opacity-100 group-hover:pointer-events-auto group-hover:animate-pop group-hover:opacity-100 hover:scale-110 hover:border-alizarin hover:bg-fair-pink hover:text-alizarin focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire"
    >
      <svg viewBox="0 0 13 13" fill="none" aria-hidden className="size-3.25">
        <path
          d="M3.25 3.25L9.75 9.75M9.75 3.25L3.25 9.75"
          stroke="currentColor"
          strokeWidth="1.73333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

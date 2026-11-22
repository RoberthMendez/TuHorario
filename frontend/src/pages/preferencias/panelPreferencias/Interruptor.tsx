interface InterruptorProps {
  etiqueta: string
  activo: boolean
  onCambiar: (activo: boolean) => void
  /** `grande`: el de "Horario sin huecos" (100 × 44 en el diseño). */
  grande?: boolean
}

const icono = {
  // X del diseño (icono-interruptor.svg) y un chulito con el mismo trazo.
  no: 'M4.08333 4.08333L9.91667 9.91667M9.91667 4.08333L4.08333 9.91667',
  si: 'M3.5 7.2L6 9.7L10.5 4.6',
}

/*
 * Interruptor SÍ/NO del diseño. Apagado: perilla a la izquierda con la X y
 * "NO". Encendido: la perilla salta a la derecha con un chulito, el fondo se
 * pone amarillo y dice "SÍ".
 */
export default function Interruptor({
  etiqueta,
  activo,
  onCambiar,
  grande = false,
}: InterruptorProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      onClick={() => onCambiar(!activo)}
      className={`relative shrink-0 cursor-pointer rounded-full border-2 border-bunting transition-[background-color,translate] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sapphire ${
        grande ? 'h-11 w-25 shadow-base-4' : 'h-10 w-23.5 shadow-base-3'
      } ${activo ? 'bg-supernova' : grande ? 'bg-link-water' : 'bg-zircon-21'}`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 flex items-center justify-center font-dm-sans text-14 font-extrabold tracking-[calc(var(--u)*0.56)] transition-opacity duration-200 ${
          grande ? 'right-0 left-11' : 'right-0 left-8.5'
        } ${grande ? 'text-east-bay' : 'text-bunting'} ${activo ? 'opacity-0' : 'opacity-100'}`}
      >
        NO
      </span>
      <span
        aria-hidden
        className={`absolute inset-y-0 flex items-center justify-center font-dm-sans text-14 font-extrabold tracking-[calc(var(--u)*0.56)] text-bunting transition-opacity duration-200 ${
          grande ? 'right-11 left-0' : 'right-8.5 left-0'
        } ${activo ? 'opacity-100' : 'opacity-0'}`}
      >
        SÍ
      </span>
      <span
        className={`absolute top-1/2 left-0.75 flex -translate-y-1/2 items-center justify-center rounded-full border-2 border-bunting bg-white transition-[translate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          grande ? 'h-8 w-9.5' : 'size-7'
        } ${activo ? (grande ? 'translate-x-13' : 'translate-x-14') : ''}`}
      >
        <svg
          key={activo ? 'si' : 'no'}
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
          className={`animate-pop motion-reduce:animate-none ${grande ? 'size-4' : 'size-3.5'}`}
        >
          <path
            d={activo ? icono.si : icono.no}
            stroke="var(--color-bunting)"
            strokeWidth="1.98"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  )
}

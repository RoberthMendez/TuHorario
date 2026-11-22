interface BotonCrearProps {
  /** Mientras se crea el estudiante (respuesta del servicio). */
  creando: boolean
}

// Botón 3D que envía el formulario del nombre (también sirve Enter).
export default function BotonCrear({ creando }: BotonCrearProps) {
  return (
    <button
      type="submit"
      disabled={creando}
      className="group/crear boton-3d flex h-11.25 shrink-0 items-center justify-center gap-2 rounded-icono border-2 border-bunting bg-sapphire px-5 font-dm-sans text-15 font-bold whitespace-nowrap text-white [--boton-3d-altura:4] [--boton-3d-color:var(--color-bunting)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire disabled:cursor-wait disabled:opacity-80"
    >
      <svg
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden
        className={`size-4.5 transition-[rotate,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/crear:scale-125 group-hover/crear:-rotate-12 ${
          creando ? 'animate-spin motion-reduce:animate-none' : ''
        }`}
      >
        {creando ? (
          <circle
            cx="9"
            cy="9"
            r="6"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeDasharray="26 12"
          />
        ) : (
          <path
            d="M3.75 9.375L7.125 12.75L14.25 5.625"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {creando ? 'Creando…' : 'Crear estudiante'}
    </button>
  )
}

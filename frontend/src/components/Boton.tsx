interface BotonProps {
  texto: string
  icono?: string
  onClick?: () => void
  /**
   * `inicio`: estilo de la Landing. `panel`: estilo de las pantallas
   * internas. `claro`: como `panel` pero blanco, para la acción secundaria.
   */
  variante?: 'inicio' | 'panel' | 'claro'
  /** Mientras se espera una respuesta: no responde y muestra cursor de espera. */
  ocupado?: boolean
}

const estilos = {
  inicio: {
    boton:
      'h-20 gap-4.5 rounded-boton border-madison bg-amarillo pr-4 pl-8.5 font-dm-sans text-boton font-bold text-madison',
    caja: 'size-10 bg-madison',
    icono: 'size-5.5',
  },
  panel:
    // La sombra 3D usa el índigo de la paleta Panel.
    {
      boton:
        'h-18.5 gap-7.5 rounded-seccion border-bunting bg-buttercup pr-4 pl-8 font-jakarta text-22 font-extrabold text-bunting [--boton-3d-color:var(--color-bunting)]',
      caja: 'size-10.5 bg-bunting',
      icono: 'size-6',
    },
  claro: {
    boton:
      'h-18.5 gap-7.5 rounded-seccion border-bunting bg-white pr-4 pl-8 font-jakarta text-22 font-extrabold text-bunting [--boton-3d-color:var(--color-bunting)]',
    caja: 'size-10.5 border-2 border-bunting bg-supernova',
    icono: 'size-6',
  },
}

// Botón amarillo con efecto 3D (`boton-3d`, definido en styles/tema.css).
export default function Boton({
  texto,
  icono,
  onClick,
  variante = 'inicio',
  ocupado = false,
}: BotonProps) {
  const estilo = estilos[variante]
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={ocupado}
      aria-busy={ocupado || undefined}
      className={`boton-3d inline-flex shrink-0 items-center border-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cerulean disabled:pointer-events-none disabled:opacity-80 ${estilo.boton}`}
    >
      {texto}
      {icono && (
        <span
          className={`flex items-center justify-center rounded-icono ${estilo.caja} ${ocupado ? 'animate-pulse motion-reduce:animate-none' : ''}`}
        >
          <img src={icono} alt="" className={estilo.icono} />
        </span>
      )}
    </button>
  )
}

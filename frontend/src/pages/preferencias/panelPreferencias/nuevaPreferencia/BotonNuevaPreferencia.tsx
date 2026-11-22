interface BotonNuevaPreferenciaProps {
  abierto: boolean
  onClick: () => void
  /** Id del menú que despliega (aria-controls). */
  idMenu: string
}

/*
 * Versión sutil del botón "Nuevo Estudiante": borde punteado y un "+" en una
 * ficha amarilla pequeña. Abierto, el "+" gira hasta volverse una X.
 */
export default function BotonNuevaPreferencia({
  abierto,
  onClick,
  idMenu,
}: BotonNuevaPreferenciaProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={abierto}
      aria-controls={idMenu}
      className={`group flex min-h-15 w-full cursor-pointer items-center justify-center gap-3 rounded-seccion border-2 border-dashed px-5 py-3 transition-[translate,background-color,border-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sapphire ${
        abierto
          ? 'border-bunting bg-white'
          : 'border-sapphire bg-white/55 hover:bg-white'
      }`}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-bunting bg-supernova">
        <svg
          viewBox="0 0 30 30"
          fill="none"
          aria-hidden
          className={`size-4 transition-[rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            abierto ? 'rotate-45' : 'group-hover:rotate-90'
          }`}
        >
          <path
            d="M15 6.25V23.75M6.25 15H23.75"
            stroke="currentColor"
            strokeWidth="3.75"
            strokeLinecap="round"
            className="text-bunting"
          />
        </svg>
      </span>
      <span className="font-jakarta text-16 font-extrabold text-bunting">
        Nueva preferencia
      </span>
    </button>
  )
}

import type { PreferenciaOpcional } from '../preferenciasOpcionales'

interface OpcionPreferenciaProps {
  opcion: PreferenciaOpcional
  /** Depende de las clases y todavía no hay ninguna. */
  bloqueada: boolean
  onElegir: () => void
}

// Ficha de una preferencia por añadir: ícono de su sección, nombre y para qué
// sirve. Al pasar el mouse se levanta un poco y se inclina. Bloqueada, se ve
// apagada y dice que primero hay que elegir clases.
export default function OpcionPreferencia({
  opcion,
  bloqueada,
  onElegir,
}: OpcionPreferenciaProps) {
  return (
    <button
      type="button"
      onClick={onElegir}
      disabled={bloqueada}
      className="group/opcion flex h-full w-full cursor-pointer items-center gap-3 rounded-caja border-2 border-bunting bg-zircon-10 px-3.5 py-3 text-left transition-[translate,rotate,background-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:rotate-[-0.6deg] hover:bg-beeswax focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire disabled:pointer-events-none disabled:opacity-55"
    >
      <span className="flex size-9.5 shrink-0 items-center justify-center rounded-insignia border-[1.5px] border-bunting bg-supernova transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/opcion:-rotate-12">
        <img src={opcion.icono} alt="" className="size-5.25" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-jakarta text-15 font-extrabold text-bunting">
          {opcion.titulo}
        </span>
        <span
          className={`block font-dm-sans text-13 ${bloqueada ? 'font-bold text-alizarin' : 'text-east-bay'}`}
        >
          {bloqueada ? 'Primero elige tus clases.' : opcion.descripcion}
        </span>
      </span>
      <svg
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden
        className="size-3.5 shrink-0 text-sapphire transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/opcion:rotate-90"
      >
        <path
          d="M15 6.25V23.75M6.25 15H23.75"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

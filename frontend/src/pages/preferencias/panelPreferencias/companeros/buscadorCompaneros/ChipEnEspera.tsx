import { useEffect, useRef, type Ref } from 'react'
import type { Companero } from '../../../../../types/Preferencias'
import AvatarCompanero from '../../../../../components/avatarCompanero/AvatarCompanero'

interface ChipEnEsperaProps {
  companero: Companero
  /** Color propio del compañero (si ya tenía clases). */
  fondo?: string
  /** El muñeco ya salió de aquí rumbo a la caneca. */
  saliendo: boolean
  /** Para que el muñeco salga de las iniciales. */
  refAvatar: Ref<HTMLSpanElement>
  bloqueado: boolean
  onCancelar: () => void
}

/*
 * Compañero elegido, "en espera" dentro del buscador (como un destinatario
 * de correo): un halo que respira y un punto que titila avisan que se está
 * configurando. La X lo suelta sin guardar nada.
 */
export default function ChipEnEspera({
  companero,
  fondo,
  saliendo,
  refAvatar,
  bloqueado,
  onCancelar,
}: ChipEnEsperaProps) {
  const ref = useRef<HTMLDivElement>(null)

  // El input desaparece: el foco pasa al chip para no perderse.
  useEffect(() => ref.current?.focus(), [])

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="flex min-w-0 animate-entrar-chip items-center outline-none"
    >
      <span className="flex min-w-0 animate-respirar items-center gap-2 rounded-full border-[1.5px] border-sapphire bg-zircon-21 py-0.75 pr-1 pl-0.75 motion-reduce:animate-none">
        <AvatarCompanero
          ref={refAvatar}
          nombre={companero.nombre}
          fondo={fondo}
          className={`size-7.5 text-11 transition-[opacity,filter] duration-300 ${saliendo ? 'opacity-25 grayscale' : ''}`}
        />
        <span className="min-w-0 truncate font-dm-sans text-14 font-bold text-bunting">
          {companero.nombre}
          <span className="ml-2 hidden font-medium text-east-bay md:inline">
            {companero.correo}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2 py-0.5 font-dm-sans text-11 font-bold text-east-bay">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-buttercup motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-buttercup" />
          </span>
          En espera
        </span>
        <button
          type="button"
          onClick={onCancelar}
          disabled={bloqueado}
          aria-label={`Soltar a ${companero.nombre} sin guardar`}
          title="Soltar sin guardar"
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-bunting transition-colors hover:bg-fair-pink hover:text-alizarin focus-visible:outline-2 focus-visible:outline-sapphire disabled:pointer-events-none disabled:opacity-40"
        >
          <svg viewBox="0 0 13 13" fill="none" aria-hidden className="size-3">
            <path
              d="M3.25 3.25L9.75 9.75M9.75 3.25L3.25 9.75"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </span>
      <span className="sr-only" aria-live="polite">
        {companero.nombre} en espera. Elige abajo las clases que quieres
        compartir o restringe a {companero.nombre}.
      </span>
    </div>
  )
}

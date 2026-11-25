import type { Companero } from '../../../../../types/Preferencias'
import AvatarCompanero from '../../../../../components/avatarCompanero/AvatarCompanero'

interface FilaRestringidoProps {
  companero: Companero
  onQuitar: () => void
}

export default function FilaRestringido({
  companero,
  onQuitar,
}: FilaRestringidoProps) {
  return (
    <li className="flex animate-entrar-chip items-center gap-2.5 rounded-icono px-2 py-1.5 transition-colors hover:bg-zircon-10">
      <AvatarCompanero
        nombre={companero.nombre}
        className="size-8 text-11 grayscale"
      />
      <span className="min-w-0 flex-1 cursor-default">
        <span className="block truncate font-dm-sans text-14 font-bold text-bunting">
          {companero.nombre}
        </span>
        <span className="block truncate font-dm-sans text-12 text-east-bay">
          {companero.correo}
        </span>
      </span>
      <button
        type="button"
        onClick={onQuitar}
        aria-label={`Quitar la restricción a ${companero.nombre}`}
        className="shrink-0 cursor-pointer rounded-mini px-2 py-1 font-dm-sans text-12 font-bold text-east-bay transition-colors hover:bg-fair-pink hover:text-alizarin-oscuro focus-visible:outline-2 focus-visible:outline-sapphire"
      >
        Quitar
      </button>
    </li>
  )
}

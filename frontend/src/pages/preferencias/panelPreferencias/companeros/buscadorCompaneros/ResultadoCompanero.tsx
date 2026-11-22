import type { Companero } from '../../../../../types/Preferencias'
import TextoResaltado from '../../modalSeleccion/TextoResaltado'
import AvatarCompanero from '../AvatarCompanero'

interface ResultadoCompaneroProps {
  id: string
  companero: Companero
  consulta: string
  /** Marcado con el teclado o el mouse (Enter lo elige). */
  activo: boolean
  restringido: boolean
  /** Clases que ya se quieren ver con él (0 si todavía no). */
  clases: number
  /** Color propio del compañero (si ya tiene clases). */
  fondo?: string
  onElegir: () => void
  onActivar: () => void
}

// Sugerencia de la búsqueda: iniciales, nombre y, abajito, el correo.
export default function ResultadoCompanero({
  id,
  companero,
  consulta,
  activo,
  restringido,
  clases,
  fondo,
  onElegir,
  onActivar,
}: ResultadoCompaneroProps) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={activo}
      aria-disabled={restringido}
      // Que el input no pierda el foco al hacer clic.
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={onActivar}
      onClick={restringido ? undefined : onElegir}
      className={`flex min-h-14.25 items-center gap-3 border-b-[1.5px] border-link-water-27 px-3.5 py-2 transition-colors last:border-b-0 ${
        restringido
          ? 'cursor-not-allowed bg-white opacity-55'
          : `cursor-pointer ${activo ? 'bg-zircon-21' : 'bg-white'}`
      }`}
    >
      <AvatarCompanero nombre={companero.nombre} fondo={fondo} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-dm-sans text-15 font-bold text-bunting">
          <TextoResaltado texto={companero.nombre} consulta={consulta} />
        </span>
        <span className="block truncate font-dm-sans text-12 text-east-bay">
          <TextoResaltado texto={companero.correo} consulta={consulta} />
        </span>
      </span>
      {restringido ? (
        <span className="shrink-0 rounded-full bg-fair-pink px-2 py-0.5 font-dm-sans text-11 font-bold text-alizarin-oscuro">
          Restringido
        </span>
      ) : (
        clases > 0 && (
          <span className="shrink-0 rounded-full bg-zircon-21 px-2 py-0.5 font-dm-sans text-11 font-bold text-sapphire">
            {clases} {clases === 1 ? 'clase' : 'clases'}
          </span>
        )
      )}
    </li>
  )
}

import type { Ref } from 'react'
import { iniciales } from './iniciales'

interface AvatarCompaneroProps {
  nombre: string
  /** Fondo: el color propio del compañero si ya tiene clases elegidas. */
  fondo?: string
  /** Tamaño, texto y extras (p. ej. `size-9 text-12`). */
  className?: string
  ref?: Ref<HTMLSpanElement>
}

// Círculo con las iniciales del compañero (como en las sugerencias de correo).
export default function AvatarCompanero({
  nombre,
  fondo = 'bg-link-water-20',
  className = 'size-9 text-12',
  ref,
}: AvatarCompaneroProps) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-bunting font-jakarta font-extrabold text-bunting ${fondo} ${className}`}
    >
      {iniciales(nombre)}
    </span>
  )
}

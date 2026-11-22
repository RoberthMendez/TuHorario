import type { ReactNode } from 'react'

interface BuscadorProps {
  icono: string
  /** Texto escrito en la caja (por ahora fijo, como en el diseño). */
  consulta: string
  cantidad: number
  etiqueta: string
  /** Filas de resultados (`<li>`). */
  children: ReactNode
}

// Caja de búsqueda con su lista desplegada de resultados.
export default function Buscador({
  icono,
  consulta,
  cantidad,
  etiqueta,
  children,
}: BuscadorProps) {
  return (
    <div>
      <div
        role="search"
        aria-label={etiqueta}
        className="flex h-13 items-center gap-2.5 rounded-t-bloque border-2 border-bunting bg-white px-4"
      >
        <img src={icono} alt="" className="size-5.5 shrink-0" />
        <span className="flex min-w-0 items-center font-dm-sans text-16 font-medium text-bunting">
          <span className="truncate">{consulta}</span>
          <span
            aria-hidden
            className="ml-px h-5.5 w-0.5 shrink-0 animate-titilar bg-sapphire motion-reduce:animate-none"
          />
        </span>
        <span className="ml-auto shrink-0 font-dm-sans text-12 font-bold text-east-bay">
          {cantidad} resultados
        </span>
      </div>
      <ul className="overflow-hidden rounded-b-bloque border-2 border-t-0 border-bunting bg-white">
        {children}
      </ul>
    </div>
  )
}

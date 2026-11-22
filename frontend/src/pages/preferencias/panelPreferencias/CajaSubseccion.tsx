import type { ReactNode } from 'react'

interface CajaSubseccionProps {
  titulo: string
  cantidad: number
  ayuda?: string
  /** Compañeros usa un margen interno algo mayor que Profesores. */
  amplia?: boolean
  children: ReactNode
}

// Caja gris clara con título, contador en píldora y contenido.
export default function CajaSubseccion({
  titulo,
  cantidad,
  ayuda,
  amplia = false,
  children,
}: CajaSubseccionProps) {
  return (
    <div
      className={`rounded-caja border-2 border-bunting bg-zircon-10 ${
        amplia ? 'px-4 pt-4.5 pb-7 sm:px-5.5' : 'px-3.5 pt-3.5 pb-3'
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <h5 className="font-jakarta text-15 font-extrabold text-bunting">
          {titulo}
        </h5>
        <span className="flex h-5 min-w-7 items-center justify-center rounded-full bg-bunting px-2 font-jakarta text-13 font-extrabold text-white">
          {cantidad}
        </span>
        {ayuda && (
          <p className="font-dm-sans text-13 font-medium text-east-bay sm:ml-auto">
            {ayuda}
          </p>
        )}
      </div>
      <div className="mt-2.5">{children}</div>
    </div>
  )
}

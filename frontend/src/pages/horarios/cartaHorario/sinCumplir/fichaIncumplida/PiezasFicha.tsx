import type { ReactNode } from 'react'

// Una fila de piezas de la ficha (clase, horas, compañeros…); en pantallas
// angostas bajan a la siguiente línea.
export default function PiezasFicha({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-2">
      {children}
    </div>
  )
}

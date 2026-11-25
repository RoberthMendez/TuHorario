import type { ReactNode } from 'react'

// El caso en pocas palabras ("No quedaste con Luis"): lo demás lo cuentan
// las fichas de abajo.
export default function TituloFicha({ children }: { children: ReactNode }) {
  return (
    <p className="mt-0.5 font-jakarta text-16 font-extrabold text-bunting">
      {children}
    </p>
  )
}

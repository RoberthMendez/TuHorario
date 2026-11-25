import type { ReactNode } from 'react'

interface ParejaFichaProps {
  primero: ReactNode
  /** Lo que va entre los dos: ≠, =, ✕ o la flecha del recorrido. */
  signo: ReactNode
  segundo: ReactNode
  /**
   * En el celular van uno debajo del otro: sangría para que el signo quede
   * bajo el centro del avatar (o de la ficha) de arriba.
   */
  sangria: string
  /** En fila, alinear arriba (piezas de dos líneas) en vez de al centro. */
  arriba?: boolean
}

// Dos piezas que se comparan (tú y tu compañero, dos profesores, dos
// edificios). En pantallas angostas se apilan con el signo en medio, para que
// nunca quede colgando al final de una línea.
export default function ParejaFicha({
  primero,
  signo,
  segundo,
  sangria,
  arriba = false,
}: ParejaFichaProps) {
  return (
    <div
      className={`mt-2.5 flex min-w-0 flex-col items-start gap-1.5 sm:flex-row sm:gap-2.5 ${arriba ? '' : 'sm:items-center'}`}
    >
      {primero}
      <span className={`flex ${sangria} sm:ml-0`}>{signo}</span>
      {segundo}
    </div>
  )
}

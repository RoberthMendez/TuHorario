import type { ReactNode } from 'react'

// Aviso corto en rojo junto a las piezas ("Era prioritaria").
export default function InsigniaFicha({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border-[1.5px] border-alizarin bg-fair-pink px-2 font-dm-sans text-12 font-bold whitespace-nowrap text-alizarin-oscuro">
      {children}
    </span>
  )
}

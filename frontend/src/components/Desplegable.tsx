import type { ReactNode } from 'react'

interface DesplegableProps {
  abierto: boolean
  id?: string
  children: ReactNode
}

// Contenido que se abre/cierra animando su altura (truco de grid 0fr → 1fr).
export default function Desplegable({
  abierto,
  id,
  children,
}: DesplegableProps) {
  return (
    <div
      id={id}
      inert={!abierto}
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        abierto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

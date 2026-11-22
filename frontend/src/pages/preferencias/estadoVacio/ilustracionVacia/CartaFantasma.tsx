interface CartaFantasmaProps {
  /** Posición y giro dentro de la ilustración. */
  className: string
}

// Carta punteada y desvaída: un estudiante que todavía no existe.
export default function CartaFantasma({ className }: CartaFantasmaProps) {
  return (
    <div
      className={`absolute flex h-17 w-60 items-center gap-3 rounded-resaltado border-2 border-dashed border-periwinkle-gray bg-zircon-10 px-4 ${className}`}
    >
      <span className="size-9 shrink-0 rounded-icono bg-link-water" />
      <span className="flex flex-1 flex-col gap-2">
        <span className="h-2.5 w-3/4 rounded-full bg-link-water" />
        <span className="h-2 w-1/2 rounded-full bg-zircon-21" />
      </span>
    </div>
  )
}

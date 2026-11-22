import { createPortal } from 'react-dom'

interface FondoBloqueoProps {
  /** Se tocó la página por fuera de la carta. */
  onIntento: () => void
}

/*
 * Velo azul sobre toda la página mientras se nombra al estudiante: no deja
 * tocar nada más. Va en un portal al <body> para que su `fixed` cubra la
 * ventana aunque algún ancestro tenga transformaciones (las animaciones de
 * entrada).
 */
export default function FondoBloqueo({ onIntento }: FondoBloqueoProps) {
  return createPortal(
    <div
      aria-hidden
      onPointerDown={onIntento}
      className="fixed inset-0 z-40 animate-aparecer bg-bunting/35 backdrop-blur-xs motion-reduce:animate-none"
    />,
    document.body,
  )
}

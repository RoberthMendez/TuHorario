import BloqueClase from '../ilustracionHorario/BloqueClase'
import type { BloqueHorario } from '../../../types/BloqueHorario'

interface PiezaFlotanteProps {
  bloque: BloqueHorario
  resaltado?: boolean
  /** Posición, giro y sombra (clases de Tailwind). */
  className: string
}

export default function PiezaFlotante({
  bloque,
  resaltado = false,
  className,
}: PiezaFlotanteProps) {
  return (
    <div className={`absolute h-29.5 w-25 ${className}`}>
      <BloqueClase
        bloque={bloque}
        resaltado={resaltado}
        sombra={false}
        className="size-full"
      />
    </div>
  )
}

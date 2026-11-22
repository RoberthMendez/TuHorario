import iconoCheck from '../../../../assets/companeros/icono-check-blanco.svg'
import type { ColorPastel } from '../../../../types/Preferencias'
import { BORDE_ACENTO, FONDO_PASTEL } from '../colores'

interface TarjetaClaseCompaneroProps {
  nombre: string
  color: ColorPastel
  elegida: boolean
  /** Giro de las clases sin elegir. */
  inclinacion: string
}

// Elegida: ficha sólida con check azul. Sin elegir: punteada, translúcida y
// un poco torcida; al pasar el mouse se endereza "invitando" a tocarla.
export default function TarjetaClaseCompanero({
  nombre,
  color,
  elegida,
  inclinacion,
}: TarjetaClaseCompaneroProps) {
  const base = `relative flex h-35 w-full cursor-pointer sm:w-35.25 items-center justify-center rounded-seccion px-3 text-center transition-[rotate,translate,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${FONDO_PASTEL[color]}`

  if (!elegida) {
    return (
      <div
        className={`${base} border-[1.5px] border-dashed opacity-80 hover:rotate-0 hover:opacity-100 ${BORDE_ACENTO[color]} ${inclinacion}`}
      >
        <span className="font-jakarta text-14 font-extrabold text-bunting">
          {nombre}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`${base} border-2 border-bunting shadow-base-4 hover:-translate-y-1`}
    >
      <span className="font-jakarta text-14 font-extrabold text-bunting">
        {nombre}
      </span>
      <span className="absolute -top-2.25 -right-2.25 flex size-7 items-center justify-center rounded-bloque border-[1.5px] border-bunting bg-sapphire">
        <img src={iconoCheck} alt="Elegida" className="size-3.5" />
      </span>
    </div>
  )
}

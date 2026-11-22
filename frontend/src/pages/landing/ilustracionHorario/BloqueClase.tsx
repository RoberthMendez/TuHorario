import type { CSSProperties } from 'react'
import type { BloqueHorario, ColorBloque } from '../../../types/BloqueHorario'

const estilosColor: Record<
  ColorBloque,
  { fondo: string; texto: string; sombra: string }
> = {
  azul: {
    fondo: 'bg-cerulean',
    texto: 'text-white',
    sombra: 'drop-shadow-bloque',
  },
  amarillo: {
    fondo: 'bg-amarillo',
    texto: 'text-madison',
    sombra: 'drop-shadow-bloque',
  },
  indigo: {
    fondo: 'bg-madison',
    texto: 'text-white',
    sombra: 'drop-shadow-bloque-indigo',
  },
  crema: {
    fondo: 'bg-banana',
    texto: 'text-madison',
    sombra: 'drop-shadow-bloque-crema',
  },
}

interface BloqueClaseProps {
  bloque: BloqueHorario
  /** Borde amarillo (pieza que se está encajando). */
  resaltado?: boolean
  /** Desactiva la sombra propia para que el contenedor aplique otra. */
  sombra?: boolean
  className?: string
  style?: CSSProperties
}

export default function BloqueClase({
  bloque,
  resaltado = false,
  sombra = true,
  className = '',
  style,
}: BloqueClaseProps) {
  const { fondo, texto, sombra: claseSombra } = estilosColor[bloque.color]
  const borde = resaltado ? 'border-2 border-amarillo' : ''

  return (
    <article
      style={style}
      className={`relative flex flex-col gap-1.25 rounded-bloque px-[7%] pt-2.25 ${fondo} ${texto} ${borde} ${sombra ? claseSombra : ''} ${className}`}
    >
      <h3 className="font-bricolage text-bloque-titulo font-bold">
        {bloque.clase}
      </h3>
      <p className="font-dm-sans text-bloque font-medium whitespace-nowrap">
        {bloque.horario.horaInicio} – {bloque.horario.horaFin}
        <br />
        {bloque.salon}
        <br />
        Prof. {bloque.profesor}
      </p>
      {bloque.conector && (
        <span
          aria-hidden
          className={`absolute top-12.75 h-4 w-4 rounded-full ${fondo} ${
            bloque.conector === 'derecha' ? 'left-[91%]' : 'right-[91%]'
          } ${resaltado ? 'border-l-2 border-amarillo' : ''}`}
        />
      )}
    </article>
  )
}

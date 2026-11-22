import type { Ref } from 'react'
import Caneca from './Caneca'

interface BotonRestringirProps {
  nombre: string
  tapaAbierta: boolean
  /** La caneca se sacude al recibir al muñeco. */
  sacudiendo: boolean
  deshabilitado: boolean
  /** Cuadrito de la caneca: destino del muñeco. */
  refCaneca: Ref<HTMLSpanElement>
  onRestringir: () => void
}

export default function BotonRestringir({
  nombre,
  tapaAbierta,
  sacudiendo,
  deshabilitado,
  refCaneca,
  onRestringir,
}: BotonRestringirProps) {
  return (
    <button
      type="button"
      onClick={onRestringir}
      disabled={deshabilitado}
      aria-label={`Restringir a ${nombre}`}
      className="group/restringir flex h-11.75 shrink-0 cursor-pointer items-center gap-3 rounded-icono border-[1.5px] border-alizarin bg-fair-pink pr-4 pl-2 font-dm-sans text-14 font-bold text-alizarin-oscuro transition-[translate] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alizarin disabled:pointer-events-none"
    >
      <span
        ref={refCaneca}
        className={`flex size-7.5 items-center justify-center rounded-mini bg-alizarin ${
          sacudiendo ? 'animate-sacudir' : ''
        }`}
      >
        <Caneca
          // Al pasar el mouse la tapa se asoma, invitando a usarla.
          abierta={tapaAbierta}
          className="size-4.5 transition-[rotate] duration-200 group-hover/restringir:-rotate-8"
        />
      </span>
      Restringir estudiante
    </button>
  )
}

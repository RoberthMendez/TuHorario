import iconoCerrar from '../../../../assets/clases/icono-cerrar.svg'
import selloPrioridad from '../../../../assets/clases/sello-prioridad.svg'
import selloVacio from '../../../../assets/clases/sello-prioridad-vacio.svg'
import type { PreferenciaClase } from '../../../../types/Preferencias'
import { FONDO_PASTEL } from '../colores'

interface TarjetaClaseProps {
  preferencia: PreferenciaClase
}

// Ficha de una clase. El sello amarillo marca prioridad; al pasar el mouse
// aparecen el sello vacío (para marcarla) y la X (para quitarla), como en el
// estado "hover" de Inglés Técnico en el diseño.
export default function TarjetaClase({ preferencia }: TarjetaClaseProps) {
  const { clase, prioridad, color } = preferencia

  return (
    <div
      className={`group relative flex h-35 w-full items-center sm:w-35.5 justify-center rounded-seccion border-2 border-bunting px-3.5 text-center shadow-base-5 transition-[translate,rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:-rotate-2 ${FONDO_PASTEL[color]}`}
    >
      <span className="font-jakarta text-15 font-extrabold text-bunting">
        {clase.nombre}
      </span>
      {prioridad ? (
        <img
          src={selloPrioridad}
          alt="Clase con prioridad"
          className="absolute -top-3 -left-2.5 size-10 -rotate-14"
        />
      ) : (
        <img
          src={selloVacio}
          alt=""
          className="absolute -top-3 -left-2.5 size-10 -rotate-14 opacity-0 transition-opacity group-hover:opacity-100"
        />
      )}
      <span
        aria-hidden
        className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-bloque border-[1.5px] border-bunting bg-white opacity-0 group-hover:animate-pop group-hover:opacity-100"
      >
        <img src={iconoCerrar} alt="" className="size-3.25" />
      </span>
    </div>
  )
}

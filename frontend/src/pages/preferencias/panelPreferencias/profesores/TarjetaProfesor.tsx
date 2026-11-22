import avatarNivel0 from '../../../../assets/profesores/avatar-nivel-0.svg'
import avatarNivel1 from '../../../../assets/profesores/avatar-nivel-1.svg'
import avatarNivel2 from '../../../../assets/profesores/avatar-nivel-2.svg'
import avatarNivel3 from '../../../../assets/profesores/avatar-nivel-3.svg'
import type { PreferenciaProfe } from '../../../../types/Preferencias'
import { FONDO_AVATAR } from '../colores'
import ContadorNivel from './ContadorNivel'

// Avatar ilustrado según el nivel (el de nivel 0 va en blanco y negro).
const AVATARES = [avatarNivel0, avatarNivel1, avatarNivel2, avatarNivel3]

interface TarjetaProfesorProps {
  preferencia: PreferenciaProfe
}

export default function TarjetaProfesor({ preferencia }: TarjetaProfesorProps) {
  const { profesor, preferencia: nivel } = preferencia

  return (
    <div className="group flex flex-col items-center pt-3">
      <p className="w-full truncate text-center font-jakarta text-15 font-extrabold text-bunting">
        {profesor.nombre}
      </p>
      <div
        className={`mt-2.5 size-23 overflow-hidden rounded-resaltado border-[1.5px] border-bunting transition-[rotate,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:-rotate-3 ${FONDO_AVATAR[nivel]}`}
      >
        <img
          src={AVATARES[nivel]}
          alt=""
          className={nivel === 0 ? 'size-full' : 'mx-auto size-22.25'}
        />
      </div>
      <div className="mt-2.5">
        <ContadorNivel nivel={nivel} nombre={profesor.nombre} />
      </div>
    </div>
  )
}

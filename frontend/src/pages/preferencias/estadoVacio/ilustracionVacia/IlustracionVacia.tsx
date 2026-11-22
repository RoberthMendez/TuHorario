import pieza1 from '../../../../assets/logo/logo-pieza-1.svg'
import pieza2 from '../../../../assets/logo/logo-pieza-2.svg'
import pieza4 from '../../../../assets/logo/logo-pieza-4.svg'
import CartaFantasma from './CartaFantasma'
import CartaPrimerEstudiante from './CartaPrimerEstudiante'

const pieza =
  'absolute animate-flotar drop-shadow-[0_calc(var(--u)*3)_0_var(--color-bunting)] motion-reduce:animate-none'

interface IlustracionVaciaProps {
  nombre: string
}

/*
 * Ilustración de la página sin estudiantes: dos cartas fantasma en abanico
 * detrás de la del primer estudiante (que muestra el nombre que se escribe) y
 * piezas del logo flotando, "por encajar".
 */
export default function IlustracionVacia({ nombre }: IlustracionVaciaProps) {
  return (
    // En móvil se encoge con la pantalla (el diseño mide 312 de ancho).
    <div
      aria-hidden
      className="relative mx-auto h-56 w-78 shrink-0 [--u:min(0.9px,calc((100vw_-_5rem)/312))] escritorio:[--u:inherit]"
    >
      <CartaFantasma className="top-3 left-14 rotate-[-8deg]" />
      <CartaFantasma className="top-16 left-2 rotate-[5deg]" />
      <CartaPrimerEstudiante nombre={nombre} />
      <img
        src={pieza1}
        alt=""
        className={`${pieza} top-0 right-1 w-12 rotate-12`}
        style={{ animationDelay: '-1.2s' }}
      />
      <img
        src={pieza2}
        alt=""
        className={`${pieza} right-0 bottom-3 w-9 -rotate-12`}
        style={{ animationDelay: '-2.6s' }}
      />
      <img
        src={pieza4}
        alt=""
        className={`${pieza} bottom-0 left-0 w-10 rotate-6`}
        style={{ animationDelay: '-0.4s' }}
      />
    </div>
  )
}

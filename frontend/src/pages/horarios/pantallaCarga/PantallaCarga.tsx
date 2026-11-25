import FondoCuadricula from '../../../components/FondoCuadricula'
import MensajeCarga from './MensajeCarga'
import MiniHorario from './miniHorario/MiniHorario'
import RompecabezasArmandose from './RompecabezasArmandose'
import TituloCarga from './TituloCarga'

/*
 * Mientras el backend corre el algoritmo. Pantalla de una sola vista: en
 * escritorio `--u` se ajusta para que todo quepa en la ventana; en
 * móvil/tablet sigue el ancho de la pantalla.
 */
export default function PantallaCarga() {
  return (
    <div
      role="status"
      aria-label="Armando los horarios"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-zumthor px-4 py-10 [--u:min(0.9px,calc((100vw_-_2rem)/400))] escritorio:h-dvh escritorio:[--u:min(100vw/1440,100dvh/760,1.5px)]"
    >
      <FondoCuadricula />
      <div className="relative flex flex-col items-center">
        <div className="animate-entrar">
          <RompecabezasArmandose />
        </div>
        <div
          className="mt-8 animate-entrar"
          style={{ animationDelay: '100ms' }}
        >
          <TituloCarga />
        </div>
        <div
          className="mt-8 flex w-100 animate-entrar flex-col gap-5 rounded-pie border-2 border-bunting bg-white p-6 shadow-carta"
          style={{ animationDelay: '200ms' }}
        >
          <MiniHorario />
          <MensajeCarga />
        </div>
      </div>
    </div>
  )
}

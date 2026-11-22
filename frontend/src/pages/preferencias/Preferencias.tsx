import FondoCuadricula from '../../components/FondoCuadricula'
import Logo from '../../components/Logo'
import { estudiantes } from '../../data/estudiantes'
import CartaEstudiante from './cartaEstudiante/CartaEstudiante'
import ConfirmarFinal from './ConfirmarFinal'
import Encabezado from './encabezado/Encabezado'
import NuevoEstudiante from './NuevoEstudiante'

/*
 * Página larga (scroll vertical normal), vista "desde más lejos": todo va
 * al 80 % del diseño (como un zoom del navegador al 80 %) para que quepa más
 * contenido en pantalla. En escritorio `--u` sigue el ancho de la ventana
 * (diseño de 1440 × 0.8) entre 0.78 y 1px; en móvil/tablet vale 0.9px y la
 * columna ocupa el ancho de la pantalla.
 */
export default function Preferencias() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-zumthor [--u:0.9px] escritorio:[--u:clamp(0.78px,100vw*0.8/1440,1px)]">
      <FondoCuadricula />
      <div className="relative mx-auto flex w-full max-w-263 flex-col px-4 pt-10 pb-16 sm:px-6 escritorio:px-0 escritorio:pt-18.5">
        <div className="animate-entrar">
          <Logo />
        </div>
        <Encabezado />
        <ul className="mt-7 flex flex-col gap-7.5">
          {estudiantes.map((estudiante, i) => (
            <li
              key={estudiante.id}
              className="animate-entrar"
              style={{ animationDelay: `${240 + i * 110}ms` }}
            >
              <CartaEstudiante estudiante={estudiante} numero={i + 1} />
            </li>
          ))}
        </ul>
        <div
          className="mt-9 animate-entrar escritorio:mx-1.5"
          style={{ animationDelay: `${240 + estudiantes.length * 110}ms` }}
        >
          <NuevoEstudiante />
        </div>
        <div
          className="mt-10.5 animate-entrar escritorio:mx-1.5"
          style={{
            animationDelay: `${350 + estudiantes.length * 110}ms`,
          }}
        >
          <ConfirmarFinal />
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FondoCuadricula from '../../components/FondoCuadricula'
import Logo from '../../components/Logo'
import { resultadosEjemplo } from '../../data/resultadosEjemplo'
import CartaHorario from './cartaHorario/CartaHorario'
import EncabezadoHorarios from './encabezado/EncabezadoHorarios'
import OtroIntento from './OtroIntento'
import PantallaCarga from './pantallaCarga/PantallaCarga'

/*
 * Resultado final: el horario armado de cada estudiante y las preferencias
 * que no se pudieron cumplir. Página larga con la misma escala que
 * Preferencias (vista al 80 % en escritorio, 0.9px en móvil/tablet).
 *
 * TEMPORAL: todavía no está conectada con el backend. Muestra la pantalla de
 * carga unos segundos (como si el algoritmo estuviera corriendo) y luego
 * `resultadosEjemplo`. Con `?cargando` la pantalla de carga se queda fija,
 * para ajustarla.
 *
 * "Otro intento" vuelve a Preferencias. TEMPORAL: "Repetir intento" todavía
 * no recarga los estudiantes ni sus preferencias (eso llega con la conexión
 * al backend); por ahora las dos opciones abren Preferencias vacía.
 */
const CARGA_SIMULADA_MS = 3500

export default function Horarios() {
  const navegar = useNavigate()
  const [parametros] = useSearchParams()
  const fijarCarga = parametros.has('cargando')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (fijarCarga) return
    const espera = setTimeout(() => setCargando(false), CARGA_SIMULADA_MS)
    return () => clearTimeout(espera)
  }, [fijarCarga])

  if (cargando) return <PantallaCarga />

  const resultados = resultadosEjemplo
  // Se abre la primera carta con algo por revisar (o la primera).
  const conPendientes = resultados.findIndex(
    (r) => r.preferenciasSinCumplir.length > 0,
  )
  const abierta = Math.max(conPendientes, 0)

  return (
    <div className="relative min-h-dvh overflow-hidden bg-zumthor [--u:0.9px] escritorio:[--u:clamp(0.78px,100vw*0.8/1440,1px)]">
      <FondoCuadricula />
      <div className="relative mx-auto flex w-full max-w-263 flex-col px-4 pt-10 pb-16 sm:px-6 escritorio:px-0 escritorio:pt-18.5">
        <div className="animate-entrar">
          <Logo />
        </div>
        <EncabezadoHorarios />
        <ul className="mt-7 flex flex-col gap-7.5">
          {resultados.map((resultado, i) => (
            <li
              key={resultado.horario.idEstudiante}
              className="animate-entrar"
              style={{ animationDelay: `${160 + i * 90}ms` }}
            >
              <CartaHorario
                resultado={resultado}
                numero={i + 1}
                abiertaAlInicio={i === abierta}
              />
            </li>
          ))}
        </ul>
        <div
          className="mt-10.5 animate-entrar escritorio:mx-1.5"
          style={{ animationDelay: `${160 + resultados.length * 90}ms` }}
        >
          <OtroIntento
            onRepetir={() => navegar('/preferencias')}
            onEmpezarDeCero={() => navegar('/preferencias')}
          />
        </div>
      </div>
    </div>
  )
}

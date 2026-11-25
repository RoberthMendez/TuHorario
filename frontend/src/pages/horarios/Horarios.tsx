import { useEffect, useState } from 'react'
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import iconoVolver from '../../assets/icono-volver.svg'
import iconoRepetir from '../../assets/otroIntento/icono-repetir.svg'
import AvisoError from '../../components/AvisoError'
import Boton from '../../components/Boton'
import FondoCuadricula from '../../components/FondoCuadricula'
import Logo from '../../components/Logo'
import { idsDeTexto, rutaPreferencias, type EstadoHorarios } from '../../rutas'
import { eliminarEstudiante } from '../../services/estudiantesService'
import CartaHorario from './cartaHorario/CartaHorario'
import EncabezadoHorarios from './encabezado/EncabezadoHorarios'
import OtroIntento from './OtroIntento'
import PantallaCarga from './pantallaCarga/PantallaCarga'
import { useHorarios } from './useHorarios'

/*
 * Resultado final: el horario armado de cada estudiante y las preferencias
 * que no se pudieron cumplir. Página larga con la misma escala que
 * Preferencias (vista al 80 % en escritorio, 0.9px en móvil/tablet).
 *
 * Los estudiantes van en la URL (`?estudiantes=1,2,3`). Al llegar desde
 * "Finalizar" (estado `generar`) corre el algoritmo con la pantalla de carga;
 * al recargar, lee los horarios ya guardados. Con `?cargando` la pantalla de
 * carga se queda fija, para ajustarla.
 *
 * "Repetir intento" vuelve a Preferencias con los mismos estudiantes y sus
 * preferencias; "Desde cero" los borra y abre Preferencias vacía.
 */
export default function Horarios() {
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const [parametros] = useSearchParams()
  const fijarCarga = parametros.has('cargando')
  const [ids] = useState(() => idsDeTexto(parametros.get('estudiantes')))
  const [generar] = useState(
    () => (ubicacion.state as EstadoHorarios | null)?.generar === true,
  )
  const { estado, reintentar } = useHorarios(ids, generar)
  const [borrando, setBorrando] = useState(false)

  // Ya generados: se olvida el estado `generar` para que una recarga los lea
  // de la base en vez de volver a correr el algoritmo.
  const olvidarGenerar = estado.tipo === 'listo' && Boolean(ubicacion.state)
  useEffect(() => {
    if (!olvidarGenerar) return
    navegar(
      { pathname: ubicacion.pathname, search: ubicacion.search },
      { replace: true },
    )
  }, [olvidarGenerar, navegar, ubicacion.pathname, ubicacion.search])

  if (fijarCarga) return <PantallaCarga />
  if (ids.length === 0) return <Navigate to={rutaPreferencias()} replace />
  if (estado.tipo === 'cargando') return <PantallaCarga />

  const repetir = () => navegar(rutaPreferencias(ids))

  // Los estudiantes de este intento ya no se usan: se borran (con sus
  // preferencias e inscripciones) para que no ocupen cupos ni salgan en el
  // buscador de compañeros del intento nuevo.
  const empezarDeCero = async () => {
    setBorrando(true)
    await Promise.allSettled(ids.map((id) => eliminarEstudiante(id)))
    navegar(rutaPreferencias())
  }

  const horarios = estado.tipo === 'listo' ? estado.horarios : []
  // Se abre la primera carta con algo por revisar (o la primera).
  const abierta = Math.max(
    horarios.findIndex((h) => h.preferenciasNoCumplidas.length > 0),
    0,
  )

  return (
    <div className="relative min-h-dvh overflow-hidden bg-zumthor [--u:0.9px] escritorio:[--u:clamp(0.78px,100vw*0.8/1440,1px)]">
      <FondoCuadricula />
      <div className="relative mx-auto flex w-full max-w-263 flex-col px-4 pt-10 pb-16 sm:px-6 escritorio:px-0 escritorio:pt-18.5">
        <div className="animate-entrar">
          <Logo />
        </div>
        {estado.tipo === 'error' ? (
          <div className="mt-10">
            <AvisoError
              titulo={
                generar
                  ? 'No pudimos armar los horarios'
                  : 'No pudimos cargar los horarios'
              }
              mensaje={estado.mensaje}
            >
              <Boton
                texto="Volver"
                icono={iconoVolver}
                variante="claro"
                onClick={repetir}
              />
              <Boton
                texto="Reintentar"
                icono={iconoRepetir}
                variante="panel"
                onClick={reintentar}
              />
            </AvisoError>
          </div>
        ) : (
          <>
            <EncabezadoHorarios />
            <ul className="mt-7 flex flex-col gap-7.5">
              {horarios.map((horario, i) => (
                <li
                  key={horario.idEstudiante}
                  className="animate-entrar"
                  style={{ animationDelay: `${160 + i * 90}ms` }}
                >
                  <CartaHorario
                    horario={horario}
                    numero={i + 1}
                    abiertaAlInicio={i === abierta}
                  />
                </li>
              ))}
            </ul>
            <div
              className="mt-10.5 animate-entrar escritorio:mx-1.5"
              style={{ animationDelay: `${160 + horarios.length * 90}ms` }}
            >
              <OtroIntento
                onRepetir={repetir}
                onEmpezarDeCero={empezarDeCero}
                borrando={borrando}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

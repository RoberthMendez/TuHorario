import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import iconoRepetir from '../../assets/otroIntento/icono-repetir.svg'
import AvisoError from '../../components/AvisoError'
import Boton from '../../components/Boton'
import FondoCuadricula from '../../components/FondoCuadricula'
import Logo from '../../components/Logo'
import { idsDeTexto, rutaHorarios, type EstadoHorarios } from '../../rutas'
import { mensajeDeError } from '../../services/api'
import { crearEjemplo } from '../../services/ejemploService'
import {
  crearEstudiante,
  eliminarEstudiante,
  renombrarEstudiante,
} from '../../services/estudiantesService'
import { guardarPreferencias } from '../../services/preferenciasService'
import type { Estudiante } from '../../types/Estudiante'
import type { PreferenciasEstudiante } from '../../types/Preferencias'
import CargandoIntento from './CargandoIntento'
import CargarEjemplo from './CargarEjemplo'
import CartaEstudiante from './cartaEstudiante/CartaEstudiante'
import ConfirmarFinal from './ConfirmarFinal'
import Encabezado from './encabezado/Encabezado'
import EstadoVacio from './estadoVacio/EstadoVacio'
import NombrarEstudiante from './nombrarEstudiante/NombrarEstudiante'
import NuevoEstudiante from './NuevoEstudiante'
import { recuperarIntento, type Intento } from './recuperarIntento'

/*
 * Página larga (scroll vertical normal), vista "desde más lejos": todo va
 * al 80 % del diseño (como un zoom del navegador al 80 %) para que quepa más
 * contenido en pantalla. En escritorio `--u` sigue el ancho de la ventana
 * (diseño de 1440 × 0.8) entre 0.78 y 1px; en móvil/tablet vale 0.9px y la
 * columna ocupa el ancho de la pantalla.
 *
 * Se empieza sin estudiantes: una bienvenida pide de una el nombre del
 * primero. Para los siguientes, "Nuevo Estudiante" pone una carta en la que
 * lo único posible es escribir el nombre (el resto queda bloqueado). Al
 * crearlo, su carta se despliega sola con los datos generados. Al eliminar
 * uno, su carta se pliega y las de abajo suben (y se renumeran); sin
 * estudiantes vuelve la bienvenida.
 *
 * Los ids de los estudiantes van en la URL (`?estudiantes=1,2,3`). Si se
 * llega con ellos ("Repetir intento", "atrás" desde Horarios o una recarga),
 * se recuperan del backend con sus preferencias guardadas.
 *
 * Debajo de la bienvenida, "Cargar ejemplo" crea en el backend los 10
 * estudiantes del ejemplo de la sustentación y los muestra igual que un
 * intento recuperado; no finaliza.
 *
 * "Finalizar" guarda las preferencias de cada estudiante en el backend y va a
 * Horarios, que corre el algoritmo. No se puede finalizar mientras algún
 * estudiante no tenga clases: el aviso dice a quiénes les faltan.
 */
// Lo que tarda en plegarse la carta de un estudiante eliminado.
const SALIDA_MS = 320

const SIN_PREFERENCIAS: PreferenciasEstudiante = {
  clases: [],
  profesores: [],
  companeros: [],
  restringidos: [],
  franjasHabilitadas: [],
  preferenciaCercania: false,
  preferenciaSinHuecos: false,
  prioridades: [],
}

export default function Preferencias() {
  const navegar = useNavigate()
  const [parametros, setParametros] = useSearchParams()
  // Intento por recuperar: los ids con los que se llegó (se leen una vez).
  const [idsIniciales] = useState(() =>
    idsDeTexto(parametros.get('estudiantes')),
  )
  const [recuperando, setRecuperando] = useState(idsIniciales.length > 0)
  const [errorRecuperar, setErrorRecuperar] = useState<string | null>(null)
  const [vecesRecuperar, setVecesRecuperar] = useState(0)
  // Preferencias guardadas de los estudiantes recuperados: con ellas arranca
  // el panel de cada uno.
  const [iniciales, setIniciales] = useState(
    new Map<number, PreferenciasEstudiante>(),
  )

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [nombrando, setNombrando] = useState(false)
  const [creando, setCreando] = useState(false)
  const [errorCrear, setErrorCrear] = useState<string | null>(null)
  const [recienCreado, setRecienCreado] = useState<number | null>(null)
  const [eliminando, setEliminando] = useState<number[]>([])
  const [finalizando, setFinalizando] = useState(false)
  const [errorFinal, setErrorFinal] = useState<string | null>(null)
  const [cargandoEjemplo, setCargandoEjemplo] = useState(false)
  const [errorEjemplo, setErrorEjemplo] = useState<string | null>(null)
  // Preferencias de cada estudiante (por id), tal como las arma su panel. No
  // se pintan: solo se envían al finalizar, así que no hace falta re-render.
  const preferencias = useRef(new Map<number, PreferenciasEstudiante>())
  // Estudiantes con al menos una clase (lo único que hay que repintar al
  // cambiar las preferencias: habilita "Finalizar").
  const [conClases, setConClases] = useState<Set<number>>(new Set())
  // Estudiantes borrados en esta sesión: otros pueden tenerlos aún como
  // compañeros o restringidos.
  const eliminados = useRef(new Set<number>())

  // Pone en la página a los estudiantes de un intento (recuperado o el
  // ejemplo); el panel de cada uno arranca con sus preferencias guardadas.
  const mostrarIntento = useCallback((intento: Intento) => {
    for (const [id, p] of intento.preferencias) {
      preferencias.current.set(id, p)
    }
    setConClases(
      new Set(
        [...intento.preferencias]
          .filter(([, p]) => p.clases.length > 0)
          .map(([id]) => id),
      ),
    )
    setIniciales(intento.preferencias)
    setEstudiantes(intento.estudiantes)
  }, [])

  useEffect(() => {
    if (idsIniciales.length === 0) return
    const controlador = new AbortController()
    recuperarIntento(idsIniciales, controlador.signal)
      .then((intento) => {
        mostrarIntento(intento)
        setRecuperando(false)
      })
      .catch((error: unknown) => {
        if (!controlador.signal.aborted) {
          setErrorRecuperar(mensajeDeError(error))
        }
      })
    return () => controlador.abort()
  }, [idsIniciales, vecesRecuperar, mostrarIntento])

  // La URL sigue a la lista de estudiantes (sin agregar pasos al historial).
  useEffect(() => {
    if (recuperando) return
    const ids = estudiantes.map((e) => e.id).join(',')
    if ((parametros.get('estudiantes') ?? '') === ids) return
    setParametros(ids ? { estudiantes: ids } : {}, { replace: true })
  }, [estudiantes, recuperando, parametros, setParametros])

  const cambiarPreferencias = useCallback(
    (id: number, nuevas: PreferenciasEstudiante) => {
      preferencias.current.set(id, nuevas)
      const tiene = nuevas.clases.length > 0
      setConClases((actual) => {
        if (actual.has(id) === tiene) return actual
        const siguiente = new Set(actual)
        if (tiene) siguiente.add(id)
        else siguiente.delete(id)
        return siguiente
      })
    },
    [],
  )

  const crear = async (nombre: string) => {
    setCreando(true)
    setErrorCrear(null)
    try {
      const nuevo = await crearEstudiante(nombre)
      setEstudiantes((lista) => [...lista, nuevo])
      setRecienCreado(nuevo.id)
      setNombrando(false)
    } catch (error) {
      setErrorCrear(mensajeDeError(error))
    } finally {
      setCreando(false)
    }
  }

  // Solo se ofrece con la página vacía, así que reemplaza la lista.
  const cargarEjemplo = async () => {
    setCargandoEjemplo(true)
    setErrorEjemplo(null)
    try {
      const creados = await crearEjemplo()
      mostrarIntento(await recuperarIntento(creados.map((e) => e.id)))
    } catch (error) {
      setErrorEjemplo(`No pudimos cargar el ejemplo: ${mensajeDeError(error)}`)
    } finally {
      setCargandoEjemplo(false)
    }
  }

  // Si el servicio falla, el error sube al editor del nombre.
  const renombrar = async (id: number, nombre: string) => {
    const actualizado = await renombrarEstudiante(id, nombre)
    setEstudiantes((lista) => lista.map((e) => (e.id === id ? actualizado : e)))
  }

  const sinClases = estudiantes.filter((e) => !conClases.has(e.id))

  const finalizar = async () => {
    if (sinClases.length > 0) return
    setFinalizando(true)
    setErrorFinal(null)
    try {
      const ids = estudiantes.map((e) => e.id)
      const vivo = (c: { id: number }) => !eliminados.current.has(c.id)
      await Promise.all(
        ids.map((id) => {
          const p = preferencias.current.get(id) ?? SIN_PREFERENCIAS
          return guardarPreferencias(id, {
            ...p,
            companeros: p.companeros.filter((c) => vivo(c.estudiantePreferido)),
            restringidos: p.restringidos.filter(vivo),
          })
        }),
      )
      const estado: EstadoHorarios = { generar: true }
      navegar(rutaHorarios(ids), { state: estado })
    } catch (error) {
      setErrorFinal(
        `No pudimos guardar las preferencias: ${mensajeDeError(error)}`,
      )
      setFinalizando(false)
    }
  }

  const eliminar = async (id: number) => {
    setEliminando((ids) => [...ids, id])
    const salida = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : SALIDA_MS
    try {
      // Se espera al servicio y a que termine de plegarse la carta.
      await Promise.all([
        eliminarEstudiante(id),
        new Promise((listo) => setTimeout(listo, salida)),
      ])
      setEstudiantes((lista) => lista.filter((e) => e.id !== id))
      preferencias.current.delete(id)
      eliminados.current.add(id)
      setConClases((actual) => {
        const siguiente = new Set(actual)
        siguiente.delete(id)
        return siguiente
      })
    } catch (error) {
      console.error('No se pudo eliminar el estudiante:', error)
    } finally {
      setEliminando((ids) => ids.filter((x) => x !== id))
    }
  }

  const hayLista = estudiantes.length > 0 || nombrando

  return (
    <div className="relative min-h-dvh overflow-hidden bg-zumthor [--u:0.9px] escritorio:[--u:clamp(0.78px,100vw*0.8/1440,1px)]">
      <FondoCuadricula />
      <div className="relative mx-auto flex w-full max-w-263 flex-col px-4 pt-10 pb-16 sm:px-6 escritorio:px-0 escritorio:pt-18.5">
        {/* Mientras se nombra a un estudiante, nada más responde. */}
        <div inert={nombrando} className="animate-entrar">
          <Logo />
        </div>
        <div inert={nombrando}>
          <Encabezado />
        </div>
        {recuperando && (
          <div className="mt-8">
            {errorRecuperar ? (
              <AvisoError
                titulo="No pudimos recuperar el intento"
                mensaje={errorRecuperar}
              >
                <Boton
                  texto="Reintentar"
                  icono={iconoRepetir}
                  variante="panel"
                  onClick={() => {
                    setErrorRecuperar(null)
                    setVecesRecuperar((n) => n + 1)
                  }}
                />
              </AvisoError>
            ) : (
              <CargandoIntento />
            )}
          </div>
        )}
        {hayLista && (
          <ul className="mt-7 flex flex-col gap-7.5">
            {estudiantes.map((estudiante, i) => {
              const sale = eliminando.includes(estudiante.id)
              return (
                <li
                  key={estudiante.id}
                  inert={nombrando || sale}
                  // Al salir, el margen negativo se come el espacio entre
                  // cartas para que las de abajo suban sin saltos.
                  className={`animate-entrar transition-[margin] duration-300 ease-out ${sale ? '-mb-7.5' : ''}`}
                  // Las recuperadas entran una tras otra.
                  style={
                    iniciales.has(estudiante.id)
                      ? { animationDelay: `${Math.min(i, 6) * 90}ms` }
                      : undefined
                  }
                >
                  {/* Se desvanece y se pliega (de 1fr a 0fr). */}
                  <div
                    className={`grid grid-cols-1 transition-[grid-template-rows,opacity,scale] duration-300 ease-out ${
                      sale
                        ? 'grid-rows-[0fr] scale-[0.97] opacity-0'
                        : 'grid-rows-[1fr]'
                    }`}
                  >
                    <div className={`min-h-0 ${sale ? 'overflow-hidden' : ''}`}>
                      <CartaEstudiante
                        estudiante={estudiante}
                        numero={i + 1}
                        abrirAlMontar={estudiante.id === recienCreado}
                        preferenciasIniciales={iniciales.get(estudiante.id)}
                        eliminando={sale}
                        onEliminar={() => eliminar(estudiante.id)}
                        onRenombrar={(nombre) =>
                          renombrar(estudiante.id, nombre)
                        }
                        onCambiarPreferencias={cambiarPreferencias}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
            {nombrando && (
              // Por encima del velo de FondoBloqueo (z-40).
              <li className="relative z-50 animate-entrar">
                <NombrarEstudiante
                  numero={estudiantes.length + 1}
                  creando={creando}
                  error={errorCrear}
                  onConfirmar={crear}
                />
              </li>
            )}
          </ul>
        )}
        {!hayLista && !recuperando && (
          <>
            {/* Mientras se carga el ejemplo no se crea a nadie más (y al revés). */}
            <div
              inert={cargandoEjemplo}
              className="mt-8 animate-entrar"
              style={{ animationDelay: '240ms' }}
            >
              <EstadoVacio
                creando={creando}
                error={errorCrear}
                onConfirmar={crear}
              />
            </div>
            <div
              inert={creando}
              className="mt-7 animate-entrar"
              style={{ animationDelay: '360ms' }}
            >
              <CargarEjemplo
                onCargar={cargarEjemplo}
                cargando={cargandoEjemplo}
                error={errorEjemplo}
              />
            </div>
          </>
        )}
        {hayLista && !nombrando && (
          <div className="mt-9 animate-entrar escritorio:mx-1.5">
            <NuevoEstudiante
              onClick={() => {
                setErrorCrear(null)
                setNombrando(true)
              }}
            />
          </div>
        )}
        {estudiantes.length > 0 && (
          <div
            inert={nombrando}
            className="mt-10.5 animate-entrar escritorio:mx-1.5"
          >
            <ConfirmarFinal
              onFinalizar={finalizar}
              finalizando={finalizando}
              faltanClases={sinClases.map((e) => e.nombre)}
              error={errorFinal}
            />
          </div>
        )}
      </div>
    </div>
  )
}

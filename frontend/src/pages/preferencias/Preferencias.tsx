import { useCallback, useRef, useState } from 'react'
import FondoCuadricula from '../../components/FondoCuadricula'
import Logo from '../../components/Logo'
import {
  crearEstudiante,
  eliminarEstudiante,
} from '../../services/estudiantesService'
import { generarHorarios } from '../../services/horariosService'
import { guardarPreferencias } from '../../services/preferenciasService'
import type { Estudiante } from '../../types/Estudiante'
import type { HorarioEstudiante } from '../../types/HorarioEstudiante'
import type { PreferenciasEstudiante } from '../../types/Preferencias'
import CartaEstudiante from './cartaEstudiante/CartaEstudiante'
import ConfirmarFinal from './ConfirmarFinal'
import Encabezado from './encabezado/Encabezado'
import EstadoVacio from './estadoVacio/EstadoVacio'
import NombrarEstudiante from './nombrarEstudiante/NombrarEstudiante'
import NuevoEstudiante from './NuevoEstudiante'

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
 * "Finalizar" guarda las preferencias de cada estudiante en el backend y
 * genera los horarios de todos. El resultado queda en `horarios` (todavía no
 * hay pantalla de resultados).
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

const mensajeDe = (error: unknown) =>
  error instanceof Error ? error.message : 'Error desconocido'

export default function Preferencias() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [nombrando, setNombrando] = useState(false)
  const [creando, setCreando] = useState(false)
  const [recienCreado, setRecienCreado] = useState<number | null>(null)
  const [eliminando, setEliminando] = useState<number[]>([])
  const [finalizando, setFinalizando] = useState(false)
  const [errorFinal, setErrorFinal] = useState<string | null>(null)
  const [, setHorarios] = useState<HorarioEstudiante[] | null>(null)
  // Preferencias de cada estudiante (por id), tal como las arma su panel. No
  // se pintan: solo se envían al finalizar, así que no hace falta re-render.
  const preferencias = useRef(new Map<number, PreferenciasEstudiante>())
  // Estudiantes borrados en esta sesión: otros pueden tenerlos aún como
  // compañeros o restringidos.
  const eliminados = useRef(new Set<number>())

  const cambiarPreferencias = useCallback(
    (id: number, nuevas: PreferenciasEstudiante) => {
      preferencias.current.set(id, nuevas)
    },
    [],
  )

  const crear = async (nombre: string) => {
    setCreando(true)
    try {
      const nuevo = await crearEstudiante(nombre)
      setEstudiantes((lista) => [...lista, nuevo])
      setRecienCreado(nuevo.id)
      setNombrando(false)
    } catch (error) {
      console.error('No se pudo crear el estudiante:', error)
    } finally {
      setCreando(false)
    }
  }

  const finalizar = async () => {
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
      const resultado = await generarHorarios(ids)
      setHorarios(resultado)
      console.info('Horarios generados:', resultado)
    } catch (error) {
      setErrorFinal(
        `No pudimos generar los horarios: ${mensajeDe(error)}. Revisa que el servidor esté corriendo e inténtalo de nuevo.`,
      )
    } finally {
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
                        eliminando={sale}
                        onEliminar={() => eliminar(estudiante.id)}
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
                  onConfirmar={crear}
                />
              </li>
            )}
          </ul>
        )}
        {!hayLista && (
          <div
            className="mt-8 animate-entrar"
            style={{ animationDelay: '240ms' }}
          >
            <EstadoVacio creando={creando} onConfirmar={crear} />
          </div>
        )}
        {hayLista && !nombrando && (
          <div className="mt-9 animate-entrar escritorio:mx-1.5">
            <NuevoEstudiante onClick={() => setNombrando(true)} />
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
              error={errorFinal}
            />
          </div>
        )}
      </div>
    </div>
  )
}

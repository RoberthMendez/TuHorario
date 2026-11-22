import { useState } from 'react'
import FondoCuadricula from '../../components/FondoCuadricula'
import Logo from '../../components/Logo'
import {
  crearEstudiante,
  eliminarEstudiante,
} from '../../services/estudiantesService'
import type { Estudiante } from '../../types/Estudiante'
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
 */
// Lo que tarda en plegarse la carta de un estudiante eliminado.
const SALIDA_MS = 320

export default function Preferencias() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [nombrando, setNombrando] = useState(false)
  const [creando, setCreando] = useState(false)
  const [recienCreado, setRecienCreado] = useState<number | null>(null)
  const [eliminando, setEliminando] = useState<number[]>([])

  const crear = async (nombre: string) => {
    setCreando(true)
    try {
      const nuevo = await crearEstudiante(nombre)
      setEstudiantes((lista) => [...lista, nuevo])
      setRecienCreado(nuevo.id)
      setNombrando(false)
    } finally {
      setCreando(false)
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
            <ConfirmarFinal />
          </div>
        )}
      </div>
    </div>
  )
}

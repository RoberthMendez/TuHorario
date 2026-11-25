import { useEffect, useRef, useState } from 'react'
import { mensajeDeError } from '../../services/api'
import {
  generarHorarios,
  obtenerHorarios,
} from '../../services/horariosService'
import type { HorarioEstudiante } from '../../types/HorarioEstudiante'

// Lo mínimo que se ve la pantalla de carga al generar: el algoritmo suele
// tardar menos y, sin esto, la animación apenas parpadea.
const CARGA_MINIMA_MS = 2200

export type ConsultaHorarios =
  | { tipo: 'cargando' }
  | { tipo: 'listo'; horarios: HorarioEstudiante[] }
  | { tipo: 'error'; mensaje: string }

const esperar = (ms: number) => new Promise((listo) => setTimeout(listo, ms))

/**
 * Horarios de los estudiantes de un intento. Con `generar` corre el algoritmo
 * (`POST /horarios/generar`); si no, lee los ya guardados (`GET /horarios`).
 *
 * Generar reemplaza las inscripciones, así que se hace una sola petición por
 * intento: en desarrollo React monta los efectos dos veces (StrictMode) y la
 * segunda vez reutiliza la petición en curso en vez de lanzar otra.
 */
export function useHorarios(ids: number[], generar: boolean) {
  const [vez, setVez] = useState(0)
  const [estado, setEstado] = useState<ConsultaHorarios>({ tipo: 'cargando' })
  const pedidos = useRef(new Map<number, Promise<HorarioEstudiante[]>>())

  useEffect(() => {
    if (ids.length === 0) return
    let vigente = true
    let pedido = pedidos.current.get(vez)
    if (!pedido) {
      pedido = generar
        ? Promise.all([generarHorarios(ids), esperar(CARGA_MINIMA_MS)]).then(
            ([horarios]) => horarios,
          )
        : obtenerHorarios(ids)
      pedidos.current.set(vez, pedido)
    }
    pedido.then(
      (horarios) => {
        if (vigente) setEstado({ tipo: 'listo', horarios })
      },
      (error: unknown) => {
        if (vigente)
          setEstado({ tipo: 'error', mensaje: mensajeDeError(error) })
      },
    )
    return () => {
      vigente = false
    }
  }, [ids, generar, vez])

  const reintentar = () => {
    setEstado({ tipo: 'cargando' })
    setVez((n) => n + 1)
  }

  return { estado, reintentar }
}

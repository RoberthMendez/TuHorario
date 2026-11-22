import { useEffect, useState } from 'react'
import { buscarCompaneros } from '../../../../../services/companerosService'
import type { Companero } from '../../../../../types/Preferencias'

// Espera a que se deje de escribir un momento antes de consultar.
const ESPERA_MS = 150

type Respuesta =
  { consulta: string; datos: Companero[] } | { consulta: string; error: true }

/**
 * Sugerencias mientras se escribe (como al poner un destinatario en un
 * correo). Cancela la consulta anterior si se sigue escribiendo y, mientras
 * llega la nueva, conserva las sugerencias anteriores para que la lista no
 * parpadee.
 */
export function useBuscarCompaneros(consulta: string) {
  const buscada = consulta.trim()
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    if (!buscada) return
    const controlador = new AbortController()
    const temporizador = setTimeout(() => {
      buscarCompaneros(buscada, controlador.signal)
        .then((datos) => setRespuesta({ consulta: buscada, datos }))
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === 'AbortError') {
            return
          }
          setRespuesta({ consulta: buscada, error: true })
        })
    }, ESPERA_MS)
    return () => {
      clearTimeout(temporizador)
      controlador.abort()
    }
  }, [buscada, intento])

  const alDia = respuesta?.consulta === buscada
  return {
    resultados: respuesta && 'datos' in respuesta ? respuesta.datos : [],
    cargando: Boolean(buscada) && !alDia,
    error: alDia && respuesta !== null && 'error' in respuesta,
    reintentar: () => {
      setRespuesta(null)
      setIntento((n) => n + 1)
    },
  }
}

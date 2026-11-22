import { useEffect, useState } from 'react'

export type EstadoConsulta<T> =
  { tipo: 'cargando' } | { tipo: 'error' } | { tipo: 'listo'; datos: T }

/**
 * Llama al servicio al montarse (cada vez que se abre el modal) y cancela la
 * petición si el modal se cierra antes de que responda. `reintentar` vuelve
 * a llamarlo tras un error.
 */
export function useConsulta<T>(consultar: (signal: AbortSignal) => Promise<T>) {
  // Se usa la función del primer render: el modal se monta en cada apertura.
  const [consultarAlAbrir] = useState(() => consultar)
  const [estado, setEstado] = useState<EstadoConsulta<T>>({ tipo: 'cargando' })
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()
    consultarAlAbrir(controlador.signal)
      .then((datos) => setEstado({ tipo: 'listo', datos }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setEstado({ tipo: 'error' })
      })
    return () => controlador.abort()
  }, [consultarAlAbrir, intento])

  const reintentar = () => {
    setEstado({ tipo: 'cargando' })
    setIntento((n) => n + 1)
  }

  return { estado, reintentar }
}

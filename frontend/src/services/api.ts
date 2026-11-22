/*
 * Cliente HTTP mínimo para hablar con el backend (FastAPI). Todos los
 * servicios (`*Service.ts`) pasan por aquí, así la URL base, las cabeceras y
 * el manejo de errores viven en un solo lugar.
 */

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

/** Error de una respuesta HTTP que no fue 2xx. */
export class ErrorApi extends Error {
  readonly estado: number

  constructor(estado: number, mensaje: string) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
  }
}

interface OpcionesPeticion {
  /** Permite cancelar la petición (p. ej. si se cierra el modal). */
  signal?: AbortSignal
}

/** GET a `ruta` (relativa a `API_URL`) y devuelve el cuerpo como JSON. */
export async function obtenerJson<T>(
  ruta: string,
  { signal }: OpcionesPeticion = {},
): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!respuesta.ok) {
    throw new ErrorApi(
      respuesta.status,
      `GET ${ruta} respondió ${respuesta.status}`,
    )
  }
  return (await respuesta.json()) as T
}

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

/*
 * Lanza `ErrorApi` si la respuesta no es 2xx. Usa el `detail` que manda
 * FastAPI como mensaje cuando es texto (errores de reglas de negocio).
 */
async function revisar(respuesta: Response, metodo: string, ruta: string) {
  if (respuesta.ok) return
  let mensaje = `${metodo} ${ruta} respondió ${respuesta.status}`
  try {
    const cuerpo: unknown = await respuesta.json()
    if (
      cuerpo &&
      typeof cuerpo === 'object' &&
      'detail' in cuerpo &&
      typeof cuerpo.detail === 'string'
    ) {
      mensaje = cuerpo.detail
    }
  } catch {
    // Sin cuerpo JSON: se queda el mensaje genérico.
  }
  throw new ErrorApi(respuesta.status, mensaje)
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
  await revisar(respuesta, 'GET', ruta)
  return (await respuesta.json()) as T
}

/** POST o PUT de `cuerpo` como JSON a `ruta`; devuelve la respuesta como JSON. */
export async function enviarJson<T>(
  metodo: 'POST' | 'PUT',
  ruta: string,
  cuerpo: unknown,
  { signal }: OpcionesPeticion = {},
): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
    signal,
  })
  await revisar(respuesta, metodo, ruta)
  return (await respuesta.json()) as T
}

/** DELETE a `ruta` (espera un 204 sin cuerpo). */
export async function eliminar(
  ruta: string,
  { signal }: OpcionesPeticion = {},
): Promise<void> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: 'DELETE',
    signal,
  })
  await revisar(respuesta, 'DELETE', ruta)
}

/*
 * Respuestas simuladas mientras no existe el backend: devuelven datos mock
 * (de `src/data/`) con una pequeña demora, como haría la red, y respetan la
 * cancelación igual que `fetch`. Cuando un endpoint exista, su servicio deja
 * de usar esto y llama a `obtenerJson` (ver `api.ts`).
 */

const DEMORA_MS = 450

export function simularRespuesta<T>(
  datos: T,
  signal?: AbortSignal,
  demoraMs = DEMORA_MS,
): Promise<T> {
  return new Promise((resolver, rechazar) => {
    const cancelada = () =>
      new DOMException('La petición fue cancelada', 'AbortError')

    if (signal?.aborted) {
      rechazar(cancelada())
      return
    }
    const temporizador = setTimeout(
      () => resolver(structuredClone(datos)),
      demoraMs,
    )
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(temporizador)
        rechazar(cancelada())
      },
      { once: true },
    )
  })
}

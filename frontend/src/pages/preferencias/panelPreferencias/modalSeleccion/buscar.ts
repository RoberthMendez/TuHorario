/**
 * Minúsculas y sin tildes ("Cálculo" → "calculo"). Conserva la longitud del
 * texto, así que las posiciones sirven para resaltar sobre el original.
 */
export function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

/** ¿Alguno de los textos contiene la consulta (sin importar tildes)? */
export function coincide(textos: string[], consulta: string) {
  const buscada = normalizar(consulta.trim())
  return !buscada || textos.some((t) => normalizar(t).includes(buscada))
}

/** Parte un texto en tramos, marcando los que coinciden con la consulta. */
export function partirPorCoincidencia(texto: string, consulta: string) {
  const buscada = normalizar(consulta.trim())
  const original = texto.normalize('NFC')
  if (!buscada) return [{ texto: original, coincide: false }]

  const normalizado = normalizar(original)
  const tramos: { texto: string; coincide: boolean }[] = []
  let desde = 0
  let indice = normalizado.indexOf(buscada)
  while (indice !== -1) {
    if (indice > desde) {
      tramos.push({ texto: original.slice(desde, indice), coincide: false })
    }
    tramos.push({
      texto: original.slice(indice, indice + buscada.length),
      coincide: true,
    })
    desde = indice + buscada.length
    indice = normalizado.indexOf(buscada, desde)
  }
  if (desde < original.length) {
    tramos.push({ texto: original.slice(desde), coincide: false })
  }
  return tramos
}

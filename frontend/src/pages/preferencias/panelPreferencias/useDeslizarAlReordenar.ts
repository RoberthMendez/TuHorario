import { useLayoutEffect, useRef } from 'react'

type Clave = number | string

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Cuando los elementos de una lista cambian de puesto (se reordenan, o uno se
 * quita y los demás se corren), en vez de saltar se deslizan desde donde
 * estaban hasta su nuevo lugar (técnica FLIP).
 *
 * Uso: `const registrar = useDeslizarAlReordenar()` y en cada elemento
 * `ref={registrar(id)}`. `excluir`: un elemento que no se anima (p. ej. el
 * que se está arrastrando, que ya sigue al puntero).
 */
export function useDeslizarAlReordenar(excluir: Clave | null = null) {
  const nodos = useRef(new Map<Clave, HTMLElement>())
  const posiciones = useRef(new Map<Clave, { x: number; y: number }>())

  // Después de cada render: compara la posición nueva con la anterior y anima
  // la diferencia. Se usa offsetLeft/Top (posición en el layout), que no
  // cambia con el scroll ni con las animaciones en curso.
  useLayoutEffect(() => {
    const nuevas = new Map<Clave, { x: number; y: number }>()
    const animar = !reducirMovimiento()
    nodos.current.forEach((el, id) => {
      const ahora = { x: el.offsetLeft, y: el.offsetTop }
      const antes = posiciones.current.get(id)
      if (
        animar &&
        id !== excluir &&
        antes &&
        (antes.x !== ahora.x || antes.y !== ahora.y)
      ) {
        el.animate(
          [
            { translate: `${antes.x - ahora.x}px ${antes.y - ahora.y}px` },
            { translate: '0px 0px' },
          ],
          { duration: 450, easing: 'cubic-bezier(0.34, 1.3, 0.64, 1)' },
        )
      }
      nuevas.set(id, ahora)
    })
    posiciones.current = nuevas
  })

  return (id: Clave) => (el: HTMLElement | null) => {
    if (el) nodos.current.set(id, el)
    else nodos.current.delete(id)
  }
}

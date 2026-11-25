import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import iconoSeccion from '../../../../assets/prioridad/icono-seccion.svg'
import { prioridades } from '../../../../data/preferenciasEjemplo'
import { COLORES_PRIORIDAD } from '../../../../styles/colores'
import SeccionPreferencia from '../SeccionPreferencia'
import { useDeslizarAlReordenar } from '../useDeslizarAlReordenar'
import ElementoPrioridad from './ElementoPrioridad'

const marcador =
  'cursor-default font-dm-sans text-12 font-bold tracking-etiqueta text-east-bay uppercase'

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Cada bloque conserva su color aunque cambie de puesto.
const colorDe = (tipo: string) =>
  COLORES_PRIORIDAD[
    prioridades.findIndex((p) => p.tipoPreferencia === tipo) %
      COLORES_PRIORIDAD.length
  ]

function mover<T>(lista: T[], desde: number, hasta: number) {
  const nueva = [...lista]
  const [elemento] = nueva.splice(desde, 1)
  nueva.splice(hasta, 0, elemento)
  return nueva
}

interface Gesto {
  tipo: string
  pointerId: number
  /** Puntero al empezar, en coordenadas del documento (sigue con el scroll). */
  inicioY: number
  /** Última posición del puntero en la ventana. */
  clienteY: number
  /** Posición del bloque en la lista al empezar. */
  topInicial: number
  /** Quita los listeners de la ventana. */
  limpiar: () => void
}

/*
 * Lista ordenable de preferencias (TAD Prioridad Preferencias: 1 = la más
 * importante). Al arrastrar un bloque, sigue al puntero y los demás se
 * corren deslizándose para hacerle espacio; los números se actualizan en
 * vivo. También se ordena con el teclado (flechas).
 *
 * El gesto escucha en `window` y no en el bloque: al reordenarse, React mueve
 * el <li> en el DOM y el navegador suelta la captura del puntero, así que si
 * el puntero se salía del bloque este se quedaba "trabado".
 */
interface SeccionPrioridadProps {
  /** Tipos de preferencia elegidos por el estudiante, del 1 al último. */
  orden: string[]
  /**
   * Debe ser estable (p. ej. el `set` de un useState): el arrastre lo usa
   * desde listeners que se registran al empezar el gesto.
   */
  onCambiarOrden: (orden: string[]) => void
}

export default function SeccionPrioridad({
  orden,
  onCambiarOrden,
}: SeccionPrioridadProps) {
  const [arrastrado, setArrastrado] = useState<string | null>(null)
  const [anunciado, setAnunciado] = useState<string | null>(null)
  const registrarDeslizar = useDeslizarAlReordenar(arrastrado)
  const filas = useRef(new Map<string, HTMLLIElement>())
  const gesto = useRef<Gesto | null>(null)
  // Orden que refleja el DOM ahora mismo (el del último render aplicado), para
  // comparar con las posiciones reales de las filas.
  const ordenEnPantalla = useRef(orden)
  // Bloque movido con el teclado: recupera el foco tras reordenarse.
  const enfocar = useRef<string | null>(null)

  const bloqueDe = (tipo: string) =>
    filas.current.get(tipo)?.firstElementChild as HTMLElement | null

  // Deja el bloque arrastrado bajo el puntero, aunque su lugar en la lista
  // haya cambiado o la página se haya desplazado.
  const seguirPuntero = () => {
    const g = gesto.current
    const fila = g && filas.current.get(g.tipo)
    const bloque = g && bloqueDe(g.tipo)
    if (!g || !fila || !bloque) return
    const dy = g.clienteY + window.scrollY - g.inicioY
    bloque.style.transform = `translateY(${g.topInicial + dy - fila.offsetTop}px)`
  }

  // Cambia de puesto cuando el centro del bloque pasa el centro del vecino.
  const reordenar = () => {
    const g = gesto.current
    const fila = g && filas.current.get(g.tipo)
    if (!g || !fila) return
    const lista = ordenEnPantalla.current
    const dy = g.clienteY + window.scrollY - g.inicioY
    const centro = g.topInicial + dy + fila.offsetHeight / 2
    const centroDe = (otro: string) => {
      const f = filas.current.get(otro)
      return f ? f.offsetTop + f.offsetHeight / 2 : 0
    }
    const desde = lista.indexOf(g.tipo)
    let hasta = desde
    while (hasta < lista.length - 1 && centro > centroDe(lista[hasta + 1])) {
      hasta++
    }
    while (hasta > 0 && centro < centroDe(lista[hasta - 1])) hasta--
    if (hasta !== desde) onCambiarOrden(mover(lista, desde, hasta))
  }

  useLayoutEffect(() => {
    ordenEnPantalla.current = orden
    seguirPuntero()
    if (enfocar.current) {
      bloqueDe(enfocar.current)?.focus()
      enfocar.current = null
    }
  })

  // Si la sección desaparece a mitad de un arrastre, suelta los listeners.
  useEffect(() => () => gesto.current?.limpiar(), [])

  const soltar = () => {
    const g = gesto.current
    if (!g) return
    g.limpiar()
    gesto.current = null
    // Se acomoda en su puesto con un rebotecito.
    const bloque = bloqueDe(g.tipo)
    if (bloque) {
      const actual = bloque.style.transform
      bloque.style.transform = ''
      if (actual && !reducirMovimiento()) {
        bloque.animate([{ transform: actual }, { transform: 'none' }], {
          duration: 320,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        })
      }
    }
    setArrastrado(null)
    setAnunciado(g.tipo)
  }

  const alPresionar = (tipo: string, e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || gesto.current) return
    // En pantallas táctiles solo desde los puntitos (si no, no hay scroll).
    const enAsa = (e.target as HTMLElement).closest('[data-asa]')
    if (e.pointerType === 'touch' && !enAsa) return
    const fila = filas.current.get(tipo)
    const bloque = bloqueDe(tipo)
    if (!fila || !bloque) return
    e.preventDefault()

    // Si el bloque aún se está acomodando (rebote al soltar o deslizándose
    // para hacer espacio), se cortan esas animaciones —si no, tapan el
    // transform y el bloque no sigue al puntero— y se toma desde donde se ve.
    const visto = bloque.getBoundingClientRect().top
    fila.getAnimations().forEach((a) => a.cancel())
    bloque.getAnimations().forEach((a) => a.cancel())
    bloque.style.transform = ''
    const desfase = visto - bloque.getBoundingClientRect().top

    const pointerId = e.pointerId
    const alMover = (ev: PointerEvent) => {
      const g = gesto.current
      if (!g || ev.pointerId !== pointerId) return
      g.clienteY = ev.clientY
      seguirPuntero()
      reordenar()
    }
    const alTerminar = (ev: PointerEvent) => {
      if (ev.pointerId === pointerId) soltar()
    }
    const alDesplazar = () => {
      seguirPuntero()
      reordenar()
    }
    window.addEventListener('pointermove', alMover)
    window.addEventListener('pointerup', alTerminar)
    window.addEventListener('pointercancel', alTerminar)
    window.addEventListener('scroll', alDesplazar, { passive: true })
    window.addEventListener('blur', soltar)

    gesto.current = {
      tipo,
      pointerId,
      inicioY: e.clientY + window.scrollY,
      clienteY: e.clientY,
      topInicial: fila.offsetTop + desfase,
      limpiar: () => {
        window.removeEventListener('pointermove', alMover)
        window.removeEventListener('pointerup', alTerminar)
        window.removeEventListener('pointercancel', alTerminar)
        window.removeEventListener('scroll', alDesplazar)
        window.removeEventListener('blur', soltar)
      },
    }
    seguirPuntero()
    setArrastrado(tipo)
  }

  const alTeclear = (tipo: string, e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    const desde = orden.indexOf(tipo)
    const hasta = desde + (e.key === 'ArrowUp' ? -1 : 1)
    if (hasta < 0 || hasta >= orden.length) return
    enfocar.current = tipo
    onCambiarOrden(mover(orden, desde, hasta))
    setAnunciado(tipo)
  }

  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Prioridad de preferencias"
      descripcion="Arrastra los bloques para ordenarlos: la preferencia de arriba es la más importante."
    >
      <p className={marcador}>▲ Más importante</p>
      <ol className="mt-2 flex flex-col gap-3">
        {orden.map((tipo, i) => (
          <li
            key={tipo}
            ref={(el) => {
              registrarDeslizar(tipo)(el)
              if (el) filas.current.set(tipo, el)
              else filas.current.delete(tipo)
            }}
          >
            <ElementoPrioridad
              prioridad={{ tipoPreferencia: tipo, prioridad: i + 1 }}
              total={orden.length}
              colores={colorDe(tipo)}
              arrastrando={arrastrado === tipo}
              onPointerDown={(e) => alPresionar(tipo, e)}
              onKeyDown={(e) => alTeclear(tipo, e)}
            />
          </li>
        ))}
      </ol>
      <p className={`mt-2 ${marcador}`}>▼ Menos importante</p>
      <p className="sr-only" aria-live="polite">
        {anunciado &&
          orden.includes(anunciado) &&
          `${anunciado}: puesto ${orden.indexOf(anunciado) + 1} de ${orden.length}`}
      </p>
    </SeccionPreferencia>
  )
}

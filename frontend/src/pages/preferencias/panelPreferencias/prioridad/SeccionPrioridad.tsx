import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import iconoSeccion from '../../../../assets/prioridad/icono-seccion.svg'
import { prioridades } from '../../../../data/preferenciasEjemplo'
import { COLORES_PRIORIDAD } from '../colores'
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
  /** Puntero al empezar y ahora. */
  inicioY: number
  y: number
  /** Posición del bloque en la lista al empezar. */
  topInicial: number
}

/*
 * Lista ordenable de preferencias (TAD Prioridad Preferencias: 1 = la más
 * importante). Al arrastrar un bloque, sigue al puntero y los demás se
 * corren deslizándose para hacerle espacio; los números se actualizan en
 * vivo. También se ordena con el teclado (flechas).
 */
export default function SeccionPrioridad() {
  const [orden, setOrden] = useState(() =>
    prioridades.map((p) => p.tipoPreferencia),
  )
  const [arrastrado, setArrastrado] = useState<string | null>(null)
  const [anuncio, setAnuncio] = useState('')
  const registrarDeslizar = useDeslizarAlReordenar(arrastrado)
  const filas = useRef(new Map<string, HTMLLIElement>())
  const gesto = useRef<Gesto | null>(null)
  // Bloque movido con el teclado: recupera el foco tras reordenarse.
  const enfocar = useRef<string | null>(null)

  const bloqueDe = (tipo: string) =>
    filas.current.get(tipo)?.firstElementChild as HTMLElement | null

  // Deja el bloque arrastrado bajo el puntero, aunque su lugar en la lista
  // haya cambiado.
  const seguirPuntero = () => {
    const g = gesto.current
    const fila = g && filas.current.get(g.tipo)
    const bloque = g && bloqueDe(g.tipo)
    if (!g || !fila || !bloque) return
    const desplazamiento = g.topInicial + (g.y - g.inicioY) - fila.offsetTop
    bloque.style.transform = `translateY(${desplazamiento}px)`
  }

  useLayoutEffect(() => {
    seguirPuntero()
    if (enfocar.current) {
      bloqueDe(enfocar.current)?.focus()
      enfocar.current = null
    }
  })

  const anunciar = (lista: string[], tipo: string) =>
    setAnuncio(`${tipo}: puesto ${lista.indexOf(tipo) + 1} de ${lista.length}`)

  const alPresionar = (tipo: string, e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    // En pantallas táctiles solo desde los puntitos (si no, no hay scroll).
    const enAsa = (e.target as HTMLElement).closest('[data-asa]')
    if (e.pointerType === 'touch' && !enAsa) return
    const fila = filas.current.get(tipo)
    if (!fila) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    gesto.current = {
      tipo,
      inicioY: e.clientY,
      y: e.clientY,
      topInicial: fila.offsetTop,
    }
    setArrastrado(tipo)
  }

  const alMover = (tipo: string, e: PointerEvent<HTMLDivElement>) => {
    const g = gesto.current
    const fila = filas.current.get(tipo)
    if (!g || g.tipo !== tipo || !fila) return
    g.y = e.clientY
    seguirPuntero()

    // Cambia de puesto al pasar el centro del vecino.
    const centro = g.topInicial + (g.y - g.inicioY) + fila.offsetHeight / 2
    const centroDe = (otro: string) => {
      const f = filas.current.get(otro)
      return f ? f.offsetTop + f.offsetHeight / 2 : 0
    }
    const desde = orden.indexOf(tipo)
    let hasta = desde
    while (hasta < orden.length - 1 && centro > centroDe(orden[hasta + 1])) {
      hasta++
    }
    while (hasta > 0 && centro < centroDe(orden[hasta - 1])) hasta--
    if (hasta !== desde) setOrden(mover(orden, desde, hasta))
  }

  const alSoltar = (tipo: string) => {
    const g = gesto.current
    if (!g || g.tipo !== tipo) return
    gesto.current = null
    // Se acomoda en su puesto con un rebotecito.
    const bloque = bloqueDe(tipo)
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
    anunciar(orden, tipo)
  }

  const alTeclear = (tipo: string, e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    const desde = orden.indexOf(tipo)
    const hasta = desde + (e.key === 'ArrowUp' ? -1 : 1)
    if (hasta < 0 || hasta >= orden.length) return
    const nuevo = mover(orden, desde, hasta)
    enfocar.current = tipo
    setOrden(nuevo)
    anunciar(nuevo, tipo)
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
              onPointerMove={(e) => alMover(tipo, e)}
              onPointerUp={() => alSoltar(tipo)}
              onKeyDown={(e) => alTeclear(tipo, e)}
            />
          </li>
        ))}
      </ol>
      <p className={`mt-2 ${marcador}`}>▼ Menos importante</p>
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>
    </SeccionPreferencia>
  )
}

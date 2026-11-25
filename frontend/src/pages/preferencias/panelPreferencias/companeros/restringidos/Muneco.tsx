import { useEffect, useEffectEvent, useRef } from 'react'
import {
  FONDO_COMPANERO,
  RELLENO_COMPANERO,
} from '../../../../../styles/colores'
import Mano from './Mano'
import Persona from './Persona'

export interface Punto {
  x: number
  y: number
}

export interface RecorridoMuneco {
  /** Centro de la foto (iniciales) del compañero: de ahí sale. */
  desde: Punto
  /** Boca de la caneca (centro de arriba). */
  hasta: Punto
}

interface MunecoProps extends RecorridoMuneco {
  /** Color del compañero (clase `bg-*`): su camiseta. */
  fondo?: string
  /** Llegó encima de la caneca: es hora de abrir la tapa. */
  onLlegando: () => void
  /** Ya cayó adentro. */
  onFin: () => void
}

// Fin de cada tramo (ms, acumulados).
const BROTAR = 340 // sale de la foto y la mano baja a agarrarlo
const LEVANTAR = 620 // la mano lo alza
const LLEVAR = 1820 // lo lleva por el aire, pataleando
const ESPERAR = 2080 // cuelga sobre la caneca un momento
const CAER = 2460 // lo suelta y cae adentro
const CUADRO_MS = 30
// Tamaño con el que llega sobre la caneca (se "aleja", como en el Wii).
const ESCALA_FINAL = 0.62

// Dónde se agarra cada dibujo, como fracción de su caja.
// La mano va detrás de la cabeza (se ve el puño asomado arriba y la cara
// queda libre) y lo sostiene de la camiseta por la nuca.
const AGARRE_PERSONA = { x: 0.5, y: 12 / 52 }
const AGARRE_MANO = { x: 0.5, y: 28 / 32 }

const suave = (u: number) => u * u * (3 - 2 * u)
const rebote = (u: number) => 1 + 2.7 * (u - 1) ** 3 + 1.7 * (u - 1) ** 2

interface Estado {
  /** Punto de agarre. */
  p: Punto
  escala: number
  giro: number
  /** Lo que ya entró en la caneca (px del dibujo, desde abajo). */
  recorte: number
  persona: number
  mano: number
  /** Cuánto más arriba está la mano del punto de agarre. */
  manoArriba: number
}

/*
 * Restringir "a lo Wii": una mano agarra al compañero de la camiseta (sale
 * de su foto en el buscador), se lo lleva por el aire mientras patalea y se
 * mece, lo suelta encima de la caneca y cae adentro: se va escondiendo tras
 * el borde (no se desvanece). Las coordenadas son relativas a la sección
 * (el contenedor `relative` donde se dibuja).
 */
export default function Muneco({
  desde,
  hasta,
  fondo,
  onLlegando,
  onFin,
}: MunecoProps) {
  const refPersona = useRef<HTMLDivElement>(null)
  const refMano = useRef<HTMLDivElement>(null)
  const llegando = useEffectEvent(onLlegando)
  const fin = useEffectEvent(onFin)

  useEffect(() => {
    const persona = refPersona.current
    const mano = refMano.current
    if (!persona || !mano) return
    const ancho = persona.offsetWidth
    const alto = persona.offsetHeight
    const agarre = { x: ancho * AGARRE_PERSONA.x, y: alto * AGARRE_PERSONA.y }
    const agarreMano = {
      x: mano.offsetWidth * AGARRE_MANO.x,
      y: mano.offsetHeight * AGARRE_MANO.y,
    }
    const dir = Math.sign(hasta.x - desde.x) || 1

    // Punto de agarre en cada momento clave.
    const brota = { x: desde.x, y: desde.y - alto * 0.1 }
    const alzado = { x: desde.x + dir * ancho * 0.4, y: desde.y - alto * 0.5 }
    const sobreCaneca = {
      x: hasta.x,
      y: hasta.y - (alto - agarre.y) * ESCALA_FINAL - alto * 0.12,
    }
    // Al final hasta la cabeza queda por debajo del borde.
    const adentro = { x: hasta.x, y: hasta.y + agarre.y * ESCALA_FINAL + 2 }
    const subida = Math.max(alto * 0.45, Math.abs(hasta.x - desde.x) * 0.06)

    const estado = (t: number): Estado => {
      const base = { recorte: 0, persona: 1, mano: 1, manoArriba: 0 }
      if (t <= BROTAR) {
        const u = t / BROTAR
        return {
          ...base,
          p: brota,
          escala: 0.2 + 0.8 * rebote(u),
          giro: 0,
          persona: Math.min(1, u * 3),
          mano: u,
          manoArriba: (1 - suave(u)) * alto * 0.9,
        }
      }
      if (t <= LEVANTAR) {
        const u = suave((t - BROTAR) / (LEVANTAR - BROTAR))
        return {
          ...base,
          p: {
            x: brota.x + (alzado.x - brota.x) * u,
            y: brota.y + (alzado.y - brota.y) * u,
          },
          escala: 1,
          giro: dir * 10 * Math.sin(Math.PI * u),
        }
      }
      if (t <= LLEVAR) {
        const u = (t - LEVANTAR) / (LLEVAR - LEVANTAR)
        const k = suave(u)
        return {
          ...base,
          p: {
            x: alzado.x + (sobreCaneca.x - alzado.x) * k,
            y:
              alzado.y +
              (sobreCaneca.y - alzado.y) * k -
              subida * 4 * k * (1 - k),
          },
          escala: 1 + (ESCALA_FINAL - 1) * k,
          // El cuerpo se queda atrás al arrancar y se mece mientras va.
          giro:
            -dir * 16 * Math.sin(Math.PI * u) +
            9 * Math.sin(2 * Math.PI * 2.5 * u),
        }
      }
      if (t <= ESPERAR) {
        const u = (t - LLEVAR) / (ESPERAR - LLEVAR)
        return {
          ...base,
          p: sobreCaneca,
          escala: ESCALA_FINAL,
          // Se sigue meciendo, cada vez menos.
          giro: -dir * 8 * Math.sin(2 * Math.PI * u) * (1 - u),
        }
      }
      // Lo suelta: cae acelerando y se va escondiendo tras el borde.
      const u = Math.min(1, (t - ESPERAR) / (CAER - ESPERAR))
      const y = sobreCaneca.y + (adentro.y - sobreCaneca.y) * u * u
      const abajo = y + (alto - agarre.y) * ESCALA_FINAL
      return {
        ...base,
        p: { x: hasta.x, y },
        escala: ESCALA_FINAL,
        giro: 0,
        recorte: Math.max(0, (abajo - hasta.y) / ESCALA_FINAL),
        // La mano se queda, sube un poco y se va.
        mano: 1 - u,
        manoArriba: u * alto * 0.35 + (y - sobreCaneca.y),
      }
    }

    const cuadrosPersona: Keyframe[] = []
    const cuadrosMano: Keyframe[] = []
    const pasos = Math.ceil(CAER / CUADRO_MS)
    for (let i = 0; i <= pasos; i++) {
      const t = (CAER * i) / pasos
      const e = estado(t)
      const offset = i / pasos
      cuadrosPersona.push({
        offset,
        translate: `${e.p.x - agarre.x}px ${e.p.y - agarre.y}px`,
        rotate: `${e.giro}deg`,
        scale: `${e.escala}`,
        opacity: e.persona,
        clipPath: `inset(-60px -60px ${e.recorte}px -60px)`,
      })
      // La mano sostiene el punto de agarre y sigue un poco el vaivén.
      cuadrosMano.push({
        offset,
        translate: `${e.p.x - agarreMano.x}px ${
          e.p.y - agarreMano.y - e.manoArriba
        }px`,
        rotate: `${e.giro * 0.25}deg`,
        scale: `${Math.max(0.7, e.escala)}`,
        opacity: e.mano,
      })
    }

    const opciones = { duration: CAER, easing: 'linear', fill: 'both' } as const
    const animPersona = persona.animate(cuadrosPersona, opciones)
    const animMano = mano.animate(cuadrosMano, opciones)
    const aviso = setTimeout(llegando, LLEVAR - 120)
    animPersona.onfinish = () => fin()
    return () => {
      clearTimeout(aviso)
      animPersona.cancel()
      animMano.cancel()
    }
  }, [desde, hasta])

  const indice = fondo ? FONDO_COMPANERO.indexOf(fondo) : -1
  const camisa = RELLENO_COMPANERO[indice] ?? 'fill-crusta'

  return (
    <>
      <div
        ref={refPersona}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-30 h-15.5 w-9 origin-[50%_23.08%] opacity-0"
      >
        <Persona camisa={camisa} className="size-full" />
      </div>
      <div
        ref={refMano}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-20 h-8 w-6 origin-[50%_87.5%] opacity-0"
      >
        <Mano className="size-full" />
      </div>
    </>
  )
}

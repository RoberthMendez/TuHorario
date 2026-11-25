import type { CSSProperties } from 'react'
import pieza1 from '../../../assets/logo/logo-pieza-1.svg'
import pieza2 from '../../../assets/logo/logo-pieza-2.svg'
import pieza3 from '../../../assets/logo/logo-pieza-3.svg'
import pieza4 from '../../../assets/logo/logo-pieza-4.svg'

// Las cuatro piezas del logo (con su posición y giro de Figma, en % de la
// caja) y desde dónde llega cada una.
const PIEZAS = [
  {
    src: pieza1,
    clase: 'top-[6.36%] left-[6.82%] w-[48.46%] -rotate-4',
    desde: { x: -70, y: -50, giro: -90 },
  },
  {
    src: pieza2,
    clase: 'top-[6.82%] left-[54.85%] w-[38.06%] rotate-4',
    desde: { x: 70, y: -60, giro: 80 },
  },
  {
    src: pieza3,
    clase: 'top-[44.7%] left-[6.97%] w-[38.06%] rotate-3',
    desde: { x: -80, y: 60, giro: 70 },
  },
  {
    src: pieza4,
    clase: 'top-[55.45%] left-[44.7%] w-[48.46%] -rotate-4',
    desde: { x: 60, y: 70, giro: -100 },
  },
]

// El logo armándose una y otra vez: las piezas llegan girando, encajan con
// un "clic" y se vuelven a soltar.
export default function RompecabezasArmandose() {
  return (
    <div
      aria-hidden
      className="relative size-38 animate-clic motion-reduce:animate-none"
    >
      {PIEZAS.map(({ src, clase, desde }, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute animate-encajar drop-shadow-bloque motion-reduce:animate-none ${clase}`}
          style={
            {
              '--desde-x': `calc(var(--u) * ${desde.x})`,
              '--desde-y': `calc(var(--u) * ${desde.y})`,
              '--desde-giro': `${desde.giro}deg`,
              animationDelay: `${i * 120}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

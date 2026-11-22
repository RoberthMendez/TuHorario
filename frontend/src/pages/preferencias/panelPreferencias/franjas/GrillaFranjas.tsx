import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import iconoArrastre from '../../../../assets/franjas/icono-arrastre.svg'
import { diasFranjas, horasFranjas } from '../../../../data/preferenciasEjemplo'
import type { Dia } from '../../../../types/Horario'
import type { FranjaHabilitada } from '../../../../types/Preferencias'
import BloqueFranja from './BloqueFranja'
import FilaHora from './FilaHora'
import { bloques, etiquetaFranja } from './horas'

const PRIMERA_HORA = horasFranjas[0]

// Columna de horas + 6 días; fila de días + 14 horas.
const PLANTILLA =
  'grid-cols-[calc(var(--u)*100)_repeat(6,minmax(0,1fr))] grid-rows-[calc(var(--u)*42)_repeat(14,calc(var(--u)*44))]'

// Ubicación en la rejilla: columna 1 = horas, fila 1 = días.
function ubicacion(franja: FranjaHabilitada): CSSProperties {
  const columna = diasFranjas.findIndex((d) => d.dia === franja.dia) + 2
  return {
    gridColumn: columna,
    gridRow: `${franja.desde - PRIMERA_HORA + 2} / ${franja.hasta - PRIMERA_HORA + 2}`,
  }
}

interface Arrastre {
  dia: Dia
  /** Hora donde se presionó y hora bajo el puntero ahora. */
  ancla: number
  actual: number
  /** Centro de la columna: el arrastre se queda en ese día. */
  x: number
}

const franjaDe = ({ dia, ancla, actual }: Arrastre): FranjaHabilitada => ({
  dia,
  desde: Math.min(ancla, actual),
  hasta: Math.max(ancla, actual) + 1,
})

interface GrillaFranjasProps {
  horas: Set<string>
  onAgregar: (franja: FranjaHabilitada) => void
  onQuitar: (franja: FranjaHabilitada) => void
}

/*
 * Grilla semanal de 7:00 a. m. a 9:00 p. m. Se presiona una casilla y se
 * arrastra hacia arriba o abajo en el mismo día (mientras tanto se ve en
 * amarillo con borde punteado); al soltar queda la franja en azul. Un toque
 * marca una sola hora. En pantallas táctiles el dedo desplaza la página, así
 * que ahí se marca tocando casilla por casilla (las horas seguidas se unen).
 * En pantallas angostas la grilla se desplaza horizontalmente.
 */
export default function GrillaFranjas({
  horas,
  onAgregar,
  onQuitar,
}: GrillaFranjasProps) {
  const [arrastre, setArrastre] = useState<Arrastre | null>(null)
  const grilla = useRef<HTMLDivElement>(null)
  const franjaArrastrada = arrastre ? franjaDe(arrastre) : null

  // Hora de la casilla del día del arrastre a la altura `y` (sin salirse de
  // la grilla).
  const horaEn = (a: Arrastre, y: number) => {
    const columna = grilla.current?.querySelectorAll<HTMLElement>(
      `[data-dia="${a.dia}"]`,
    )
    if (!columna || columna.length === 0) return a.actual
    const arriba = columna[0].getBoundingClientRect().top + 1
    const abajo = columna[columna.length - 1].getBoundingClientRect().bottom - 1
    const enY = Math.min(Math.max(y, arriba), abajo)
    const celda = document
      .elementsFromPoint(a.x, enY)
      .find(
        (el): el is HTMLElement =>
          el instanceof HTMLElement && el.dataset.dia === a.dia,
      )
    return celda ? Number(celda.dataset.hora) : a.actual
  }

  const alPresionar = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const celda = (e.target as HTMLElement).closest<HTMLElement>('[data-hora]')
    if (!celda) return
    // Que no se seleccione texto mientras se arrastra.
    e.preventDefault()
    const r = celda.getBoundingClientRect()
    const hora = Number(celda.dataset.hora)
    setArrastre({
      dia: celda.dataset.dia as Dia,
      ancla: hora,
      actual: hora,
      x: r.left + r.width / 2,
    })
    if (e.pointerType !== 'touch') {
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const alMover = (e: PointerEvent<HTMLDivElement>) => {
    if (!arrastre || e.pointerType === 'touch') return
    const hora = horaEn(arrastre, e.clientY)
    if (hora !== arrastre.actual) setArrastre({ ...arrastre, actual: hora })
  }

  const alSoltar = () => {
    if (!arrastre) return
    onAgregar(franjaDe(arrastre))
    setArrastre(null)
  }

  const enArrastre = (hora: number) => (dia: Dia) =>
    franjaArrastrada !== null &&
    franjaArrastrada.dia === dia &&
    hora >= franjaArrastrada.desde &&
    hora < franjaArrastrada.hasta

  return (
    <div className="barra-scroll overflow-x-auto pb-1">
      <div className="relative min-w-180 select-none">
        <div
          ref={grilla}
          onPointerDown={alPresionar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          // El navegador se quedó con el gesto (p. ej. scroll en el celular).
          onPointerCancel={() => setArrastre(null)}
          className={`grid overflow-hidden rounded-caja border-2 border-bunting bg-zumthor ${PLANTILLA} ${
            arrastre ? 'cursor-ns-resize' : ''
          }`}
        >
          <span className="border-r-2 border-b-2 border-bunting bg-zircon-10" />
          {diasFranjas.map(({ dia, nombre }, i) => (
            <span
              key={dia}
              className={`flex cursor-default items-center justify-center border-b-2 border-b-bunting border-r-casper bg-zircon-10 font-dm-sans text-13 font-bold tracking-etiqueta text-bunting uppercase ${
                i < diasFranjas.length - 1 ? 'border-r-[1.5px]' : ''
              }`}
            >
              {nombre}
            </span>
          ))}
          {horasFranjas.map((hora) => (
            <FilaHora
              key={hora}
              hora={hora}
              enArrastre={enArrastre(hora)}
              arrastrando={arrastre !== null}
            />
          ))}
        </div>
        {/* Capa superpuesta con la misma plantilla: franjas y arrastre. Solo
            los bloques reciben el mouse (para su X). */}
        <div
          className={`pointer-events-none absolute inset-[2px] grid ${PLANTILLA}`}
        >
          {bloques(horas).map((franja) => (
            <BloqueFranja
              key={`${franja.dia}-${franja.desde}-${franja.hasta}`}
              franja={franja}
              nombreDia={
                diasFranjas.find((d) => d.dia === franja.dia)?.nombre ?? ''
              }
              ubicacion={ubicacion(franja)}
              onQuitar={() => onQuitar(franja)}
            />
          ))}
          {franjaArrastrada && (
            <span
              aria-hidden
              style={ubicacion(franjaArrastrada)}
              className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-bunting"
            >
              <img
                src={iconoArrastre}
                alt=""
                className="size-5 animate-flotar motion-reduce:animate-none"
              />
              {franjaArrastrada.hasta - franjaArrastrada.desde > 1 && (
                <span className="px-1 text-center font-dm-sans text-11 leading-tight font-bold text-bunting">
                  {etiquetaFranja(franjaArrastrada)}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

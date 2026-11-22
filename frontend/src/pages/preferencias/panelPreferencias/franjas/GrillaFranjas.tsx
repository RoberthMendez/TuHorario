import type { CSSProperties } from 'react'
import iconoArrastre from '../../../../assets/franjas/icono-arrastre.svg'
import iconoBloque from '../../../../assets/franjas/icono-bloque.svg'
import {
  diasFranjas,
  franjaArrastrando,
  franjasHabilitadas,
  horasFranjas,
} from '../../../../data/preferenciasEjemplo'
import type { FranjaHabilitada } from '../../../../types/Preferencias'
import FilaHora from './FilaHora'

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

// Grilla semanal de 7:00 a. m. a 8:00 p. m.; en pantallas angostas se
// desplaza horizontalmente.
export default function GrillaFranjas() {
  return (
    <div className="barra-scroll overflow-x-auto pb-1">
      <div className="relative min-w-180">
        <div
          className={`grid overflow-hidden rounded-caja border-2 border-bunting bg-zumthor ${PLANTILLA}`}
        >
          <span className="border-r-2 border-b-2 border-bunting bg-zircon-10" />
          {diasFranjas.map(({ dia, nombre }, i) => (
            <span
              key={dia}
              className={`flex items-center justify-center border-b-2 border-b-bunting border-r-casper bg-zircon-10 font-dm-sans text-13 font-bold tracking-etiqueta text-bunting uppercase ${
                i < diasFranjas.length - 1 ? 'border-r-[1.5px]' : ''
              }`}
            >
              {nombre}
            </span>
          ))}
          {horasFranjas.map((hora) => (
            <FilaHora key={hora} hora={hora} />
          ))}
        </div>
        {/* Capa superpuesta con la misma plantilla: bloques elegidos y arrastre */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-[2px] grid ${PLANTILLA}`}
        >
          {franjasHabilitadas.map((franja) => (
            <span
              key={franja.dia}
              style={ubicacion(franja)}
              className="m-1.25 mb-1.75 flex items-center justify-center rounded-bloque border-2 border-bunting bg-hawkes-blue shadow-base-4"
            >
              <img src={iconoBloque} alt="" className="size-6.5" />
            </span>
          ))}
          {/* Selección que se está arrastrando (las casillas debajo ya van
              en amarillo, ver FilaHora) */}
          <span
            style={ubicacion(franjaArrastrando)}
            className="flex items-center justify-center border-2 border-dashed border-bunting"
          >
            <img
              src={iconoArrastre}
              alt=""
              className="size-5 animate-flotar motion-reduce:animate-none"
            />
          </span>
        </div>
      </div>
    </div>
  )
}

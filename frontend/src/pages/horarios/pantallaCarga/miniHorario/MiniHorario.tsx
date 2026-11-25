import { DIAS_SEMANA } from '../../../../data/semana'
import BloqueMini from './BloqueMini'

const FILAS = 5

// Clases de mentira que se van acomodando (columna = día, fila = hora).
const BLOQUES = [
  { columna: 0, fila: 0, horas: 2, fondo: 'bg-beeswax' },
  { columna: 1, fila: 1, horas: 2, fondo: 'bg-tuft-bush' },
  { columna: 2, fila: 0, horas: 2, fondo: 'bg-beeswax' },
  { columna: 5, fila: 1, horas: 2, fondo: 'bg-wheatfield' },
  { columna: 0, fila: 2, horas: 2, fondo: 'bg-titan-white' },
  { columna: 3, fila: 0, horas: 2, fondo: 'bg-mabel' },
  { columna: 2, fila: 2, horas: 2, fondo: 'bg-titan-white' },
  { columna: 1, fila: 3, horas: 2, fondo: 'bg-carousel-pink' },
  { columna: 4, fila: 2, horas: 3, fondo: 'bg-white-ice' },
  { columna: 3, fila: 3, horas: 2, fondo: 'bg-tuft-bush' },
]

// Un horario chiquito que se llena solo mientras el algoritmo trabaja.
export default function MiniHorario() {
  return (
    <div aria-hidden className="w-full">
      <div className="grid grid-cols-6 pb-1.5">
        {DIAS_SEMANA.map(({ dia, abreviatura }) => (
          <span
            key={dia}
            className="text-center font-jakarta text-11 font-extrabold tracking-etiqueta text-east-bay"
          >
            {abreviatura}
          </span>
        ))}
      </div>
      <div className="relative overflow-hidden rounded-icono border-2 border-bunting bg-zumthor">
        {/* Celdas de fondo */}
        <div className="grid grid-cols-6">
          {Array.from({ length: FILAS * 6 }, (_, i) => (
            <div
              key={i}
              className={`h-8.5 border-bunting/20 ${i % 6 < 5 ? 'border-r' : ''} ${i < (FILAS - 1) * 6 ? 'border-b' : ''}`}
            />
          ))}
        </div>
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-5">
          {BLOQUES.map((bloque, i) => (
            <BloqueMini key={i} {...bloque} orden={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

import { FONDO_PASTEL, colorDeClase } from '../../../../../styles/colores'
import type { Dia } from '../../../../../types/Horario'
import type { CursoAsignado } from '../../../../../types/HorarioEstudiante'
import type { Clase } from '../../../../../types/Preferencias'
import { aMinutos } from '../../cronograma/horas'
import { horaCorta } from './horas'

interface LineaDiaProps {
  dia: Dia
  /** Cursos del estudiante (se toman sus sesiones de ese día). */
  cursos: CursoAsignado[]
}

type Tramo =
  | { libre: false; inicio: number; fin: number; clase: Clase }
  | { libre: true; inicio: number; fin: number }

/*
 * El día en una sola línea, de la primera clase a la última: cada clase con
 * su color y, entre ellas, las horas libres rayadas y con cuántas son. Cada
 * tramo ocupa lo que dura.
 */
export default function LineaDia({ dia, cursos }: LineaDiaProps) {
  const sesiones = cursos
    .flatMap((curso) =>
      curso.sesiones
        .filter((s) => s.dia === dia)
        .map((s) => ({
          clase: curso.clase,
          inicio: aMinutos(s.horaInicio),
          fin: aMinutos(s.horaFin),
        })),
    )
    .sort((a, b) => a.inicio - b.inicio)
  if (sesiones.length === 0) return null

  const tramos: Tramo[] = []
  for (const s of sesiones) {
    const anterior = tramos.at(-1)
    if (anterior && s.inicio > anterior.fin) {
      tramos.push({ libre: true, inicio: anterior.fin, fin: s.inicio })
    }
    tramos.push({ libre: false, ...s })
  }
  const hora = (minutos: number) =>
    horaCorta(`${String(minutos / 60).padStart(2, '0')}:00`)

  return (
    <div className="mt-3">
      <div className="flex h-7 overflow-hidden rounded-mini border-[1.5px] border-bunting">
        {tramos.map((tramo, i) => (
          <span
            key={tramo.inicio}
            title={
              tramo.libre
                ? `Libre de ${hora(tramo.inicio)} a ${hora(tramo.fin)}`
                : `${tramo.clase.nombre}: ${hora(tramo.inicio)} a ${hora(tramo.fin)}`
            }
            style={{ flexGrow: tramo.fin - tramo.inicio }}
            className={`flex basis-0 items-center justify-center ${i > 0 ? 'border-l-[1.5px] border-bunting' : ''} ${
              tramo.libre
                ? 'bg-[repeating-linear-gradient(-45deg,var(--color-fair-pink)_0_calc(var(--u)*5),var(--color-white)_calc(var(--u)*5)_calc(var(--u)*8))]'
                : FONDO_PASTEL[colorDeClase(tramo.clase.id)]
            }`}
          >
            {tramo.libre && (
              <span className="rounded-full bg-white px-1.5 font-dm-sans text-11 font-bold text-alizarin-oscuro">
                {(tramo.fin - tramo.inicio) / 60} h
              </span>
            )}
          </span>
        ))}
      </div>
      <div className="mt-1 flex justify-between font-dm-sans text-11 font-bold text-east-bay">
        <span>{hora(tramos[0].inicio)}</span>
        <span>{hora(Math.max(...tramos.map((t) => t.fin)))}</span>
      </div>
    </div>
  )
}

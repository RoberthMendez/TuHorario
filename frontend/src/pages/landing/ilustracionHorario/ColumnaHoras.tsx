import { HORAS_ILUSTRACION } from '../../../data/semana'

export default function ColumnaHoras() {
  return (
    <div className="absolute top-12.5 left-3.5 w-7.75 text-right font-dm-sans text-hora font-bold text-madison">
      {HORAS_ILUSTRACION.map((hora) => (
        <p key={hora}>{hora}</p>
      ))}
    </div>
  )
}

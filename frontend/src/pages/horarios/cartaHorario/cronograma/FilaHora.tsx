import { DIAS_SEMANA } from '../../../../data/semana'
import { etiquetaHora } from './horas'

interface FilaHoraProps {
  hora: number
  ultima: boolean
}

// Una hora de la grilla: la etiqueta a la izquierda y una celda por día.
export default function FilaHora({ hora, ultima }: FilaHoraProps) {
  const borde = ultima ? '' : 'border-b-[1.333px]'
  return (
    <div className="grid grid-cols-[calc(var(--u)*104)_repeat(6,minmax(0,1fr))]">
      <div className="h-14 border-r-2 border-bunting bg-zircon-10 pt-2 pr-6 text-right font-dm-sans text-13 font-bold whitespace-nowrap text-east-bay">
        {etiquetaHora(hora)}
      </div>
      {DIAS_SEMANA.map(({ dia }, i) => (
        <div
          key={dia}
          className={`h-14 border-bunting/30 bg-zumthor ${borde} ${i < DIAS_SEMANA.length - 1 ? 'border-r-[1.333px]' : ''}`}
        />
      ))}
    </div>
  )
}

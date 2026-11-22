import { diasFranjas } from '../../../../data/preferenciasEjemplo'
import type { Dia } from '../../../../types/Horario'
import { etiquetaHora } from './horas'

interface FilaHoraProps {
  hora: number
  /** ¿La casilla de ese día está bajo la franja que se está arrastrando? */
  enArrastre: (dia: Dia) => boolean
  arrastrando: boolean
}

// Una fila de la grilla: etiqueta de la hora + una casilla por día. Las
// casillas bajo el arrastre se pintan de amarillo (así las líneas de la
// grilla siguen viéndose a través de él).
export default function FilaHora({
  hora,
  enArrastre,
  arrastrando,
}: FilaHoraProps) {
  return (
    <>
      <span className="flex cursor-default items-center justify-end border-r-2 border-b-[1.5px] border-r-bunting border-b-casper bg-zircon-10 pr-4 font-dm-sans text-13 font-bold whitespace-nowrap text-biscay">
        {etiquetaHora(hora)}
      </span>
      {diasFranjas.map(({ dia }, columna) => (
        <span
          key={dia}
          data-dia={dia}
          data-hora={hora}
          className={`cursor-pointer border-b-[1.5px] border-casper transition-colors duration-150 ${
            columna < diasFranjas.length - 1 ? 'border-r-[1.5px]' : ''
          } ${
            enArrastre(dia)
              ? 'bg-beeswax'
              : `bg-zumthor ${arrastrando ? '' : 'hover:bg-beeswax/60'}`
          }`}
        />
      ))}
    </>
  )
}

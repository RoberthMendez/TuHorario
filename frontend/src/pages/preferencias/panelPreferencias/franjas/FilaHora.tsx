import {
  diasFranjas,
  franjaArrastrando,
} from '../../../../data/preferenciasEjemplo'

function etiquetaHora(hora: number) {
  const sufijo = hora < 12 ? 'a. m.' : 'p. m.'
  const hora12 = hora > 12 ? hora - 12 : hora
  return `${hora12}:00 ${sufijo}`
}

// Las casillas bajo la selección que se arrastra se pintan de amarillo
// (así las líneas de la grilla siguen viéndose a través de ella).
function enArrastre(columna: number, hora: number) {
  const { dia, desde, hasta } = franjaArrastrando
  return diasFranjas[columna].dia === dia && hora >= desde && hora < hasta
}

interface FilaHoraProps {
  hora: number
}

// Una fila de la grilla: etiqueta de la hora + una casilla por día.
export default function FilaHora({ hora }: FilaHoraProps) {
  return (
    <>
      <span className="flex items-center justify-end border-r-2 border-b-[1.5px] border-r-bunting border-b-casper bg-zircon-10 pr-4 font-dm-sans text-13 font-bold whitespace-nowrap text-biscay">
        {etiquetaHora(hora)}
      </span>
      {diasFranjas.map(({ dia }, columna) => (
        <span
          key={dia}
          className={`border-b-[1.5px] border-casper ${
            columna < diasFranjas.length - 1 ? 'border-r-[1.5px]' : ''
          } ${enArrastre(columna, hora) ? 'bg-beeswax' : 'bg-zumthor'}`}
        />
      ))}
    </>
  )
}

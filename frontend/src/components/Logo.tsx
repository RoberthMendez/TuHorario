import pieza1 from '../assets/logo/logo-pieza-1.svg'
import pieza2 from '../assets/logo/logo-pieza-2.svg'
import pieza3 from '../assets/logo/logo-pieza-3.svg'
import pieza4 from '../assets/logo/logo-pieza-4.svg'

export default function Logo() {
  return (
    <div
      className="flex h-16.5 items-center font-jakarta text-logo font-extrabold text-bunting"
      aria-label="TuHorario"
    >
      {/* Ícono: cuatro piezas de rompecabezas, cada una con su giro de Figma.
          Posición y ancho en % de la caja de 66 px, para que escalen con ella. */}
      <div className="relative size-16.5 shrink-0 overflow-hidden">
        <img
          src={pieza1}
          alt=""
          className="absolute top-[6.36%] left-[6.82%] w-[48.46%] -rotate-4"
        />
        <img
          src={pieza2}
          alt=""
          className="absolute top-[6.82%] left-[54.85%] w-[38.06%] rotate-4"
        />
        <img
          src={pieza3}
          alt=""
          className="absolute top-[44.7%] left-[6.97%] w-[38.06%] rotate-3"
        />
        <img
          src={pieza4}
          alt=""
          className="absolute top-[55.45%] left-[44.7%] w-[48.46%] -rotate-4"
        />
      </div>
      <span className="ml-3">Tu</span>
      <span className="ml-1.25 flex h-10.25 w-33.5 -rotate-2 items-center rounded-etiqueta bg-buttercup pb-0.75 pl-3 shadow-logo">
        Horario
      </span>
    </div>
  )
}

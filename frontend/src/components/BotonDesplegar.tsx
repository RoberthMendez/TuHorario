import chevron from '../assets/chevron-abajo.svg'

interface BotonDesplegarProps {
  abierta: boolean
  /** Lo que muestra/oculta, para el lector de pantalla ("las preferencias de Ana"). */
  etiqueta: string
  idContenido: string
  onClick: () => void
}

// Flecha de una carta desplegable: gira con rebote al abrir/cerrar.
export default function BotonDesplegar({
  abierta,
  etiqueta,
  idContenido,
  onClick,
}: BotonDesplegarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={abierta}
      aria-controls={idContenido}
      aria-label={`${abierta ? 'Ocultar' : 'Ver'} ${etiqueta}`}
      className="ml-auto flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-icono border-2 border-bunting bg-white transition-[translate,background-color] duration-200 hover:-translate-y-0.5 hover:bg-zircon-21 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire"
    >
      <img
        src={chevron}
        alt=""
        className={`size-5.5 transition-[rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
          abierta ? 'rotate-180' : ''
        }`}
      />
    </button>
  )
}

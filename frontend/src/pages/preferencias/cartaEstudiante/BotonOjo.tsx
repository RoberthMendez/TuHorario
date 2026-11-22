import { useState } from 'react'
import ojo from '../../../assets/cartaEstudiante/ojo.svg'

interface BotonOjoProps {
  visible: boolean
  onClick: () => void
}

// Ojo junto al nombre: muestra/oculta los datos del estudiante. Parpadea al
// tocarlo y, con los datos ocultos, aparece tachado.
export default function BotonOjo({ visible, onClick }: BotonOjoProps) {
  const [parpadeos, setParpadeos] = useState(0)

  return (
    <button
      type="button"
      onClick={() => {
        setParpadeos((n) => n + 1)
        onClick()
      }}
      aria-pressed={!visible}
      aria-label={
        visible
          ? 'Ocultar datos del estudiante'
          : 'Mostrar datos del estudiante'
      }
      className="relative flex size-8 shrink-0 animate-pop cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-zircon-21 focus-visible:outline-2 focus-visible:outline-sapphire"
    >
      <img
        key={parpadeos}
        src={ojo}
        alt=""
        className={`size-5.5 transition-opacity ${parpadeos > 0 ? 'animate-parpadeo' : ''} ${
          visible ? '' : 'opacity-50'
        }`}
      />
      <span
        aria-hidden
        className={`absolute h-0.5 w-6 rotate-45 rounded-full bg-bunting transition-[scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          visible ? 'scale-x-0' : 'scale-x-100'
        }`}
      />
    </button>
  )
}

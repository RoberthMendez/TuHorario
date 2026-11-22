import type { NivelPreferencia } from '../../../../types/Preferencias'

interface ContadorNivelProps {
  nivel: NivelPreferencia
  nombre: string
}

// Contador − nivel + (todavía sin lógica). En 0 el "−" se ve apagado y en 3
// el "+", como en el diseño.
export default function ContadorNivel({ nivel, nombre }: ContadorNivelProps) {
  const boton =
    'flex size-6 items-center justify-center rounded-icono font-dm-sans text-16 font-bold text-bunting disabled:opacity-35'

  return (
    <div className="flex h-8 w-22.75 items-center justify-between rounded-full border-[1.5px] border-periwinkle-gray bg-white px-1">
      <button
        type="button"
        disabled={nivel === 0}
        aria-label={`Bajar el nivel de ${nombre}`}
        className={`${boton} bg-zircon-21`}
      >
        −
      </button>
      <span className="font-jakarta text-14 font-extrabold text-bunting">
        {nivel}
      </span>
      <button
        type="button"
        disabled={nivel === 3}
        aria-label={`Subir el nivel de ${nombre}`}
        className={`${boton} bg-beeswax`}
      >
        +
      </button>
    </div>
  )
}

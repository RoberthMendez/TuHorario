import type { NivelPreferencia } from '../../../../types/Preferencias'

interface ContadorNivelProps {
  nivel: NivelPreferencia
  nombre: string
  onCambiar: (nivel: NivelPreferencia) => void
}

// Contador − nivel + (de 0 a 3). En 0 el "−" se apaga y en 3 el "+".
export default function ContadorNivel({
  nivel,
  nombre,
  onCambiar,
}: ContadorNivelProps) {
  const boton =
    'flex size-6 cursor-pointer items-center justify-center rounded-icono font-dm-sans text-16 font-bold text-bunting transition-[scale,background-color] duration-150 hover:scale-110 active:scale-90 focus-visible:outline-2 focus-visible:outline-sapphire disabled:pointer-events-none disabled:opacity-35'

  return (
    <div className="flex h-8 w-22.75 items-center justify-between rounded-full border-[1.5px] border-periwinkle-gray bg-white px-1">
      <button
        type="button"
        disabled={nivel === 0}
        onClick={() => onCambiar((nivel - 1) as NivelPreferencia)}
        aria-label={`Bajar el nivel de ${nombre}`}
        className={`${boton} bg-zircon-21 hover:bg-link-water`}
      >
        −
      </button>
      <span
        key={nivel}
        aria-live="polite"
        aria-label={`Nivel ${nivel}`}
        className="animate-entrar-chip font-jakarta text-14 font-extrabold text-bunting"
      >
        {nivel}
      </span>
      <button
        type="button"
        disabled={nivel === 3}
        onClick={() => onCambiar((nivel + 1) as NivelPreferencia)}
        aria-label={`Subir el nivel de ${nombre}`}
        className={`${boton} bg-beeswax hover:bg-cream-brulee`}
      >
        +
      </button>
    </div>
  )
}

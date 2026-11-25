import iconoIncumplida from '../../../../../assets/sinCumplir/icono-incumplida.svg'

interface SignoComparacionProps {
  /**
   * `distinto`: cada uno quedó en un curso (≠). `igual`: quedaron juntos y no
   * querías (=). `falta`: alguno no quedó en la clase (✕).
   */
  signo: 'distinto' | 'igual' | 'falta'
}

const etiqueta = {
  distinto: 'en cursos distintos',
  igual: 'en el mismo curso',
  falta: 'no coinciden',
}

// Entre dos puestos (o dos profesores): cómo se comparan. Al pasar el mouse
// por la ficha da un brinquito.
export default function SignoComparacion({ signo }: SignoComparacionProps) {
  return (
    <span
      title={etiqueta[signo]}
      className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-bunting transition-[scale,rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-115 group-hover:-rotate-12 motion-reduce:transition-none ${
        signo === 'falta' ? 'bg-carmesi' : 'bg-fair-pink text-alizarin-oscuro'
      }`}
    >
      {signo === 'falta' ? (
        <img src={iconoIncumplida} alt="" className="size-3.5" />
      ) : (
        <svg viewBox="0 0 14 14" fill="none" aria-hidden className="size-3.5">
          <path
            d="M3 5.25H11M3 8.75H11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {signo === 'distinto' && (
            <path
              d="M9 2.5L5 11.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      )}
    </span>
  )
}

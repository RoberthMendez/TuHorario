// Colores de la ilustración de Alejandro (Cercanía entre salones).
const PIEL = '#F2C29B'
const PELO = '#3A2B27'
const JEAN = '#2B4BA8'
const BOCA = '#C73A2D'
const GOTA = '#8FD3F4'
const TRAZO = 'var(--color-bunting)'

interface PersonaProps {
  /** Clase `fill-*` de la camiseta (el color del compañero). */
  camisa: string
  className?: string
}

/*
 * Personita del estilo de Alejandro (trazo índigo fino, colores planos),
 * colgando con los brazos arriba y pataleando, como un Mii agarrado de la
 * camiseta. Dibujo de 30 × 52; se sostiene por la nuca, en (15, 12).
 */
export default function Persona({ camisa, className = '' }: PersonaProps) {
  return (
    <svg
      viewBox="0 0 30 52"
      fill="none"
      overflow="visible"
      aria-hidden
      className={className}
      stroke={TRAZO}
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Piernas: patalean en contra una de la otra. */}
      <g
        className="animate-agitar [animation-duration:0.17s]"
        style={giro(12.5, 33)}
      >
        <path d="M10.6 33H14.4V44.2H10.6Z" fill={JEAN} />
        <path d="M14.8 44.2H9.6Q8.4 46.4 9.6 48.4H14.8Z" fill="white" />
        <path d="M9.4 47H14.8" />
      </g>
      <g
        className="animate-agitar [animation-direction:alternate-reverse] [animation-duration:0.17s]"
        style={giro(17.5, 33)}
      >
        <path d="M15.6 33H19.4V44.2H15.6Z" fill={JEAN} />
        <path d="M15.2 44.2H20.4Q21.6 46.4 20.4 48.4H15.2Z" fill="white" />
        <path d="M15.2 47H20.6" />
      </g>
      {/* Brazos arriba, agitándose (contorno índigo y relleno de piel). */}
      <g
        className="animate-agitar [animation-duration:0.23s]"
        style={giro(9.5, 22)}
      >
        <path d="M9.5 22L4.6 13.6" strokeWidth="3.4" />
        <path d="M9.5 22L4.6 13.6" stroke={PIEL} strokeWidth="1.4" />
        <circle cx="4.2" cy="12.8" r="1.8" fill={PIEL} />
      </g>
      <g
        className="animate-agitar [animation-direction:alternate-reverse] [animation-duration:0.23s]"
        style={giro(20.5, 22)}
      >
        <path d="M20.5 22L25.4 13.6" strokeWidth="3.4" />
        <path d="M20.5 22L25.4 13.6" stroke={PIEL} strokeWidth="1.4" />
        <circle cx="25.8" cy="12.8" r="1.8" fill={PIEL} />
      </g>
      {/* Cuello y camiseta (del color del compañero). */}
      <path d="M13.2 15.5H16.8V20H13.2Z" fill={PIEL} />
      <path
        d="M8.6 21.4Q8.6 19.2 10.8 19.2H19.2Q21.4 19.2 21.4 21.4V34H8.6Z"
        className={camisa}
      />
      <path d="M12.6 19.4Q15 21.6 17.4 19.4" />
      {/* Cabeza: cara asustada, pelo y una gota de sudor. */}
      <circle cx="15" cy="10" r="7" fill={PIEL} />
      <path
        d="M7.9 9.6C7.5 4.9 10.9 2.7 15 2.7C19.1 2.7 22.5 4.9 22.1 9.6C20.4 7.5 17.8 6.8 15 7.1C12.2 6.8 9.6 7.5 7.9 9.6Z"
        fill={PELO}
      />
      <path d="M11.2 9.2L13.3 9.9M18.8 9.2L16.7 9.9" />
      <circle cx="12.5" cy="11.4" r="0.75" fill={TRAZO} stroke="none" />
      <circle cx="17.5" cy="11.4" r="0.75" fill={TRAZO} stroke="none" />
      <ellipse
        cx="15"
        cy="14.3"
        rx="1.25"
        ry="1.1"
        fill={BOCA}
        strokeWidth="0.8"
      />
      <path
        d="M24.6 4.4Q23.3 6.6 24.6 7.6Q25.9 6.6 24.6 4.4Z"
        fill={GOTA}
        strokeWidth="0.8"
      />
    </svg>
  )
}

// Punto de giro de una extremidad (cadera u hombro), en unidades del dibujo.
function giro(x: number, y: number) {
  return { transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' } as const
}

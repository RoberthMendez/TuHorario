interface CanecaProps {
  /** La tapa se levanta para recibir al muñeco. */
  abierta: boolean
  className?: string
}

// Caneca del botón "Restringir estudiante" (SVG del diseño en línea, con la
// tapa aparte para poder abrirla).
export default function Caneca({ abierta, className = '' }: CanecaProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      overflow="visible"
      className={className}
    >
      <g
        stroke="white"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.5 8.25V12.75M10.5 8.25V12.75M4.5 5.25L5.25 15H12.75L13.5 5.25" />
        <path
          d="M3 5.25H15M6.75 5.25V3H11.25V5.25"
          style={{ transformOrigin: '3px 5.25px', transformBox: 'view-box' }}
          className={`transition-[rotate,translate] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            abierta ? '-translate-y-0.5 -rotate-35' : ''
          }`}
        />
      </g>
    </svg>
  )
}

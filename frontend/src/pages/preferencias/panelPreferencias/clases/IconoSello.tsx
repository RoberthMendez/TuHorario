import type { SVGProps } from 'react'

interface IconoSelloProps extends SVGProps<SVGSVGElement> {
  /** Clases del relleno de la estrella exterior (p. ej. `fill-supernova`). */
  relleno: string
}

// Dibujo del sello de prioridad (SVG del diseño, en línea para poder cambiar
// su relleno). Lo usan el sello de cada clase y la descripción de la sección.
export default function IconoSello({
  relleno,
  className = '',
  ...props
}: IconoSelloProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden
      className={`overflow-visible ${className}`}
      {...props}
    >
      <path
        d="M20 1.6L23.92 5.32L29.2 4.08L30.76 9.24L35.92 10.8L34.68 16.08L38.4 20L34.68 23.92L35.92 29.2L30.76 30.76L29.2 35.92L23.92 34.68L20 38.4L16.08 34.68L10.8 35.92L9.24 30.76L4.08 29.2L5.32 23.92L1.6 20L5.32 16.08L4.08 10.8L9.24 9.24L10.8 4.08L16.08 5.32L20 1.6Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`stroke-bunting ${relleno}`}
      />
      <path
        d="M20 11.2L22.12 17.08L28.36 17.28L23.44 21.12L25.16 27.12L20 23.6L14.84 27.12L16.56 21.12L11.64 17.28L17.88 17.08L20 11.2Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-bunting stroke-bunting"
      />
    </svg>
  )
}

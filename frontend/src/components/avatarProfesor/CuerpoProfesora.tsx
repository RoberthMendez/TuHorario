import type { Apariencia } from './apariencia'

// Cuerpo y cabeza de la profa (dibujo base, sin la cara). Coordenadas del
// SVG original de 100 × 100.
export default function CuerpoProfesora({ a }: { a: Apariencia }) {
  return (
    <>
      <path
        d="M24 50C20 22 36 10 50 10C64 10 80 22 76 50C76 62 74 70 70 75H30C26 70 24 62 24 50Z"
        fill={a.pelo.color}
      />
      <path
        d="M4 100C4 84 18 76 36 72H64C82 76 96 84 96 100Z"
        fill={a.ropa.color}
      />
      <path
        d="M36 72L50 91L38 100H24C24 86 28 77 36 72Z"
        fill={a.ropa.oscuro}
      />
      <path
        d="M64 72L50 91L62 100H76C76 86 72 77 64 72Z"
        fill={a.ropa.oscuro}
      />
      <path d="M37 72L50 91L63 72Z" fill="#CFE0FF" />
      <path d="M42 58V76Q50 84 58 76V58Z" fill={a.piel.cuello} />
      <path d="M42 66Q50 74 58 66V58H42Z" fill="#14224F" opacity=".12" />
      <circle cx="50" cy="90" r="2.4" fill={a.accesorio} />
      <path
        d="M30 40C30 24 39 17 50 17C61 17 70 24 70 40C70 54 61 65 50 65C39 65 30 54 30 40Z"
        fill={a.piel.cara}
      />
      <path
        d="M29 43C26 21 38 13 51 14C65 15 74 24 71 43C67 32 58 26 47 27C38 29 32 34 29 43Z"
        fill={a.pelo.color}
      />
      <circle cx="30.5" cy="50" r="2.3" fill={a.accesorio} />
      <circle cx="69.5" cy="50" r="2.3" fill={a.accesorio} />
      <path
        d="M50 46.5Q47 52 50.5 53"
        stroke={a.piel.nariz}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M37.5 40.5L35.5 38.8M62.5 40.5L64.5 38.8"
        stroke="#14224F"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
    </>
  )
}

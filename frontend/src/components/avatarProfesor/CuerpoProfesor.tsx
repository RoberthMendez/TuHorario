import type { Apariencia } from './apariencia'

// Cuerpo y cabeza del profe (dibujo base, sin la cara). Coordenadas del SVG
// original de 100 × 100.
export default function CuerpoProfesor({ a }: { a: Apariencia }) {
  return (
    <>
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
      <path d="M37 72L50 91L63 72Z" fill="#fff" />
      <path d="M42 58V76Q50 84 58 76V58Z" fill={a.piel.cuello} />
      <path d="M42 66Q50 74 58 66V58H42Z" fill="#14224F" opacity=".12" />
      <path d="M47 82H53L52.5 86H47.5Z" fill={a.accesorio} />
      <path d="M47.5 86H52.5L55 98L50 101L45 98Z" fill={a.accesorio} />
      <ellipse cx="29.5" cy="44" rx="3.6" ry="5.4" fill={a.piel.cara} />
      <ellipse cx="70.5" cy="44" rx="3.6" ry="5.4" fill={a.piel.cara} />
      <path
        d="M29 40C29 24 38 17 50 17C62 17 71 24 71 40C71 56 62 66 50 66C38 66 29 56 29 40Z"
        fill={a.piel.cara}
      />
      <path
        d="M28 43C24 22 36 11 50 11C65 11 77 22 72 43C70 35 67 29 61 26C53 30 41 29 36 24C31 28 29 35 28 43Z"
        fill={a.pelo.color}
      />
      <path
        d="M50 46.5Q47 52 50.5 53"
        stroke={a.piel.nariz}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </>
  )
}

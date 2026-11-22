import type { Apariencia } from './apariencia'

// Nivel 3: brazo en alto (con la manga del color de su ropa) y destellos.
export default function Celebracion({ a }: { a: Apariencia }) {
  return (
    <>
      <path
        d="M84 92L90 44"
        stroke={a.ropa.color}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M84.5 47L96 49.5"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="91.5" cy="36" r="7" fill={a.piel.cara} />
      <circle cx="85.5" cy="34" r="2.8" fill={a.piel.cara} />
      <path
        d="M13 22l1.6 3.6 3.6 1.6-3.6 1.6L13 32l-1.6-3.6L7.8 26.8l3.6-1.6z"
        fill="#F7B418"
      />
      <path
        d="M24 10l1.2 2.6 2.6 1.2-2.6 1.2L24 17.6l-1.2-2.6-2.6-1.2 2.6-1.2z"
        fill="#fff"
      />
    </>
  )
}

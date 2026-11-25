import type { NivelPreferencia } from '../../types/Preferencias'

interface CaraProps {
  nivel: NivelPreferencia
  cejas: string
  /** Color de los labios (cambia entre profe y profa). */
  boca: string
}

const trazo = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const

// Expresión según el nivel: 0 triste (con lágrima), 1 medio feliz,
// 2 contento, 3 celebrando (ojos cerrados de alegría y boca abierta).
export default function Cara({ nivel, cejas, boca }: CaraProps) {
  if (nivel === 0) {
    return (
      <>
        <circle cx="41" cy="43.5" r="2.1" fill="#14224F" />
        <circle cx="59" cy="43.5" r="2.1" fill="#14224F" />
        <path
          d="M34 37.5Q40 36.5 46 33M66 37.5Q60 36.5 54 33"
          stroke={cejas}
          strokeWidth="2.6"
          {...trazo}
        />
        <path
          d="M43 58.5Q50 52.5 57 58.5"
          stroke={boca}
          strokeWidth="2.6"
          {...trazo}
        />
        <path d="M62.5 47Q65 51 62.5 53.2Q60 51 62.5 47Z" fill="#CFE0FF" />
      </>
    )
  }

  if (nivel === 1) {
    return (
      <>
        <circle cx="41" cy="43" r="2.1" fill="#14224F" />
        <circle cx="59" cy="43" r="2.1" fill="#14224F" />
        <path
          d="M35 35.5Q41 34 46 35M54 35Q59 34 65 35.5"
          stroke={cejas}
          strokeWidth="2.6"
          {...trazo}
        />
        <path
          d="M43.5 55Q50 58.8 56.5 55"
          stroke={boca}
          strokeWidth="2.6"
          {...trazo}
        />
      </>
    )
  }

  const mejillas = (
    <>
      <circle cx="35" cy="54" r="3.2" fill="#E8847A" opacity=".35" />
      <circle cx="65" cy="54" r="3.2" fill="#E8847A" opacity=".35" />
    </>
  )

  if (nivel === 2) {
    return (
      <>
        <circle cx="41" cy="43" r="2.1" fill="#14224F" />
        <circle cx="59" cy="43" r="2.1" fill="#14224F" />
        <path
          d="M35 34.5Q41 31 46 33.5M54 33.5Q59 31 65 34.5"
          stroke={cejas}
          strokeWidth="2.6"
          {...trazo}
        />
        <path
          d="M42 53.5H58Q56.5 62 50 62Q43.5 62 42 53.5Z"
          fill="#fff"
          stroke={boca}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {mejillas}
      </>
    )
  }

  return (
    <>
      <path
        d="M38.5 44Q41 40.2 43.5 44M56.5 44Q59 40.2 61.5 44"
        stroke="#14224F"
        strokeWidth="2.3"
        {...trazo}
      />
      <path
        d="M35 32Q41 28 46 30.5M54 30.5Q59 28 65 32"
        stroke={cejas}
        strokeWidth="2.6"
        {...trazo}
      />
      <path d="M40 52H60Q58 66.5 50 66.5Q42 66.5 40 52Z" fill="#7A2D35" />
      <path d="M41.8 52H58.2V55.8H41.8Z" fill="#fff" />
      {mejillas}
    </>
  )
}

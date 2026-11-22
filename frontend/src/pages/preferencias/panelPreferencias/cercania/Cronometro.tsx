import { useEffect, useState } from 'react'

// Alejandro ya va 10 minutos tarde cuando se abre la página.
const INICIO_MS = 10 * 60 * 1000

const dosCifras = (n: number) => String(Math.floor(n)).padStart(2, '0')

/*
 * Orbitron no trae cifras tabulares (el "1" mide 0.39em y el "0" 0.834em), así
 * que cada cifra va en una caja del ancho de la más ancha: el cronómetro no
 * cambia de ancho y el texto de alrededor no se mueve.
 */
const cifras = (texto: string) =>
  [...texto].map((c, i) => (
    <span key={i} className="inline-block w-[0.834em] text-center">
      {c}
    </span>
  ))

interface CronometroProps {
  /** Se congela cuando Alejandro ya no tiene afán (salones cercanos). */
  detenido: boolean
}

/*
 * Cronómetro de Alejandro (fuente Orbitron, mm:ss.cc). Arranca en 10:00.00 al
 * entrar a la página y avanza en vivo; los dos puntos titilan mientras corre.
 */
export default function Cronometro({ detenido }: CronometroProps) {
  const [ms, setMs] = useState(INICIO_MS)

  useEffect(() => {
    if (detenido) return
    let anterior = performance.now()
    let cuadro = requestAnimationFrame(function avanzar(ahora) {
      setMs((m) => m + ahora - anterior)
      anterior = ahora
      cuadro = requestAnimationFrame(avanzar)
    })
    return () => cancelAnimationFrame(cuadro)
  }, [detenido])

  const minutos = Math.floor(ms / 60000)
  const segundos = (ms % 60000) / 1000
  const centesimas = (ms % 1000) / 10

  return (
    <span
      role="timer"
      aria-label={`${minutos} minutos`}
      className="inline-block font-orbitron text-15 font-bold whitespace-nowrap text-bunting"
    >
      {cifras(String(minutos).padStart(2, '0'))}
      <span
        className={
          detenido ? undefined : 'animate-titilar motion-reduce:animate-none'
        }
      >
        :
      </span>
      {cifras(dosCifras(segundos))}.{cifras(dosCifras(centesimas))}
    </span>
  )
}

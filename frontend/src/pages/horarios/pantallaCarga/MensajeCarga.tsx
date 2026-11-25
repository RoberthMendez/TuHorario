import { useEffect, useState } from 'react'

const MENSAJES = [
  'Repartiendo los salones…',
  'Preguntándoles a los profesores…',
  'Encajando las piezas del rompecabezas…',
  'Sentando juntos a los compañeros…',
  'Buscando que no queden huecos…',
  'Sacándole punta a los lápices…',
]
const CADA_MS = 2000

// Frase que cambia cada par de segundos para contar qué se está haciendo.
export default function MensajeCarga() {
  const [indice, setIndice] = useState(0)
  useEffect(() => {
    const intervalo = setInterval(
      () => setIndice((i) => (i + 1) % MENSAJES.length),
      CADA_MS,
    )
    return () => clearInterval(intervalo)
  }, [])
  return (
    <p
      aria-live="polite"
      className="h-6 overflow-hidden text-center font-dm-sans text-16 font-bold text-east-bay"
    >
      {/* La key reinicia la animación de entrada en cada frase. */}
      <span key={indice} className="inline-block animate-entrar">
        {MENSAJES[indice]}
      </span>
    </p>
  )
}

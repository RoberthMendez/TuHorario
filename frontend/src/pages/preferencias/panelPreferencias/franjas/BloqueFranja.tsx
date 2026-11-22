import { useState, type CSSProperties } from 'react'
import iconoBloque from '../../../../assets/franjas/icono-bloque.svg'
import type { FranjaHabilitada } from '../../../../types/Preferencias'
import BotonQuitar from '../BotonQuitar'
import { etiquetaFranja, etiquetaHora } from './horas'

interface BloqueFranjaProps {
  franja: FranjaHabilitada
  nombreDia: string
  ubicacion: CSSProperties
  onQuitar: () => void
}

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Franja elegida (bloque azul). Al pasar el mouse aparece la X para quitarla;
// al quitarla hace "pop" (se infla un poco y se encoge) y luego se borra,
// como las clases.
export default function BloqueFranja({
  franja,
  nombreDia,
  ubicacion,
  onQuitar,
}: BloqueFranjaProps) {
  const [saliendo, setSaliendo] = useState(false)
  const descripcion = `${nombreDia} de ${etiquetaHora(franja.desde)} a ${etiquetaHora(franja.hasta)}`

  const quitar = () => {
    if (reducirMovimiento()) onQuitar()
    else setSaliendo(true)
  }

  return (
    <span
      style={ubicacion}
      title={descripcion}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && e.animationName === 'salir') {
          onQuitar()
        }
      }}
      className={`group relative m-1.25 mb-1.75 flex cursor-default flex-col items-center justify-center gap-1 rounded-bloque border-2 border-bunting bg-hawkes-blue px-1 text-center shadow-base-4 ${
        saliendo
          ? 'pointer-events-none animate-salir'
          : 'pointer-events-auto animate-entrar-chip'
      }`}
    >
      <img
        src={iconoBloque}
        alt=""
        // En una franja de una sola hora el ícono va más pequeño.
        className={`shrink-0 ${franja.hasta - franja.desde > 1 ? 'size-6.5' : 'size-5'}`}
      />
      {franja.hasta - franja.desde > 1 && (
        <span className="font-dm-sans text-11 leading-tight font-bold text-bunting">
          {etiquetaFranja(franja)}
        </span>
      )}
      <span className="sr-only">{descripcion}</span>
      <BotonQuitar
        etiqueta={`Quitar la franja del ${descripcion}`}
        titulo="Quitar franja"
        onQuitar={quitar}
      />
    </span>
  )
}

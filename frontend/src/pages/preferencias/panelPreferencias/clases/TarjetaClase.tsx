import { useState } from 'react'
import type { PreferenciaClase } from '../../../../types/Preferencias'
import { FONDO_PASTEL } from '../colores'
import BotonQuitar from '../BotonQuitar'
import SelloPrioridad from './SelloPrioridad'

interface TarjetaClaseProps {
  preferencia: PreferenciaClase
  onAlternarPrioridad: () => void
  onQuitar: () => void
}

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
 * Ficha de una clase. Al pasar el mouse aparecen el sello de prioridad (si
 * aún no la tiene) y la X para quitarla, como en el estado "hover" de Inglés
 * Técnico en el diseño.
 *
 * El hover lo detecta un contenedor quieto (un poco más grande que la ficha,
 * para cubrir el sello y la X que sobresalen) y solo la ficha de adentro se
 * inclina. Si la propia ficha detectara el hover, al inclinarse su esquina se
 * escaparía del cursor (justo donde está el sello) y el sello aparecería y
 * desaparecería en bucle: se veía "temblar".
 */
export default function TarjetaClase({
  preferencia,
  onAlternarPrioridad,
  onQuitar,
}: TarjetaClaseProps) {
  const { clase, prioridad, color } = preferencia
  // Solo se estampa al marcar la prioridad (no al quitarla ni al montarse).
  const [estampando, setEstampando] = useState(false)
  // Al quitarla, primero hace "pop" y al terminar se borra de la lista.
  const [saliendo, setSaliendo] = useState(false)

  const alternarPrioridad = () => {
    setEstampando(!prioridad)
    onAlternarPrioridad()
  }

  const quitar = () => {
    if (reducirMovimiento()) onQuitar()
    else setSaliendo(true)
  }

  const animacion = saliendo
    ? 'animate-salir'
    : estampando
      ? 'animate-golpe motion-reduce:animate-none'
      : ''

  return (
    <div
      className={`group relative w-full before:absolute before:-inset-3 before:content-[''] sm:w-35.5 ${
        saliendo ? 'pointer-events-none' : ''
      }`}
    >
      <div
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && e.animationName === 'salir') {
            onQuitar()
          }
        }}
        className={`relative flex h-35 w-full items-center justify-center rounded-seccion border-2 border-bunting px-3.5 text-center shadow-base-5 transition-[translate,rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1 group-hover:-rotate-2 ${FONDO_PASTEL[color]} ${animacion}`}
      >
        <span className="flex cursor-default flex-col items-center">
          <span className="font-jakarta text-15 font-extrabold text-bunting">
            {clase.nombre}
          </span>
          {/* Código: distingue clases con el mismo nombre (p. ej. Proyecto de Grado) */}
          <span className="mt-1 font-dm-sans text-11 font-medium tracking-etiqueta text-bunting/55">
            {clase.codigo}
          </span>
        </span>
        <SelloPrioridad
          prioridad={prioridad}
          estampando={estampando}
          nombreClase={clase.nombre}
          onAlternar={alternarPrioridad}
          onFinEstampado={() => setEstampando(false)}
        />
        <BotonQuitar
          etiqueta={`Quitar ${clase.nombre}`}
          titulo="Quitar clase"
          onQuitar={quitar}
        />
      </div>
    </div>
  )
}

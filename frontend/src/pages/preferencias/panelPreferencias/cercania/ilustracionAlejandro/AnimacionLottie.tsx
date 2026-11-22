import { useEffect, useRef } from 'react'
import lottie, {
  type AnimationItem,
} from 'lottie-web/build/player/lottie_light'

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface AnimacionLottieProps {
  /** JSON exportado del Lottie. */
  datos: object
  /** En pausa se queda quieta en el cuadro actual. */
  reproduciendo: boolean
  className?: string
}

/*
 * Reproduce un Lottie en bucle (renderer SVG, build "light" de lottie-web).
 * Con `prefers-reduced-motion` se queda en el primer cuadro.
 */
export default function AnimacionLottie({
  datos,
  reproduciendo,
  className,
}: AnimacionLottieProps) {
  const contenedor = useRef<HTMLDivElement>(null)
  const animacion = useRef<AnimationItem | null>(null)

  useEffect(() => {
    if (!contenedor.current) return
    const item = lottie.loadAnimation({
      container: contenedor.current,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      // lottie-web modifica los datos que recibe: se le pasa una copia.
      animationData: structuredClone(datos),
    })
    animacion.current = item
    return () => {
      item.destroy()
      animacion.current = null
    }
  }, [datos])

  useEffect(() => {
    const item = animacion.current
    if (!item) return
    if (reproduciendo && !reducirMovimiento()) item.play()
    else item.pause()
  }, [reproduciendo, datos])

  return <div ref={contenedor} aria-hidden className={className} />
}

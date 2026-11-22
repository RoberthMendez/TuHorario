import { lazy, Suspense, useState } from 'react'
import iconoSeccion from '../../../../assets/cercania/icono-seccion.svg'
import Interruptor from '../Interruptor'
import SeccionPreferencia from '../SeccionPreferencia'
import Cronometro from './Cronometro'

// lottie-web y los dos Lotties pesan ~230 kB: se cargan aparte para no
// demorar el resto de la página.
const IlustracionAlejandro = lazy(
  () => import('./ilustracionAlejandro/IlustracionAlejandro'),
)

const cambio = 'animate-aparecer motion-reduce:animate-none'

// Activar "Cercanía entre salones": el algoritmo prioriza que las clases
// seguidas queden en edificios cercanos. Apagada, Alejandro va corriendo y
// el cronómetro avanza; encendida, se relaja, camina y el cronómetro se para.
interface SeccionCercaniaProps {
  /** Quita esta preferencia del estudiante. */
  onQuitar: () => void
}

export default function SeccionCercania({ onQuitar }: SeccionCercaniaProps) {
  const [activa, setActiva] = useState(false)

  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Cercanía entre salones"
      onQuitar={onQuitar}
    >
      <div className="flex flex-col items-center gap-5 py-2 sm:flex-row sm:gap-7.5 sm:pr-3.5 sm:pl-3.25">
        <Suspense fallback={<div className="size-30 shrink-0" />}>
          <IlustracionAlejandro corriendo={!activa} />
        </Suspense>
        {/* Las partes del texto que cambian llevan `key` para animar su
            entrada; el cronómetro queda fuera para no reiniciarse. */}
        <p className="flex-1 font-dm-sans text-cercania text-biscay">
          Alejandro{' '}
          <span key={`a${activa}`} className={cambio}>
            {activa ? 'iba' : 'lleva'}
          </span>{' '}
          <Cronometro detenido={activa} />{' '}
          <span
            key={`b${activa}`}
            className={`[font-variation-settings:'opsz'_9] ${cambio}`}
          >
            {activa
              ? 'minutos tarde, pero como prefirió tener sus salones cerca,'
              : 'minutos caminando desde Básicas hasta el barón y NADA que llega, para evitar ser como Alejandro'}
          </span>{' '}
          <strong
            key={`c${activa}`}
            className={`font-bold text-bunting ${cambio}`}
          >
            {activa
              ? 'ahora va parchado de clase en clase.'
              : 'haz que tus clases queden cerca entre sí.'}
          </strong>
        </p>
        <Interruptor
          etiqueta="Priorizar salones cercanos"
          activo={activa}
          onCambiar={setActiva}
        />
      </div>
    </SeccionPreferencia>
  )
}

import { useState } from 'react'
import iconoSeccion from '../../../../assets/cercania/icono-seccion.svg'
import Interruptor from '../Interruptor'
import SeccionPreferencia from '../SeccionPreferencia'
import Cronometro from './Cronometro'
import IlustracionAlejandro from './IlustracionAlejandro'

// Activar "Cercanía entre salones": el algoritmo prioriza que las clases
// seguidas queden en edificios cercanos.
export default function SeccionCercania() {
  const [activa, setActiva] = useState(false)

  return (
    <SeccionPreferencia icono={iconoSeccion} titulo="Cercanía entre salones">
      <div className="flex flex-col items-center gap-5 py-2 sm:flex-row sm:gap-7.5 sm:pr-3.5 sm:pl-3.25">
        <IlustracionAlejandro />
        <p className="flex-1 font-dm-sans text-cercania text-biscay">
          Alejandro lleva <Cronometro />{' '}
          <span className="[font-variation-settings:'opsz'_9]">
            minutos caminando desde Básicas hasta el barón y NADA que llega,
            para evitar ser como Alejandro
          </span>{' '}
          <strong className="font-bold text-bunting">
            haz que tus clases queden cerca entre sí.
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

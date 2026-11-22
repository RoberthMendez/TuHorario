import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Estudiante } from '../../../types/Estudiante'
import PanelPreferencias from '../panelPreferencias/PanelPreferencias'
import CabeceraCarta from './CabeceraCarta'
import DatosEstudiante from './DatosEstudiante'
import Desplegable from './Desplegable'

interface CartaEstudianteProps {
  estudiante: Estudiante
  numero: number
}

// Carta de un estudiante: colapsada por defecto; la flecha la despliega y el
// ojo oculta/muestra sus datos personales.
export default function CartaEstudiante({
  estudiante,
  numero,
}: CartaEstudianteProps) {
  const [abierta, setAbierta] = useState(false)
  const [verDatos, setVerDatos] = useState(true)
  const idContenido = `preferencias-estudiante-${estudiante.id}`

  // Alto real de la cabecera: el panel de preferencias lo resta de la altura
  // de la pantalla para que la carta abierta (sin datos) mida lo mismo que
  // ella.
  const cabecera = useRef<HTMLDivElement>(null)
  const [altoCabecera, setAltoCabecera] = useState<number>()

  // Se mide al abrir/cerrar (al aparecer el ojo el nombre puede partirse en
  // dos líneas) y cada vez que la cabecera cambia de tamaño.
  useLayoutEffect(() => {
    const el = cabecera.current
    if (!el) return
    const medir = () => setAltoCabecera(el.getBoundingClientRect().height)
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(el)
    return () => observador.disconnect()
  }, [abierta])

  return (
    <article
      className="overflow-hidden rounded-resaltado border-2 border-bunting bg-white shadow-carta"
      style={
        altoCabecera
          ? ({ '--alto-cabecera': `${altoCabecera}px` } as CSSProperties)
          : undefined
      }
    >
      <CabeceraCarta
        ref={cabecera}
        numero={numero}
        nombre={estudiante.nombre}
        abierta={abierta}
        verDatos={verDatos}
        idContenido={idContenido}
        onAlternar={() => setAbierta((valor) => !valor)}
        onAlternarDatos={() => setVerDatos((valor) => !valor)}
      />
      <Desplegable abierto={abierta} id={idContenido}>
        <div className={abierta ? 'animate-entrar' : ''}>
          <DatosEstudiante estudiante={estudiante} visible={verDatos} />
        </div>
        <PanelPreferencias animar={abierta} />
      </Desplegable>
    </article>
  )
}

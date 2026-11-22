import { useState } from 'react'
import iconoSeccion from '../../../../assets/franjas/icono-seccion.svg'
import SeccionPreferencia from '../SeccionPreferencia'
import BotonesRapidos from './BotonesRapidos'
import GrillaFranjas from './GrillaFranjas'
import HorarioSinHuecos from './HorarioSinHuecos'
import { agregar, quitar } from './horas'
import LeyendaFranjas from './LeyendaFranjas'

export default function SeccionFranjas() {
  // Horas marcadas ("lunes|14"); la grilla las muestra como franjas.
  const [horas, setHoras] = useState<Set<string>>(new Set())
  const [sinHuecos, setSinHuecos] = useState(false)

  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Franjas Habilitadas"
      descripcion="Marca las horas en las que este estudiante quiere ver clase. Toca una casilla o arrastra para elegir varias horas a la vez."
    >
      <BotonesRapidos onMarcar={setHoras} />
      <div className="mt-3">
        <HorarioSinHuecos activo={sinHuecos} onCambiar={setSinHuecos} />
      </div>
      <div className="mt-4">
        <GrillaFranjas
          horas={horas}
          onAgregar={(franja) =>
            setHoras((actuales) => agregar(actuales, franja))
          }
          onQuitar={(franja) =>
            setHoras((actuales) => quitar(actuales, franja))
          }
        />
      </div>
      <div className="mt-4">
        <LeyendaFranjas />
      </div>
    </SeccionPreferencia>
  )
}

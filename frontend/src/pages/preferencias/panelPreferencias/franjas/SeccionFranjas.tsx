import { useState } from 'react'
import iconoSeccion from '../../../../assets/franjas/icono-seccion.svg'
import SeccionPreferencia from '../SeccionPreferencia'
import BotonesRapidos from './BotonesRapidos'
import GrillaFranjas from './GrillaFranjas'
import HorarioSinHuecos from './HorarioSinHuecos'
import { agregar, quitar } from './horas'

interface SeccionFranjasProps {
  /** "Horario sin huecos" vive en el panel: se prioriza por aparte. */
  sinHuecos: boolean
  onCambiarSinHuecos: (activo: boolean) => void
  /** Quita esta preferencia del estudiante. */
  onQuitar: () => void
}

export default function SeccionFranjas({
  sinHuecos,
  onCambiarSinHuecos,
  onQuitar,
}: SeccionFranjasProps) {
  // Horas marcadas ("lunes|14"); la grilla las muestra como franjas.
  const [horas, setHoras] = useState<Set<string>>(new Set())

  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Franjas Habilitadas"
      onQuitar={onQuitar}
      descripcion="Marca las horas en las que este estudiante quiere ver clase. Toca una casilla o arrastra para elegir varias horas a la vez."
    >
      <BotonesRapidos onMarcar={setHoras} />
      <div className="mt-3">
        <HorarioSinHuecos activo={sinHuecos} onCambiar={onCambiarSinHuecos} />
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
    </SeccionPreferencia>
  )
}

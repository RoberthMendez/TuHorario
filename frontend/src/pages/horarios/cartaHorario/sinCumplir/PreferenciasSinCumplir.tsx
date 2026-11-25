import iconoSinCumplir from '../../../../assets/sinCumplir/icono-seccion.svg'
import { primerNombre } from '../../../../components/avatarCompanero/iniciales'
import Seccion from '../../../../components/Seccion'
import type { HorarioEstudiante } from '../../../../types/HorarioEstudiante'
import FichaIncumplida from './fichaIncumplida/FichaIncumplida'
import TodoCumplido from './TodoCumplido'

interface PreferenciasSinCumplirProps {
  /** Horario del estudiante, con lo que no se le cumplió. */
  horario: HorarioEstudiante
  animar: boolean
}

export default function PreferenciasSinCumplir({
  horario,
  animar,
}: PreferenciasSinCumplirProps) {
  const preferencias = horario.preferenciasNoCumplidas
  const nombre = primerNombre(horario.nombre)
  const hay = preferencias.length > 0
  return (
    <Seccion
      icono={iconoSinCumplir}
      titulo="Preferencias sin cumplir"
      descripcion={
        hay
          ? `Estas preferencias de ${nombre} no cupieron en el horario armado.`
          : undefined
      }
      extra={
        <span className="flex h-5 min-w-7 items-center justify-center rounded-full bg-bunting px-2 font-jakarta text-13 font-extrabold text-white">
          {preferencias.length}
        </span>
      }
    >
      {hay ? (
        <ul className="grid gap-x-4 gap-y-3.5 escritorio:grid-cols-2">
          {preferencias.map((preferencia, i) => (
            <FichaIncumplida
              // El texto puede repetirse (p. ej. dos sesiones fuera de franja).
              key={`${preferencia.caso}-${i}`}
              preferencia={preferencia}
              horario={horario}
              animar={animar}
              orden={i}
            />
          ))}
        </ul>
      ) : (
        <TodoCumplido nombre={nombre} animar={animar} />
      )}
    </Seccion>
  )
}

import iconoSinCumplir from '../../../../assets/sinCumplir/icono-seccion.svg'
import Seccion from '../../../../components/Seccion'
import PreferenciaIncumplida from './PreferenciaIncumplida'
import TodoCumplido from './TodoCumplido'

interface PreferenciasSinCumplirProps {
  /** Primer nombre del estudiante. */
  nombre: string
  preferencias: string[]
  animar: boolean
}

export default function PreferenciasSinCumplir({
  nombre,
  preferencias,
  animar,
}: PreferenciasSinCumplirProps) {
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
        <ul className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          {preferencias.map((texto, i) => (
            <PreferenciaIncumplida
              key={texto}
              texto={texto}
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

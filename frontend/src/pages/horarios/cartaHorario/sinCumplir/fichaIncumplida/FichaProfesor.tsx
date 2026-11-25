import AvatarProfesor from '../../../../../components/avatarProfesor/AvatarProfesor'
import { FONDO_PASTEL, colorDeClase } from '../../../../../styles/colores'
import type { ProfesorCalificado } from '../../../../../types/HorarioEstudiante'
import type { Clase } from '../../../../../types/Preferencias'
import NotaProfesor from './NotaProfesor'

interface FichaProfesorProps {
  /** null: el curso no tiene profesor. */
  profesor: ProfesorCalificado | null
  /** "Te tocó" o "Preferías". */
  rotulo: string
  /** Clase del curso: da el color de fondo de la cara. */
  clase: Clase
}

// Un profesor en pequeño, con la misma cara que en Preferencias según la
// calificación que le diste (triste y en gris si lo vetaste, celebrando si
// era un "¡Sí o sí!"); sin calificar, la cara de "Si toca, toca".
export default function FichaProfesor({
  profesor,
  rotulo,
  clase,
}: FichaProfesorProps) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      {profesor ? (
        <AvatarProfesor
          genero={profesor.genero}
          nivel={profesor.nota ?? 1}
          fondo={FONDO_PASTEL[colorDeClase(clase.id)]}
          className="size-12 shrink-0 rounded-icono transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 motion-reduce:transition-none"
        />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-icono border-[1.5px] border-dashed border-bunting bg-zircon-21 font-jakarta text-18 font-extrabold text-east-bay">
          ?
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <span className="font-dm-sans text-11 font-bold tracking-etiqueta text-east-bay uppercase">
          {rotulo}
        </span>
        <span className="truncate font-jakarta text-13 font-extrabold text-bunting">
          {profesor?.nombre ?? 'Sin profesor'}
        </span>
        <NotaProfesor nota={profesor ? profesor.nota : null} />
      </span>
    </span>
  )
}

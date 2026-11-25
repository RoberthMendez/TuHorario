import type {
  PreferenciaClase,
  Profesor,
} from '../../../../../types/Preferencias'
import { FONDO_PASTEL } from '../../../../../styles/colores'
import TextoResaltado from '../../modalSeleccion/TextoResaltado'
import AvatarProfesor from '../../../../../components/avatarProfesor/AvatarProfesor'

interface FilaProfesorProps {
  profesor: Profesor
  /** Clases del estudiante que dicta (cada una con su color). */
  clases: PreferenciaClase[]
  consulta: string
}

// Contenido de un profesor en la lista del modal: su cara (con el color de su
// clase), el nombre y las asignaturas que dicta, todo resaltando la búsqueda.
export default function FilaProfesor({
  profesor,
  clases,
  consulta,
}: FilaProfesorProps) {
  return (
    <>
      <AvatarProfesor
        genero={profesor.genero}
        nivel={2}
        fondo={FONDO_PASTEL[clases[0]?.color ?? 'titan-white']}
        className="size-10.5 shrink-0 rounded-icono transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/fila:-rotate-6"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-jakarta text-15 font-extrabold text-bunting">
          <TextoResaltado texto={profesor.nombre} consulta={consulta} />
        </span>
        <span className="mt-1 flex flex-wrap gap-1">
          {clases.map((p) => (
            <span
              key={p.clase.id}
              className={`rounded-full border border-bunting/20 px-2 py-px font-dm-sans text-11 font-bold text-bunting ${FONDO_PASTEL[p.color]}`}
            >
              <TextoResaltado texto={p.clase.nombre} consulta={consulta} />
            </span>
          ))}
        </span>
      </span>
    </>
  )
}

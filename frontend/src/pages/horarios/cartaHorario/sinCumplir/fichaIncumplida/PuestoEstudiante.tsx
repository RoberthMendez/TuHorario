import AvatarCompanero from '../../../../../components/avatarCompanero/AvatarCompanero'

interface PuestoEstudianteProps {
  /** Nombre completo (para las iniciales). */
  nombre: string
  /** Lo que se lee encima del curso: "Tú" o el primer nombre. */
  etiqueta: string
  /** Fondo del avatar. */
  fondo: string
  /** Curso en el que quedó en la clase; null si no quedó. */
  curso: string | null
  /** Qué se lee cuando no quedó en la clase. */
  sinCurso: string
}

// Un estudiante en la clase: sus iniciales y el curso en el que quedó (o, en
// rojo, que no quedó).
export default function PuestoEstudiante({
  nombre,
  etiqueta,
  fondo,
  curso,
  sinCurso,
}: PuestoEstudianteProps) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <AvatarCompanero
        nombre={nombre}
        fondo={fondo}
        className="size-9 text-12 transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-8 motion-reduce:transition-none"
      />
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-jakarta text-13 font-extrabold text-bunting">
          {etiqueta}
        </span>
        <span
          className={`font-dm-sans text-12 font-bold whitespace-nowrap ${curso ? 'text-east-bay' : 'text-alizarin'}`}
        >
          {curso ?? sinCurso}
        </span>
      </span>
    </span>
  )
}

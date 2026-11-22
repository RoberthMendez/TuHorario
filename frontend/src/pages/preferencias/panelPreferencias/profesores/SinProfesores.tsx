import iconoSeccion from '../../../../assets/profesores/icono-seccion.svg'
import BotonAnadir from '../BotonAnadir'

interface SinProfesoresProps {
  /** Todavía no hay clases: no se pueden elegir profesores. */
  sinClases: boolean
  onAnadir: () => void
}

// Estado vacío de "Tus profesores".
export default function SinProfesores({
  sinClases,
  onAnadir,
}: SinProfesoresProps) {
  return (
    <div className="flex flex-col items-center px-4 pt-2 pb-3 text-center">
      <span className="flex size-13 -rotate-6 animate-flotar items-center justify-center rounded-seccion border-2 border-bunting bg-white shadow-base-4 motion-reduce:animate-none">
        <img src={iconoSeccion} alt="" className="size-7" />
      </span>
      <p className="mt-4 font-jakarta text-18 font-extrabold text-bunting">
        {sinClases ? 'Primero elige tus clases' : 'Todavía no hay profesores'}
      </p>
      <p className="mt-1 max-w-95 font-dm-sans text-14 text-east-bay">
        {sinClases
          ? 'Los profesores salen según las clases que agregues en «Clases del semestre».'
          : 'Añade los profesores de tus clases y dale a cada uno un nivel de 0 a 3.'}
      </p>
      {!sinClases && (
        <div className="mt-5">
          <BotonAnadir texto="Añadir profesor" onClick={onAnadir} />
        </div>
      )}
    </div>
  )
}

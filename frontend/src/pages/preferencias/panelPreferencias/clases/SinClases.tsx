import iconoSeccion from '../../../../assets/clases/icono-seccion.svg'
import BotonAnadir from '../BotonAnadir'

interface SinClasesProps {
  onAnadir: () => void
}

// Estado inicial de "Clases del semestre": todavía no hay clases.
export default function SinClases({ onAnadir }: SinClasesProps) {
  return (
    <div className="flex flex-col items-center px-4 pb-3 text-center">
      <span className="relative flex size-16 items-center justify-center">
        <span className="flex size-13 -rotate-6 animate-flotar items-center justify-center rounded-seccion border-2 border-bunting bg-white shadow-base-4 motion-reduce:animate-none">
          <img src={iconoSeccion} alt="" className="size-7" />
        </span>
      </span>
      <p className="mt-4 font-jakarta text-18 font-extrabold text-bunting">
        Todavía no hay clases
      </p>
      <p className="mt-1 max-w-95 font-dm-sans text-14 text-east-bay">
        Añade las materias que este estudiante va a inscribir. Puedes elegir
        varias a la vez.
      </p>
      <div className="mt-5">
        <BotonAnadir texto="Añadir clase" onClick={onAnadir} />
      </div>
    </div>
  )
}

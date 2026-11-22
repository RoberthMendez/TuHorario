import iconoSeccion from '../../../../../assets/companeros/icono-seccion.svg'

interface SinCompanerosProps {
  /** Todavía no hay clases: no hay con qué emparejar a nadie. */
  sinClases: boolean
}

// Estado vacío de la caja de clases con compañeros.
export default function SinCompaneros({ sinClases }: SinCompanerosProps) {
  return (
    <div className="flex cursor-default flex-col items-center px-4 pt-2 pb-1 text-center">
      <span className="flex size-13 -rotate-6 animate-flotar items-center justify-center rounded-seccion border-2 border-bunting bg-white shadow-base-4 motion-reduce:animate-none">
        <img src={iconoSeccion} alt="" className="size-7" />
      </span>
      <p className="mt-4 font-jakarta text-18 font-extrabold text-bunting">
        {sinClases ? 'Primero elige tus clases' : 'Todavía no hay compañeros'}
      </p>
      <p className="mt-1 max-w-100 font-dm-sans text-14 text-east-bay">
        {sinClases
          ? 'Con cada compañero eliges en qué clases coincidir, así que agrega antes tus clases en «Clases del semestre».'
          : 'Busca arriba a un compañero y elige las clases que quieres ver con él o ella.'}
      </p>
    </div>
  )
}

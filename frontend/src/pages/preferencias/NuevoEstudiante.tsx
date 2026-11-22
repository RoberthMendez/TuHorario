import iconoNuevoEstudiante from '../../assets/icono-nuevo-estudiante.svg'

interface NuevoEstudianteProps {
  onClick: () => void
}

export default function NuevoEstudiante({ onClick }: NuevoEstudianteProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-26.25 w-full cursor-pointer items-center gap-4.5 rounded-resaltado border-3 border-dashed border-sapphire bg-white px-6 py-4 text-left transition-[translate,background-color] duration-200 hover:-translate-y-0.5 hover:bg-zircon-10"
    >
      <span className="flex size-15 shrink-0 items-center justify-center rounded-full border-2 border-bunting bg-buttercup shadow-base-5">
        <img
          src={iconoNuevoEstudiante}
          alt=""
          className="size-7.5 transition-[rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-90"
        />
      </span>
      <span>
        <span className="block font-jakarta text-22 font-extrabold text-bunting">
          Nuevo Estudiante
        </span>
        <span className="mt-0.5 block font-dm-sans text-15 text-east-bay">
          Toca para agregar un nuevo estudiante
        </span>
      </span>
    </button>
  )
}

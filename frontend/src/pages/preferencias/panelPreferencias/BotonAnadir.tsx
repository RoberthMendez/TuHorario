import iconoMas from '../../../assets/clases/icono-mas.svg'

interface BotonAnadirProps {
  texto: string
  onClick: () => void
}

// Botón azul "Añadir …" que abre un modal de selección.
export default function BotonAnadir({ texto, onClick }: BotonAnadirProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className="group/anadir boton-3d flex h-11.25 items-center gap-2 rounded-icono border-2 border-bunting bg-sapphire px-5 font-dm-sans text-15 font-bold text-white [--boton-3d-altura:4] [--boton-3d-color:var(--color-bunting)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire"
    >
      <img
        src={iconoMas}
        alt=""
        className="size-4.5 transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/anadir:rotate-90"
      />
      {texto}
    </button>
  )
}

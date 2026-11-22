interface BotonRapidoProps {
  icono: string
  texto: string
  onClick: () => void
  /** "Limpiar": rojo, con la sombra 3D también roja. */
  peligro?: boolean
}

// Botón de selección rápida. El ícono gira un poco al pasar el mouse.
export default function BotonRapido({
  icono,
  texto,
  onClick,
  peligro = false,
}: BotonRapidoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group boton-3d flex h-10.5 items-center gap-2.5 rounded-icono border-2 px-5.5 font-dm-sans text-16 font-bold [--boton-3d-altura:4] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sapphire ${
        peligro
          ? 'border-alizarin bg-fair-pink text-alizarin-oscuro [--boton-3d-color:var(--color-alizarin)]'
          : 'border-bunting bg-white text-bunting [--boton-3d-color:var(--color-bunting)]'
      }`}
    >
      <img
        src={icono}
        alt=""
        className="size-5 transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12"
      />
      {texto}
    </button>
  )
}

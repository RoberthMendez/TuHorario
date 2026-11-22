import iconoListo from '../../../../../assets/companeros/icono-listo.svg'

interface BotonListoProps {
  deshabilitado: boolean
  onClick: () => void
}

export default function BotonListo({
  deshabilitado,
  onClick,
}: BotonListoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deshabilitado}
      className="boton-3d flex h-10 items-center gap-1.5 rounded-bloque border-2 border-bunting bg-buttercup px-4 font-jakarta text-15 font-extrabold text-bunting [--boton-3d-altura:4] [--boton-3d-color:var(--color-bunting)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sapphire disabled:pointer-events-none disabled:opacity-45"
    >
      <img src={iconoListo} alt="" className="size-5" />
      Listo
    </button>
  )
}

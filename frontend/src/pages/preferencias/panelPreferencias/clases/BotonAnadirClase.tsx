import iconoMas from '../../../../assets/clases/icono-mas.svg'

export default function BotonAnadirClase() {
  return (
    <button
      type="button"
      className="boton-3d flex h-11.25 items-center gap-2 rounded-icono border-2 border-bunting bg-sapphire px-5 font-dm-sans text-15 font-bold text-white [--boton-3d-altura:4] [--boton-3d-color:var(--color-bunting)]"
    >
      <img src={iconoMas} alt="" className="size-4.5" />
      Añadir clase
    </button>
  )
}

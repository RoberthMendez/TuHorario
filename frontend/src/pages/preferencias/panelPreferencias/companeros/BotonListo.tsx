import iconoListo from '../../../../assets/companeros/icono-listo.svg'

export default function BotonListo() {
  return (
    <button
      type="button"
      className="boton-3d flex h-10 items-center gap-1.5 rounded-bloque border-2 border-bunting bg-buttercup px-4 font-jakarta text-15 font-extrabold text-bunting [--boton-3d-altura:4] [--boton-3d-color:var(--color-bunting)]"
    >
      <img src={iconoListo} alt="" className="size-5" />
      Listo
    </button>
  )
}

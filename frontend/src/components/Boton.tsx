interface BotonProps {
  texto: string
  icono?: string
  onClick?: () => void
}

// Botón amarillo con efecto 3D (`boton-3d`, definido en styles/tema.css).
export default function Boton({ texto, icono, onClick }: BotonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="boton-3d inline-flex h-20 shrink-0 items-center gap-4.5 rounded-boton border-2 border-madison bg-amarillo pr-4 pl-8.5 font-dm-sans text-boton font-bold text-madison focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cerulean"
    >
      {texto}
      {icono && (
        <span className="flex size-10 items-center justify-center rounded-icono bg-madison">
          <img src={icono} alt="" className="size-5.5" />
        </span>
      )}
    </button>
  )
}

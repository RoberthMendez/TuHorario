interface EncabezadoModalProps {
  idTitulo: string
  icono: string
  titulo: string
  descripcion: string
  onCerrar: () => void
}

export default function EncabezadoModal({
  idTitulo,
  icono,
  titulo,
  descripcion,
  onCerrar,
}: EncabezadoModalProps) {
  return (
    <header className="flex items-start gap-3.5">
      <span className="flex size-11 shrink-0 -rotate-6 items-center justify-center rounded-insignia border-2 border-bunting bg-supernova shadow-base-3">
        <img src={icono} alt="" className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <h2
          id={idTitulo}
          className="font-jakarta text-22 font-extrabold text-bunting"
        >
          {titulo}
        </h2>
        <p className="mt-0.5 font-dm-sans text-14 text-east-bay">
          {descripcion}
        </p>
      </div>
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar"
        title="Cerrar"
        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-icono border-2 border-bunting bg-white text-bunting transition-[background-color,scale] duration-200 hover:scale-105 hover:bg-zircon-21 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire"
      >
        <svg viewBox="0 0 13 13" fill="none" aria-hidden className="size-3.5">
          <path
            d="M3.25 3.25L9.75 9.75M9.75 3.25L3.25 9.75"
            stroke="currentColor"
            strokeWidth="1.73333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </header>
  )
}

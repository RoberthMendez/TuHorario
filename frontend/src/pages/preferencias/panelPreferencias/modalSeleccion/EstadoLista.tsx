import iconoBuscar from '../../../../assets/profesores/icono-buscar.svg'

interface EstadoListaProps {
  titulo: string
  texto: string
  accion?: { texto: string; onClick: () => void }
}

// Mensaje centrado en lugar de la lista (sin resultados o error al cargar).
export default function EstadoLista({
  titulo,
  texto,
  accion,
}: EstadoListaProps) {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <span className="flex size-12 animate-pop items-center justify-center rounded-full border-2 border-dashed border-periwinkle-gray bg-zircon-10">
        <img src={iconoBuscar} alt="" className="size-5.5 opacity-60" />
      </span>
      <p className="mt-3 font-jakarta text-16 font-extrabold text-bunting">
        {titulo}
      </p>
      <p className="mt-1 max-w-80 font-dm-sans text-14 text-east-bay">
        {texto}
      </p>
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="boton-3d mt-4 h-10 rounded-icono border-2 border-bunting bg-white px-4 font-dm-sans text-14 font-bold text-bunting [--boton-3d-altura:3] [--boton-3d-color:var(--color-bunting)]"
        >
          {accion.texto}
        </button>
      )}
    </div>
  )
}

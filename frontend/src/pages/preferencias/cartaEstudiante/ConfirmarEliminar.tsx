import { useEffect, useRef } from 'react'

interface ConfirmarEliminarProps {
  id: string
  nombre: string
  /** Mientras responde el servicio. */
  eliminando: boolean
  onCancelar: () => void
  onConfirmar: () => void
}

/*
 * Franja rosada bajo la cabecera que pide confirmar antes de eliminar: se
 * pierden las clases y preferencias del estudiante. El foco va a "Cancelar"
 * (lo seguro) y Escape también cancela.
 */
export default function ConfirmarEliminar({
  id,
  nombre,
  eliminando,
  onCancelar,
  onConfirmar,
}: ConfirmarEliminarProps) {
  const cancelar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelar.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div
      id={id}
      role="alertdialog"
      aria-label={`Eliminar a ${nombre}`}
      onKeyDown={(e) => e.key === 'Escape' && !eliminando && onCancelar()}
      className="flex animate-entrar-chip flex-col gap-3 border-t-2 border-dashed border-alizarin bg-fair-pink px-5 py-3.5 motion-reduce:animate-none sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="font-dm-sans text-15 text-bunting">
        ¿Eliminar a <strong className="font-extrabold">{nombre}</strong>? Se
        borrarán sus clases y preferencias.
      </p>
      <div className="flex shrink-0 gap-2.5">
        <button
          ref={cancelar}
          type="button"
          onClick={onCancelar}
          disabled={eliminando}
          className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-icono border-2 border-bunting bg-white px-4 font-dm-sans text-14 font-bold text-bunting transition-[translate,background-color] duration-200 hover:-translate-y-0.5 hover:bg-zircon-21 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire disabled:opacity-60 sm:flex-none"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirmar}
          disabled={eliminando}
          className="boton-3d flex h-10 flex-1 items-center justify-center rounded-icono border-2 border-bunting bg-alizarin px-4 font-dm-sans text-14 font-bold whitespace-nowrap text-white [--boton-3d-altura:3] [--boton-3d-color:var(--color-bunting)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire disabled:cursor-wait disabled:opacity-80 sm:flex-none"
        >
          {eliminando ? 'Eliminando…' : 'Sí, eliminar'}
        </button>
      </div>
    </div>
  )
}

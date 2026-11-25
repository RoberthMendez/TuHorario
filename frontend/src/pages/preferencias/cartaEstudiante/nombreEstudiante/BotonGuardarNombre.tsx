interface BotonGuardarNombreProps {
  guardando: boolean
}

/*
 * Chulo que reemplaza al lápiz mientras se edita el nombre: guarda (igual que
 * Enter). No le quita el foco al campo al presionarlo, para que el "blur" no
 * se adelante al clic.
 */
export default function BotonGuardarNombre({
  guardando,
}: BotonGuardarNombreProps) {
  return (
    <button
      type="submit"
      onMouseDown={(e) => e.preventDefault()}
      disabled={guardando}
      aria-label="Guardar nombre"
      title="Guardar nombre (Enter)"
      className="flex size-8 shrink-0 animate-pop cursor-pointer items-center justify-center rounded-full text-sapphire transition-colors hover:bg-zircon-21 focus-visible:outline-2 focus-visible:outline-sapphire disabled:cursor-wait disabled:opacity-60"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4.5">
        <path
          d="M5 12.5L10 17.5L19 7"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

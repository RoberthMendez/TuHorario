interface BotonQuitarPreferenciaProps {
  /** Nombre de la preferencia, para el lector de pantalla. */
  titulo: string
  onQuitar: () => void
}

/*
 * X discreta en el encabezado de una preferencia opcional (la misma X con la
 * que se quitan clases y profesores; la caneca ya es "restringir" en
 * Compañeros). Al pasarle el mouse se tiñe de rojo pastel y gira.
 */
export default function BotonQuitarPreferencia({
  titulo,
  onQuitar,
}: BotonQuitarPreferenciaProps) {
  return (
    <button
      type="button"
      onClick={onQuitar}
      aria-label={`Quitar la preferencia ${titulo}`}
      title="Quitar preferencia"
      className="group/quitar flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-bloque border-[1.5px] border-mischka text-east-bay transition-[background-color,border-color,color,scale] duration-200 hover:scale-110 hover:border-alizarin hover:bg-fair-pink hover:text-alizarin focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire"
    >
      <svg
        viewBox="0 0 13 13"
        fill="none"
        aria-hidden
        className="size-3.25 transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/quitar:rotate-90"
      >
        <path
          d="M3.25 3.25L9.75 9.75M9.75 3.25L3.25 9.75"
          stroke="currentColor"
          strokeWidth="1.73333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

interface CirculoDecorativoProps {
  /** Posición, tamaño y color (clases de Tailwind). */
  className: string
}

export default function CirculoDecorativo({
  className,
}: CirculoDecorativoProps) {
  return <div aria-hidden className={`absolute rounded-full ${className}`} />
}

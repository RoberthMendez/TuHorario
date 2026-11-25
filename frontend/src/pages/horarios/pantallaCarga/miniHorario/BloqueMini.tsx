interface BloqueMiniProps {
  columna: number
  fila: number
  horas: number
  fondo: string
  orden: number
}

// Una "clase" del mini horario: aparece con un pop, se queda un rato y se va.
export default function BloqueMini({
  columna,
  fila,
  horas,
  fondo,
  orden,
}: BloqueMiniProps) {
  return (
    <div
      className={`m-0.75 animate-llenar rounded-mini border-2 border-bunting shadow-base-3 motion-reduce:animate-none ${fondo}`}
      style={{
        gridColumn: columna + 1,
        gridRow: `${fila + 1} / span ${horas}`,
        animationDelay: `${orden * 260}ms`,
      }}
    />
  )
}

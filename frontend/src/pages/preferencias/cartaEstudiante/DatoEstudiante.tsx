interface DatoEstudianteProps {
  icono: string
  etiqueta: string
  valor: string
  /** Giro de la ficha amarilla (cada una va un poco torcida en el diseño). */
  inclinacion: string
}

export default function DatoEstudiante({
  icono,
  etiqueta,
  valor,
  inclinacion,
}: DatoEstudianteProps) {
  return (
    <div className="group flex items-center gap-3">
      <span
        className={`flex h-12 w-12.5 shrink-0 items-center justify-center rounded-bloque border-2 border-bunting bg-supernova shadow-diagonal transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-0 ${inclinacion}`}
      >
        <img src={icono} alt="" className="size-5.75" />
      </span>
      <div className="min-w-0">
        <p className="font-dm-sans text-12 font-bold tracking-etiqueta text-east-bay uppercase">
          {etiqueta}
        </p>
        <p className="mt-1 font-dm-sans text-15 font-medium break-words text-bunting">
          {valor}
        </p>
      </div>
    </div>
  )
}

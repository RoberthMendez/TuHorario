interface InsigniaNumeroProps {
  numero: number
}

export default function InsigniaNumero({ numero }: InsigniaNumeroProps) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-icono border-2 border-bunting bg-sapphire font-jakarta text-18 font-extrabold text-white shadow-diagonal">
      {numero}
    </span>
  )
}

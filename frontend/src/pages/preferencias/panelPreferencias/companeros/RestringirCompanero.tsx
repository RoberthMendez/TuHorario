import iconoRestringir from '../../../../assets/companeros/icono-restringir.svg'

interface RestringirCompaneroProps {
  nombre: string
  restringidos: number
}

export default function RestringirCompanero({
  nombre,
  restringidos,
}: RestringirCompaneroProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
      <button
        type="button"
        className="flex h-11.75 cursor-pointer items-center gap-3 rounded-icono border-[1.5px] border-alizarin bg-fair-pink pr-4 pl-2 font-dm-sans text-14 font-bold text-alizarin-oscuro transition-[translate] duration-200 hover:-translate-y-0.5"
      >
        <span className="flex size-7.5 items-center justify-center rounded-mini bg-alizarin">
          <img src={iconoRestringir} alt="" className="size-4.5" />
        </span>
        Restringir estudiante
      </button>
      <p className="font-dm-sans text-13 text-alizarin-oscuro">
        No verás ninguna clase con {nombre}
      </p>
      <button
        type="button"
        className="cursor-pointer font-dm-sans text-13 text-alizarin-oscuro underline sm:ml-auto"
      >
        Ver Restringidos ({restringidos})
      </button>
    </div>
  )
}

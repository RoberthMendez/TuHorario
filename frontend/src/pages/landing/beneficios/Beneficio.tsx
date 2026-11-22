import iconoCheck from '../../../assets/icono-check.svg'

interface BeneficioProps {
  texto: string
}

export default function Beneficio({ texto }: BeneficioProps) {
  return (
    <li className="flex items-center gap-2 font-dm-sans text-beneficio font-medium whitespace-nowrap text-madison">
      <img src={iconoCheck} alt="" className="size-4.5" />
      {texto}
    </li>
  )
}

import iconoIncumplida from '../../../../assets/sinCumplir/icono-incumplida.svg'

interface PreferenciaIncumplidaProps {
  texto: string
  animar: boolean
  orden: number
}

// Ficha de una preferencia que no cupo: una "x" roja y la preferencia.
export default function PreferenciaIncumplida({
  texto,
  animar,
  orden,
}: PreferenciaIncumplidaProps) {
  return (
    <li
      style={{ animationDelay: `${200 + orden * 70}ms` }}
      // Como los bloques del cronograma: sube sin girar (texto nítido) y sin
      // cursor de texto; solo la "x" gira.
      className={`group flex min-h-13 cursor-default items-center gap-3.5 rounded-bloque border-2 border-bunting bg-zircon-21 px-3 py-2 transition-[translate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] select-none hover:-translate-y-[round(calc(var(--u)*2),1px)] motion-reduce:transition-none ${animar ? 'animate-entrar' : ''}`}
    >
      <span className="flex size-5.5 shrink-0 items-center justify-center rounded-insignia border-2 border-bunting bg-carmesi transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-90 motion-reduce:transition-none">
        <img src={iconoIncumplida} alt="" className="size-3" />
      </span>
      <span className="font-jakarta text-15 font-extrabold text-bunting">
        {texto}
      </span>
    </li>
  )
}

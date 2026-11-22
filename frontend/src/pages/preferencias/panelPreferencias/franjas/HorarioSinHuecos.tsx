import iconoSinHuecos from '../../../../assets/franjas/icono-sin-huecos.svg'
import Interruptor from '../Interruptor'

interface HorarioSinHuecosProps {
  activo: boolean
  onCambiar: (activo: boolean) => void
}

export default function HorarioSinHuecos({
  activo,
  onCambiar,
}: HorarioSinHuecosProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3.25 gap-y-3 rounded-caja border-2 border-bunting bg-zircon-10 px-4 py-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-icono border-2 border-bunting bg-beeswax">
        <img src={iconoSinHuecos} alt="" className="size-5.25" />
      </span>
      <div className="min-w-40 flex-1">
        <p className="font-jakarta text-16 font-extrabold text-bunting">
          Horario sin huecos
        </p>
        <p className="font-dm-sans text-14 text-east-bay">
          Las clases quedan seguidas, sin horas libres entre una y otra.
        </p>
      </div>
      <Interruptor
        etiqueta="Horario sin huecos"
        activo={activo}
        onCambiar={onCambiar}
        grande
      />
    </div>
  )
}

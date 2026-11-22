import iconoInterruptor from '../../../assets/cercania/icono-interruptor.svg'

interface InterruptorProps {
  etiqueta: string
  /** `grande`: el de "Horario sin huecos" (100 × 44 en el diseño). */
  grande?: boolean
}

// Interruptor SÍ/NO del diseño, en su estado "NO" (todavía sin lógica).
export default function Interruptor({
  etiqueta,
  grande = false,
}: InterruptorProps) {
  return (
    <span
      role="switch"
      aria-checked="false"
      aria-label={etiqueta}
      className={`flex shrink-0 items-center rounded-full border-2 border-bunting pl-0.75 ${
        grande
          ? 'h-11 w-25 bg-link-water shadow-base-4'
          : 'h-10 w-23.5 bg-zircon-21 shadow-base-3'
      }`}
    >
      <span
        className={`flex items-center justify-center border-2 border-bunting bg-white ${
          grande ? 'h-8 w-9.5 rounded-full' : 'size-7 rounded-full'
        }`}
      >
        <img
          src={iconoInterruptor}
          alt=""
          className={grande ? 'size-4' : 'size-3.5'}
        />
      </span>
      <span
        className={`mx-auto font-dm-sans text-14 font-extrabold tracking-[calc(var(--u)*0.56)] ${
          grande ? 'text-east-bay' : 'text-bunting'
        }`}
      >
        NO
      </span>
    </span>
  )
}

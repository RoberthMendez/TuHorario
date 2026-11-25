import ojo from '../../../assets/cartaEstudiante/ojo.svg'

// Bajo la cabecera, mientras los datos del estudiante están ocultos (lo
// normal al abrir la carta): recuerda que el ojo junto al nombre los muestra.
export default function PistaDatos() {
  return (
    <div className="px-5 pb-4">
      <p className="flex w-fit items-center gap-2.5 rounded-etiqueta border-2 border-dashed border-periwinkle-gray bg-zircon-10 px-3.5 py-2 font-dm-sans text-13 font-bold text-east-bay">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zircon-21">
          <img
            src={ojo}
            alt=""
            className="size-4.5 animate-pestanear motion-reduce:animate-none"
          />
        </span>
        <span>
          Sus datos están ocultos: dale al{' '}
          <span className="text-bunting">ojo</span> junto a su nombre para ver
          su correo, teléfono, documento y código.
        </span>
      </p>
    </div>
  )
}

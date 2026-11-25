import iconoTodoCumplido from '../../../assets/icono-todo-cumplido.svg'

interface EstadoCumplimientoProps {
  sinCumplir: number
}

// Píldora de la cabecera: verde si todo se cumplió, índigo con cuántas
// preferencias quedaron por fuera si no.
export default function EstadoCumplimiento({
  sinCumplir,
}: EstadoCumplimientoProps) {
  const base =
    'inline-flex h-7.5 shrink-0 animate-pop items-center gap-1.5 rounded-full border-2 border-bunting px-3 font-jakarta text-13 font-extrabold'
  if (sinCumplir === 0) {
    return (
      <span
        style={{ animationDelay: '300ms' }}
        className={`${base} bg-white-ice text-bunting`}
      >
        <img src={iconoTodoCumplido} alt="" className="size-4" />
        Todo cumplido
      </span>
    )
  }
  return (
    <span
      style={{ animationDelay: '300ms' }}
      className={`${base} bg-bunting text-white`}
    >
      {sinCumplir} sin cumplir
    </span>
  )
}

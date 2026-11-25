import iconoTodoCumplido from '../../../../assets/icono-todo-cumplido.svg'

interface ConteoClasesProps {
  inscritas: number
  pedidas: number
}

// "6 de 7 clases", a la derecha del título del cronograma: verde si entraron
// todas, amarilla si alguna quedó por fuera.
export default function ConteoClases({
  inscritas,
  pedidas,
}: ConteoClasesProps) {
  const todas = inscritas === pedidas
  return (
    <span
      title={
        todas
          ? 'Entraron todas las clases pedidas'
          : `${pedidas - inscritas} de las clases pedidas no cupieron`
      }
      style={{ animationDelay: '250ms' }}
      className={`inline-flex h-7.5 animate-pop cursor-default items-center gap-1.5 rounded-full border-2 border-bunting px-3 font-jakarta text-13 font-extrabold text-bunting select-none ${todas ? 'bg-white-ice' : 'bg-beeswax'}`}
    >
      {todas && <img src={iconoTodoCumplido} alt="" className="size-4" />}
      {inscritas} de {pedidas} {pedidas === 1 ? 'clase' : 'clases'}
    </span>
  )
}

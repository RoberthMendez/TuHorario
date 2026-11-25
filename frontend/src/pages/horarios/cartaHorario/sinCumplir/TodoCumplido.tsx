import iconoTodoCumplido from '../../../../assets/icono-todo-cumplido.svg'

interface TodoCumplidoProps {
  nombre: string
  animar: boolean
}

// Cuando todas las preferencias cupieron: una ficha verde de celebración.
export default function TodoCumplido({ nombre, animar }: TodoCumplidoProps) {
  return (
    <div
      style={{ animationDelay: '200ms' }}
      className={`flex items-center gap-3.5 rounded-bloque border-2 border-bunting bg-white-ice px-4 py-3.5 ${animar ? 'animate-entrar' : ''}`}
    >
      <span
        style={{ animationDelay: '450ms' }}
        className={`flex size-9 shrink-0 items-center justify-center rounded-insignia border-2 border-bunting bg-mountain-meadow shadow-base-3 ${animar ? 'animate-pop' : ''}`}
      >
        <img src={iconoTodoCumplido} alt="" className="size-5" />
      </span>
      <p className="font-dm-sans text-15 text-biscay">
        <strong className="font-jakarta font-extrabold text-bunting">
          ¡Todo encajó!
        </strong>{' '}
        Cada preferencia de {nombre} cupo en su horario.
      </p>
    </div>
  )
}

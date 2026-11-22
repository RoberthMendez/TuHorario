interface CartaPrimerEstudianteProps {
  /** Lo que se va escribiendo en el campo del nombre. */
  nombre: string
}

/*
 * La carta de adelante: con borde y sombra de verdad, la insignia "1" y el
 * nombre que se escribe en vivo, con un cursor que titila. Flota suavemente.
 */
export default function CartaPrimerEstudiante({
  nombre,
}: CartaPrimerEstudianteProps) {
  const texto = nombre.trim()
  return (
    <div className="absolute top-31 left-6 w-66 -rotate-2">
      <div className="flex h-18 animate-flotar items-center gap-3 rounded-resaltado border-2 border-bunting bg-white px-4 shadow-carta motion-reduce:animate-none">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-icono border-2 border-bunting bg-sapphire font-jakarta text-18 font-extrabold text-white shadow-diagonal">
          1
        </span>
        <span className="flex min-w-0 items-center">
          <span
            className={`truncate font-jakarta text-18 font-extrabold ${texto ? 'text-bunting' : 'text-casper'}`}
          >
            {texto || 'Tu estudiante'}
          </span>
          <span className="ml-0.5 h-5.5 w-0.5 shrink-0 animate-titilar rounded-full bg-sapphire motion-reduce:animate-none" />
        </span>
      </div>
    </div>
  )
}

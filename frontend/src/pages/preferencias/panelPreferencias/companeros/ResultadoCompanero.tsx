import TextoCoincidencia from '../TextoCoincidencia'

interface ResultadoCompaneroProps {
  companero: { nombre: string; iniciales: string; correo: string }
  consulta: string
  /** Fila marcada (el compañero elegido). */
  activo: boolean
}

export default function ResultadoCompanero({
  companero,
  consulta,
  activo,
}: ResultadoCompaneroProps) {
  return (
    <li
      className={`flex min-h-14.25 cursor-pointer items-center gap-3 border-b-[1.5px] border-link-water-27 px-3.5 py-2 transition-colors last:border-b-0 hover:bg-zircon-21 ${
        activo ? 'bg-zircon-21' : 'bg-white'
      }`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-bunting bg-link-water-20 font-jakarta text-12 font-extrabold text-bunting">
        {companero.iniciales}
      </span>
      <div className="min-w-0">
        <TextoCoincidencia
          texto={companero.nombre}
          consulta={consulta}
          restoNegrita
        />
        <p className="truncate font-dm-sans text-12 text-east-bay">
          {companero.correo}
        </p>
      </div>
    </li>
  )
}

import type {
  HorarioEstudiante,
  PreferenciaNoCumplida,
} from '../../../../../types/HorarioEstudiante'
import ContenidoFicha from './ContenidoFicha'
import { TIPOS } from './tipos'

interface FichaIncumplidaProps {
  preferencia: PreferenciaNoCumplida
  /** Horario del estudiante: su nombre (el "Tú") y sus cursos. */
  horario: HorarioEstudiante
  animar: boolean
  /** Orden de entrada, para escalonar la animación. */
  orden: number
}

/*
 * Ficha de una preferencia que no se cumplió. A la izquierda, el lomo con el
 * ícono y el color de su tipo (los de Prioridad de preferencias); a la
 * derecha, el tipo, un título corto y el caso dibujado con piezas: la clase
 * con su color, los compañeros, los profesores, el día y la hora… Los
 * lectores de pantalla leen el caso completo en una frase (`detalle`).
 *
 * Como los bloques del cronograma, al pasar el mouse sube sin girar (el
 * texto se ve nítido); lo que gira o brinca son los íconos y los avatares.
 */
export default function FichaIncumplida({
  preferencia,
  horario,
  animar,
  orden,
}: FichaIncumplidaProps) {
  const tipo = TIPOS[preferencia.tipo]
  return (
    <li
      style={{ animationDelay: `${200 + orden * 70}ms` }}
      className={`group flex min-w-0 cursor-default overflow-hidden rounded-caja border-2 border-bunting bg-white shadow-base-3 transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] select-none hover:-translate-y-[round(calc(var(--u)*2),1px)] hover:shadow-base-5 motion-reduce:transition-none ${animar ? 'animate-entrar' : ''}`}
    >
      <span
        aria-hidden
        className={`flex w-11 shrink-0 justify-center border-r-2 border-bunting pt-3 ${tipo.colores.fondo}`}
      >
        <span
          className={`flex size-7.5 items-center justify-center rounded-full border-2 border-bunting transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 motion-reduce:transition-none ${tipo.colores.numero}`}
        >
          <img src={tipo.icono} alt="" className="size-4" />
        </span>
      </span>
      <div className="min-w-0 flex-1 px-3.5 pt-2.5 pb-3.5">
        <p className="font-dm-sans text-11 font-bold tracking-etiqueta text-east-bay uppercase">
          {tipo.etiqueta}
        </p>
        <div aria-hidden>
          <ContenidoFicha preferencia={preferencia} horario={horario} />
        </div>
        <p className="sr-only">{preferencia.detalle}</p>
      </div>
    </li>
  )
}

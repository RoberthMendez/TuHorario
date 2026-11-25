import type { CSSProperties } from 'react'
import {
  FONDO_ACENTO,
  FONDO_PASTEL,
  colorDeClase,
} from '../../../../styles/colores'
import type {
  CursoAsignado,
  SesionCurso,
} from '../../../../types/HorarioEstudiante'
import { ALTO_HORA, PRIMERA_HORA, aMinutos } from './horas'

interface BloqueCursoProps {
  curso: CursoAsignado
  sesion: SesionCurso
  /** Entra con un "pop" (al desplegar la carta). */
  animar: boolean
  /** Orden de entrada, para escalonar la animación. */
  orden: number
}

// Una sesión de un curso dentro de su día: ocupa las horas en que se dicta,
// con el color de su clase, su profesor y su salón.
export default function BloqueCurso({
  curso,
  sesion,
  animar,
  orden,
}: BloqueCursoProps) {
  const color = colorDeClase(curso.clase.id)
  const inicio = aMinutos(sesion.horaInicio) - PRIMERA_HORA * 60
  const duracion = aMinutos(sesion.horaFin) - aMinutos(sesion.horaInicio)
  // 3 unidades de aire arriba y 7 abajo (la sombra ocupa 3).
  const posicion: CSSProperties = {
    top: `calc(var(--u) * ${(inicio / 60) * ALTO_HORA + 3})`,
    height: `calc(var(--u) * ${(duracion / 60) * ALTO_HORA - 10})`,
    animationDelay: `${150 + orden * 60}ms`,
  }
  return (
    <div
      style={posicion}
      title={`${curso.clase.nombre} · ${sesion.horaInicio}–${sesion.horaFin}`}
      // Al pasar el mouse solo sube (sin girar) y en píxeles enteros, para
      // que el texto no se vea borroso. El cursor no cambia sobre el texto.
      className={`absolute inset-x-1 flex cursor-default flex-col overflow-hidden rounded-icono border-2 border-bunting px-2 pt-1.5 pb-2.5 shadow-base-3 transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] select-none hover:z-10 hover:-translate-y-[round(calc(var(--u)*2),1px)] hover:shadow-base-5 motion-reduce:transition-none ${FONDO_PASTEL[color]} ${animar ? 'animate-pop motion-reduce:animate-none' : ''}`}
    >
      <p className="font-jakarta text-13 leading-[calc(var(--u)*15.6)] font-extrabold text-bunting">
        {curso.clase.nombre}{' '}
        <span className="font-dm-sans text-12 font-bold text-east-bay">
          ({curso.clase.codigo})
        </span>
      </p>
      <p className="mt-1.5 flex items-start gap-1.5 font-dm-sans text-12 leading-[calc(var(--u)*14.4)] font-bold text-biscay">
        <span
          className={`mt-0.5 size-2.5 shrink-0 rounded-full border-[1.333px] border-bunting ${FONDO_ACENTO[color]}`}
        />
        {curso.profesor?.nombre ?? 'Sin profesor asignado'}
      </p>
      {sesion.salon && (
        <span className="mt-auto w-fit rounded-full bg-white/85 px-2 py-0.5 font-dm-sans text-11 font-bold text-bunting">
          {sesion.salon.codigo}
        </span>
      )}
    </div>
  )
}

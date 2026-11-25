import type { CSSProperties } from 'react'
import {
  FONDO_ACENTO,
  FONDO_PASTEL,
  colorDeClase,
} from '../../../../../styles/colores'
import type {
  CursoAsignado,
  SesionCurso,
} from '../../../../../types/HorarioEstudiante'
import { ALTO_HORA, PRIMERA_HORA, aMinutos } from '../horas'
import EtiquetaCodigo from './EtiquetaCodigo'

interface BloqueCursoProps {
  curso: CursoAsignado
  sesion: SesionCurso
  /** Entra con un "pop" (al desplegar la carta). */
  animar: boolean
  /** Orden de entrada, para escalonar la animación. */
  orden: number
}

/*
 * Una sesión de un curso dentro de su día: ocupa las horas en que se dicta,
 * con el color de su clase, su profesor y su salón. El código de la clase no
 * va en el bloque: sale en una etiqueta al pasar el mouse.
 *
 * El salón siempre se ve, pegado abajo: si el nombre o el profesor no caben,
 * se recortan con "…" (nombre hasta 3 líneas; profesor 1 línea en bloques de
 * 2 horas y 2 en los más largos). Los de una hora son compactos: nombre en
 * una línea y salón; su profesor va en la etiqueta.
 */
export default function BloqueCurso({
  curso,
  sesion,
  animar,
  orden,
}: BloqueCursoProps) {
  const color = colorDeClase(curso.clase.id)
  const inicio = aMinutos(sesion.horaInicio) - PRIMERA_HORA * 60
  const duracion = aMinutos(sesion.horaFin) - aMinutos(sesion.horaInicio)
  const compacto = duracion <= 60
  // 3 unidades de aire arriba y 7 abajo (la sombra ocupa 3).
  const posicion: CSSProperties = {
    top: `calc(var(--u) * ${(inicio / 60) * ALTO_HORA + 3})`,
    height: `calc(var(--u) * ${(duracion / 60) * ALTO_HORA - 10})`,
    animationDelay: `${150 + orden * 60}ms`,
  }
  return (
    <div
      style={posicion}
      // Al pasar el mouse solo sube (sin girar) y en píxeles enteros, para
      // que el texto no se vea borroso. El cursor no cambia sobre el texto.
      className={`group absolute inset-x-1 cursor-default rounded-icono border-2 border-bunting shadow-base-3 transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] select-none hover:z-10 hover:-translate-y-[round(calc(var(--u)*2),1px)] hover:shadow-base-5 motion-reduce:transition-none ${FONDO_PASTEL[color]} ${animar ? 'animate-pop motion-reduce:animate-none' : ''}`}
    >
      {/* El recorte va aquí y no en el bloque, para que la etiqueta se salga. */}
      <div
        className={`flex h-full flex-col overflow-hidden px-2 ${compacto ? 'justify-center gap-0.5 py-0.5' : 'gap-1 pt-1 pb-1.5'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={`font-jakarta text-13 leading-[calc(var(--u)*15.6)] font-extrabold text-bunting ${compacto ? 'truncate' : 'line-clamp-3'}`}
          >
            {curso.clase.nombre}
          </p>
          {!compacto && (
            <p className="mt-0.5 flex items-start gap-1.5 font-dm-sans text-12 leading-[calc(var(--u)*14.4)] font-bold text-biscay">
              <span
                className={`mt-0.5 size-2.5 shrink-0 rounded-full border-[1.333px] border-bunting ${FONDO_ACENTO[color]}`}
              />
              <span
                className={`min-w-0 ${duracion > 120 ? 'line-clamp-2' : 'line-clamp-1'}`}
              >
                {curso.profesor?.nombre ?? 'Sin profesor asignado'}
              </span>
            </p>
          )}
        </div>
        {sesion.salon && (
          <span
            className={`w-fit shrink-0 rounded-full bg-white/85 px-2 py-0.5 font-dm-sans text-11 font-bold text-bunting ${compacto ? '' : 'mt-auto'}`}
          >
            {sesion.salon.codigo}
          </span>
        )}
      </div>
      <EtiquetaCodigo
        curso={curso}
        // A primera hora no cabe arriba: la cortaría el borde de la grilla.
        abajo={inicio < 60}
        conProfesor={compacto}
      />
    </div>
  )
}

import type { CursoAsignado } from '../../../../../types/HorarioEstudiante'

interface EtiquetaCodigoProps {
  curso: CursoAsignado
  /** Va debajo del bloque en vez de encima. */
  abajo: boolean
  /** El bloque es compacto y no muestra al profesor: va aquí. */
  conProfesor: boolean
}

/*
 * Calcomanía que se pega sobre un bloque del cronograma al pasar el mouse:
 * el código de la clase en grande y el del curso (la sección) debajo. Llega
 * girando con rebote y se queda un poco torcida. No intercepta el mouse, así
 * que no tapa al bloque de al lado. Aunque esté oculta, los lectores de
 * pantalla la leen con el resto del bloque.
 */
export default function EtiquetaCodigo({
  curso,
  abajo,
  conProfesor,
}: EtiquetaCodigoProps) {
  return (
    <span
      className={`pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 scale-50 rotate-[-14deg] opacity-0 transition-[scale,rotate,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100 group-hover:-rotate-3 group-hover:opacity-100 motion-reduce:transition-none ${abajo ? 'top-full mt-2 origin-top' : 'bottom-full mb-2.5 origin-bottom'}`}
    >
      <span className="flex w-max max-w-[calc(var(--u)*128)] flex-col items-center rounded-etiqueta border-2 border-bunting bg-buttercup px-3 py-1 text-center shadow-base-3">
        <span className="font-jakarta text-15 font-extrabold tracking-[calc(var(--u)*0.6)] text-bunting">
          {curso.clase.codigo}
        </span>
        <span className="font-dm-sans text-11 font-bold text-bunting/75">
          Curso {curso.codigo}
        </span>
        {conProfesor && (
          <span className="mt-0.5 border-t-[1.333px] border-dashed border-bunting/40 pt-0.5 font-dm-sans text-11 font-bold text-bunting">
            {curso.profesor?.nombre ?? 'Sin profesor asignado'}
          </span>
        )}
      </span>
    </span>
  )
}

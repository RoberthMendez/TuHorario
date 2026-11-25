import { BORDE_ACENTO, colorDeClase } from '../../../../styles/colores'
import type { ClaseNoAsignada } from '../../../../types/HorarioEstudiante'

interface ClasesSinCupoProps {
  clases: ClaseNoAsignada[]
}

// Debajo de la grilla: las clases que no entraron, como fichas punteadas
// (el mismo estilo de una clase sin ubicar en Preferencias).
export default function ClasesSinCupo({ clases }: ClasesSinCupoProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="font-dm-sans text-14 font-bold text-east-bay">
        No cupieron:
      </span>
      {clases.map(({ clase, prioridad }) => (
        <span
          key={clase.id}
          className={`inline-flex h-7.5 cursor-default items-center gap-1 rounded-full border-2 border-dashed bg-white px-3 font-jakarta text-13 font-extrabold text-bunting select-none ${BORDE_ACENTO[colorDeClase(clase.id)]}`}
        >
          {clase.nombre}
          <span className="font-dm-sans text-12 font-bold text-east-bay">
            ({clase.codigo})
          </span>
          {prioridad && (
            <span className="ml-1 font-dm-sans text-12 font-bold text-carmesi">
              · obligatoria
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

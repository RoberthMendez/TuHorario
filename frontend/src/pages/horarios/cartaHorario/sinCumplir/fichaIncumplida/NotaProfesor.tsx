import { nivelesProfesor } from '../../../../../data/preferenciasEjemplo'
import { FONDO_NIVEL } from '../../../../../styles/colores'
import type { NivelPreferencia } from '../../../../../types/Preferencias'

interface NotaProfesorProps {
  /** Calificación que le dio el estudiante (null: no lo calificó). */
  nota: NivelPreferencia | null
}

// La calificación como en la leyenda de Profesores: el número en su ficha de
// color y el nombre del nivel ("¡Sí o sí!").
export default function NotaProfesor({ nota }: NotaProfesorProps) {
  const nivel = nivelesProfesor.find((n) => n.nivel === nota)
  return (
    <span className="mt-0.5 inline-flex items-center gap-1.5">
      {nota !== null && (
        <span
          className={`flex size-4.5 shrink-0 items-center justify-center rounded-mini border border-bunting font-jakarta text-11 font-extrabold text-bunting ${FONDO_NIVEL[nota]}`}
        >
          {nota}
        </span>
      )}
      <span className="font-dm-sans text-12 font-bold whitespace-nowrap text-east-bay">
        {nivel?.titulo ?? 'Sin calificar'}
      </span>
    </span>
  )
}

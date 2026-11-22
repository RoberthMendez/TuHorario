import type { NivelPreferencia } from '../../../../types/Preferencias'
import { FONDO_NIVEL } from '../colores'

interface NivelProfesorProps {
  nivel: NivelPreferencia
  descripcion: string
}

export default function NivelProfesor({
  nivel,
  descripcion,
}: NivelProfesorProps) {
  return (
    <div className="flex items-start gap-2">
      <span
        className={`flex size-5.5 shrink-0 items-center justify-center rounded-insignia border-[1.5px] border-bunting font-jakarta text-12 font-extrabold text-bunting ${FONDO_NIVEL[nivel]}`}
      >
        {nivel}
      </span>
      <p className="font-dm-sans text-13 text-biscay">{descripcion}</p>
    </div>
  )
}

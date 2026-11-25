import type { ReactNode } from 'react'
import Seccion from '../../../components/Seccion'
import BotonQuitarPreferencia from './BotonQuitarPreferencia'

interface SeccionPreferenciaProps {
  /** Ícono de la ficha amarilla del encabezado (vacía si no hay asset). */
  icono?: string
  titulo: string
  descripcion?: ReactNode
  /** La descripción de Profesores va a 16 unidades en el diseño. */
  descripcionGrande?: boolean
  insignia?: ReactNode
  /** Preferencias opcionales: muestra la caneca para quitarla. */
  onQuitar?: () => void
  children: ReactNode
}

// Sección del panel de preferencias: la tarjeta común, más la caneca de las
// preferencias opcionales.
export default function SeccionPreferencia({
  insignia,
  onQuitar,
  titulo,
  ...resto
}: SeccionPreferenciaProps) {
  return (
    <Seccion
      titulo={titulo}
      extra={
        (insignia || onQuitar) && (
          <>
            {insignia}
            {onQuitar && (
              <BotonQuitarPreferencia titulo={titulo} onQuitar={onQuitar} />
            )}
          </>
        )
      }
      {...resto}
    />
  )
}

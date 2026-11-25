import type { Ref } from 'react'
import BotonEliminar from './BotonEliminar'
import BotonDesplegar from '../../../components/BotonDesplegar'
import BotonOjo from './BotonOjo'
import InsigniaNumero from '../../../components/InsigniaNumero'
import NombreEstudiante from './nombreEstudiante/NombreEstudiante'

interface CabeceraCartaProps {
  numero: number
  nombre: string
  abierta: boolean
  verDatos: boolean
  idContenido: string
  onAlternar: () => void
  onAlternarDatos: () => void
  onRenombrar: (nombre: string) => Promise<void>
  refEliminar?: Ref<HTMLButtonElement>
  /** Se está pidiendo confirmación para eliminar. */
  confirmando: boolean
  idConfirmacion: string
  onPedirEliminar: () => void
}

export default function CabeceraCarta({
  numero,
  nombre,
  abierta,
  verDatos,
  idContenido,
  onAlternar,
  onAlternarDatos,
  onRenombrar,
  refEliminar,
  confirmando,
  idConfirmacion,
  onPedirEliminar,
}: CabeceraCartaProps) {
  return (
    <div className="flex min-h-19 items-center gap-3.75 px-5 py-3">
      <InsigniaNumero numero={numero} />
      {/* Lápiz (editar el nombre) y ojo juntos, pegados al nombre. */}
      <div className="flex min-w-0 items-center gap-1">
        <NombreEstudiante nombre={nombre} onRenombrar={onRenombrar} />
        {/* El ojo solo aparece con la carta desplegada */}
        {abierta && <BotonOjo visible={verDatos} onClick={onAlternarDatos} />}
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <BotonEliminar
          ref={refEliminar}
          nombre={nombre}
          activo={confirmando}
          idConfirmacion={idConfirmacion}
          onClick={onPedirEliminar}
        />
        <BotonDesplegar
          abierta={abierta}
          etiqueta={`las preferencias de ${nombre}`}
          idContenido={idContenido}
          onClick={onAlternar}
        />
      </div>
    </div>
  )
}

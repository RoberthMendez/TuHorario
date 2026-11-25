import type { Ref } from 'react'
import BotonEliminar from './BotonEliminar'
import BotonDesplegar from '../../../components/BotonDesplegar'
import BotonOjo from './BotonOjo'
import InsigniaNumero from '../../../components/InsigniaNumero'

interface CabeceraCartaProps {
  ref?: Ref<HTMLDivElement>
  numero: number
  nombre: string
  abierta: boolean
  verDatos: boolean
  idContenido: string
  onAlternar: () => void
  onAlternarDatos: () => void
  refEliminar?: Ref<HTMLButtonElement>
  /** Se está pidiendo confirmación para eliminar. */
  confirmando: boolean
  idConfirmacion: string
  onPedirEliminar: () => void
}

export default function CabeceraCarta({
  ref,
  numero,
  nombre,
  abierta,
  verDatos,
  idContenido,
  onAlternar,
  onAlternarDatos,
  refEliminar,
  confirmando,
  idConfirmacion,
  onPedirEliminar,
}: CabeceraCartaProps) {
  return (
    <div ref={ref} className="flex min-h-19 items-center gap-3.75 px-5 py-3">
      <InsigniaNumero numero={numero} />
      <h2 className="font-jakarta text-22 font-extrabold text-bunting">
        {nombre}
      </h2>
      {/* El ojo solo aparece con la carta desplegada */}
      {abierta && <BotonOjo visible={verDatos} onClick={onAlternarDatos} />}
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

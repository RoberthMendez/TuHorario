import type { Ref } from 'react'
import BotonDesplegar from './BotonDesplegar'
import BotonOjo from './BotonOjo'
import InsigniaNumero from './InsigniaNumero'

interface CabeceraCartaProps {
  ref?: Ref<HTMLDivElement>
  numero: number
  nombre: string
  abierta: boolean
  verDatos: boolean
  idContenido: string
  onAlternar: () => void
  onAlternarDatos: () => void
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
}: CabeceraCartaProps) {
  return (
    <div ref={ref} className="flex min-h-19 items-center gap-3.75 px-5 py-3">
      <InsigniaNumero numero={numero} />
      <h2 className="font-jakarta text-22 font-extrabold text-bunting">
        {nombre}
      </h2>
      {/* El ojo solo aparece con la carta desplegada */}
      {abierta && <BotonOjo visible={verDatos} onClick={onAlternarDatos} />}
      <BotonDesplegar
        abierta={abierta}
        nombre={nombre}
        idContenido={idContenido}
        onClick={onAlternar}
      />
    </div>
  )
}

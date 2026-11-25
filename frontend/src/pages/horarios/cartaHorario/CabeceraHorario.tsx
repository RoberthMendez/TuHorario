import BotonDesplegar from '../../../components/BotonDesplegar'
import InsigniaNumero from '../../../components/InsigniaNumero'
import EstadoCumplimiento from './EstadoCumplimiento'

interface CabeceraHorarioProps {
  numero: number
  nombre: string
  sinCumplir: number
  abierta: boolean
  idContenido: string
  onAlternar: () => void
}

export default function CabeceraHorario({
  numero,
  nombre,
  sinCumplir,
  abierta,
  idContenido,
  onAlternar,
}: CabeceraHorarioProps) {
  return (
    <div className="flex min-h-19 items-center gap-3.75 px-5 py-3">
      <InsigniaNumero numero={numero} />
      {/* En pantallas angostas la píldora baja debajo del nombre. */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="font-jakarta text-22 font-extrabold text-bunting">
          {nombre}
        </h2>
        <div className="sm:ml-auto">
          <EstadoCumplimiento sinCumplir={sinCumplir} />
        </div>
      </div>
      <BotonDesplegar
        abierta={abierta}
        etiqueta={`el horario de ${nombre}`}
        idContenido={idContenido}
        onClick={onAlternar}
      />
    </div>
  )
}

import { useState } from 'react'
import Desplegable from '../../../components/Desplegable'
import type { ResultadoEstudiante } from '../../../types/ResultadoEstudiante'
import CabeceraHorario from './CabeceraHorario'
import PanelHorario from './PanelHorario'

interface CartaHorarioProps {
  resultado: ResultadoEstudiante
  numero: number
  abiertaAlInicio?: boolean
}

// Carta con el resultado de un estudiante: la cabecera dice si se cumplió
// todo y la flecha despliega su horario armado.
export default function CartaHorario({
  resultado,
  numero,
  abiertaAlInicio = false,
}: CartaHorarioProps) {
  const [abierta, setAbierta] = useState(abiertaAlInicio)
  const idContenido = `horario-estudiante-${resultado.horario.idEstudiante}`
  return (
    <article className="overflow-hidden rounded-resaltado border-2 border-bunting bg-white shadow-carta">
      <CabeceraHorario
        numero={numero}
        nombre={resultado.horario.nombre}
        sinCumplir={resultado.preferenciasSinCumplir.length}
        abierta={abierta}
        idContenido={idContenido}
        onAlternar={() => setAbierta((valor) => !valor)}
      />
      <Desplegable abierto={abierta} id={idContenido}>
        <PanelHorario resultado={resultado} animar={abierta} />
      </Desplegable>
    </article>
  )
}

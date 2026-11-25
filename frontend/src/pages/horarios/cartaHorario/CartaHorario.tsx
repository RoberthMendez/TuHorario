import { useState } from 'react'
import Desplegable from '../../../components/Desplegable'
import type { HorarioEstudiante } from '../../../types/HorarioEstudiante'
import CabeceraHorario from './CabeceraHorario'
import PanelHorario from './PanelHorario'

interface CartaHorarioProps {
  horario: HorarioEstudiante
  numero: number
  abiertaAlInicio?: boolean
}

// Carta con el resultado de un estudiante: la cabecera dice si se cumplió
// todo y la flecha despliega su horario armado.
export default function CartaHorario({
  horario,
  numero,
  abiertaAlInicio = false,
}: CartaHorarioProps) {
  const [abierta, setAbierta] = useState(abiertaAlInicio)
  const idContenido = `horario-estudiante-${horario.idEstudiante}`
  return (
    <article className="overflow-hidden rounded-resaltado border-2 border-bunting bg-white shadow-carta">
      <CabeceraHorario
        numero={numero}
        nombre={horario.nombre}
        sinCumplir={horario.preferenciasNoCumplidas.length}
        abierta={abierta}
        idContenido={idContenido}
        onAlternar={() => setAbierta((valor) => !valor)}
      />
      <Desplegable abierto={abierta} id={idContenido}>
        <PanelHorario horario={horario} animar={abierta} />
      </Desplegable>
    </article>
  )
}

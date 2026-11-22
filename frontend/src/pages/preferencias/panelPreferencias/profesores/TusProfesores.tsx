import { profesoresElegidos } from '../../../../data/preferenciasEjemplo'
import CajaSubseccion from '../CajaSubseccion'
import TarjetaProfesor from './TarjetaProfesor'

export default function TusProfesores() {
  return (
    <CajaSubseccion
      titulo="Tus profesores"
      cantidad={profesoresElegidos.length}
    >
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {profesoresElegidos.map((preferencia) => (
          <li key={preferencia.profesor.id}>
            <TarjetaProfesor preferencia={preferencia} />
          </li>
        ))}
      </ul>
    </CajaSubseccion>
  )
}

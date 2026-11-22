import { nivelesProfesor } from '../../../../data/preferenciasEjemplo'
import NivelProfesor from './NivelProfesor'

// Leyenda de los niveles 0–3 de preferencia por un profesor.
export default function NivelesProfesor() {
  return (
    <ul className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
      {nivelesProfesor.map(({ nivel, descripcion }) => (
        <li key={nivel}>
          <NivelProfesor nivel={nivel} descripcion={descripcion} />
        </li>
      ))}
    </ul>
  )
}

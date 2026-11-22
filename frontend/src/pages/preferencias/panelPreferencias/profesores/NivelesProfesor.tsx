import { nivelesProfesor } from '../../../../data/preferenciasEjemplo'
import NivelProfesor from './NivelProfesor'

// Leyenda discreta de los niveles 0–3: una línea con la carita y un título
// corto por nivel (la explicación completa sale al pasar el mouse).
export default function NivelesProfesor() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="font-dm-sans text-12 font-bold tracking-etiqueta text-east-bay uppercase">
        Niveles
      </span>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {nivelesProfesor.map(({ nivel, titulo, descripcion, genero }) => (
          <li key={nivel}>
            <NivelProfesor
              nivel={nivel}
              titulo={titulo}
              descripcion={descripcion}
              genero={genero}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

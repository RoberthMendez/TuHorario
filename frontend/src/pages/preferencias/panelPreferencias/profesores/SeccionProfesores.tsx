import iconoBuscar from '../../../../assets/profesores/icono-buscar.svg'
import iconoSeccion from '../../../../assets/profesores/icono-seccion.svg'
import { busquedaProfesores } from '../../../../data/preferenciasEjemplo'
import Buscador from '../Buscador'
import SeccionPreferencia from '../SeccionPreferencia'
import NivelesProfesor from './NivelesProfesor'
import ResultadoProfesor from './ResultadoProfesor'
import TusProfesores from './TusProfesores'

export default function SeccionProfesores() {
  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Profesores"
      descripcion="Busca profesores de las clases que elegiste y califícalos de 0 a 3."
      descripcionGrande
    >
      <NivelesProfesor />
      <div className="mt-3">
        <Buscador
          icono={iconoBuscar}
          consulta={busquedaProfesores.consulta}
          cantidad={busquedaProfesores.resultados.length}
          etiqueta="Buscar profesores"
        >
          {busquedaProfesores.resultados.map((resultado) => (
            <ResultadoProfesor
              key={resultado.id}
              nombre={resultado.nombre}
              consulta={busquedaProfesores.consulta}
              color={resultado.color}
            />
          ))}
        </Buscador>
      </div>
      <div className="mt-4.5">
        <TusProfesores />
      </div>
    </SeccionPreferencia>
  )
}

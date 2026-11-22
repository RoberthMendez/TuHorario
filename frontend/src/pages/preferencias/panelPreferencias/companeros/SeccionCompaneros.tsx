import iconoBuscar from '../../../../assets/companeros/icono-buscar.svg'
import iconoSeccion from '../../../../assets/companeros/icono-seccion.svg'
import { busquedaCompaneros } from '../../../../data/preferenciasEjemplo'
import Buscador from '../Buscador'
import SeccionPreferencia from '../SeccionPreferencia'
import ClasesConCompanero from './ClasesConCompanero'
import RestringirCompanero from './RestringirCompanero'
import ResultadoCompanero from './ResultadoCompanero'

export default function SeccionCompaneros() {
  const [elegido] = busquedaCompaneros.resultados

  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Compañeros"
      descripcion="Busca a un compañero y elige con qué clases quieres verlo. Si no quieres coincidir con él o ella en ninguna clase, restríngelo."
    >
      <Buscador
        icono={iconoBuscar}
        consulta={busquedaCompaneros.consulta}
        cantidad={busquedaCompaneros.resultados.length}
        etiqueta="Buscar compañeros"
      >
        {busquedaCompaneros.resultados.map((resultado) => (
          <ResultadoCompanero
            key={resultado.id}
            companero={resultado}
            consulta={busquedaCompaneros.consulta}
            activo={resultado.id === elegido.id}
          />
        ))}
      </Buscador>
      <div className="mt-4">
        <RestringirCompanero
          nombre={elegido.nombre}
          restringidos={busquedaCompaneros.restringidos}
        />
      </div>
      <div className="mt-4.5">
        <ClasesConCompanero nombre={elegido.nombre} />
      </div>
    </SeccionPreferencia>
  )
}

import iconoSeccion from '../../../../assets/clases/icono-seccion.svg'
import { clasesSemestre } from '../../../../data/preferenciasEjemplo'
import SeccionPreferencia from '../SeccionPreferencia'
import BotonAnadirClase from './BotonAnadirClase'
import InsigniaObligatorio from './InsigniaObligatorio'
import TarjetaClase from './TarjetaClase'

export default function SeccionClases() {
  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Clases del semestre"
      insignia={<InsigniaObligatorio />}
      descripcion="Agrega las materias que este estudiante va a inscribir."
    >
      <div className="rounded-caja border-2 border-dashed border-sapphire bg-zircon-21 px-3 pt-8.5 pb-5.5 sm:px-5">
        {/* Rejilla de columnas fijas centrada: la segunda fila sigue las columnas */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-[repeat(auto-fill,calc(var(--u)*142))] sm:justify-center sm:gap-x-6.5 sm:gap-y-7">
          {clasesSemestre.map((preferencia) => (
            <li key={preferencia.clase.id}>
              <TarjetaClase preferencia={preferencia} />
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-end">
          <BotonAnadirClase />
        </div>
      </div>
    </SeccionPreferencia>
  )
}

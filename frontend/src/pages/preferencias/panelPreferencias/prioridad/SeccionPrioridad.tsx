import iconoSeccion from '../../../../assets/prioridad/icono-seccion.svg'
import { prioridades } from '../../../../data/preferenciasEjemplo'
import { COLORES_PRIORIDAD } from '../colores'
import SeccionPreferencia from '../SeccionPreferencia'
import ElementoPrioridad from './ElementoPrioridad'

const marcador =
  'font-dm-sans text-12 font-bold tracking-etiqueta text-east-bay uppercase'

export default function SeccionPrioridad() {
  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Prioridad de preferencias"
      descripcion="Arrastra los bloques para ordenarlos: la preferencia de arriba es la más importante."
    >
      <p className={marcador}>▲ Más importante</p>
      <ol className="mt-2 flex flex-col gap-3">
        {prioridades.map((prioridad, i) => (
          <li key={prioridad.tipoPreferencia}>
            <ElementoPrioridad
              prioridad={prioridad}
              colores={COLORES_PRIORIDAD[i % COLORES_PRIORIDAD.length]}
            />
          </li>
        ))}
      </ol>
      <p className={`mt-2 ${marcador}`}>▼ Menos importante</p>
    </SeccionPreferencia>
  )
}

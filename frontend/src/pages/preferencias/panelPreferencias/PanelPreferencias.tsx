import SeccionCercania from './cercania/SeccionCercania'
import SeccionClases from './clases/SeccionClases'
import SeccionCompaneros from './companeros/SeccionCompaneros'
import SeccionFranjas from './franjas/SeccionFranjas'
import SeccionPrioridad from './prioridad/SeccionPrioridad'
import SeccionProfesores from './profesores/SeccionProfesores'
import TituloPanel from './TituloPanel'

const secciones = [
  { id: 'clases', Seccion: SeccionClases },
  { id: 'profesores', Seccion: SeccionProfesores },
  { id: 'companeros', Seccion: SeccionCompaneros },
  { id: 'franjas', Seccion: SeccionFranjas },
  { id: 'cercania', Seccion: SeccionCercania },
  { id: 'prioridad', Seccion: SeccionPrioridad },
]

interface PanelPreferenciasProps {
  /** Al desplegarse la carta, las secciones entran una tras otra. */
  animar: boolean
}

/*
 * Zona azul clara con scroll propio. Su altura es la de la pantalla menos la
 * cabecera de la carta (`--alto-cabecera`, la mide CartaEstudiante) y los
 * 4 px de borde de la carta, dejando 24 unidades de aire arriba y abajo:
 * así, con los datos del estudiante ocultos, la carta desplegada cabe en la
 * pantalla con un pequeño margen.
 */
export default function PanelPreferencias({ animar }: PanelPreferenciasProps) {
  return (
    <section className="barra-scroll h-[calc(100dvh-var(--alto-cabecera,calc(var(--u)*76))-4px-var(--u)*48)] overflow-y-auto border-t-2 border-bunting bg-link-water shadow-panel-interior">
      <div className="flex flex-col gap-5 px-3 pt-7 pb-7 sm:pr-4 sm:pl-6">
        <TituloPanel />
        {secciones.map(({ id, Seccion }, i) => (
          <div
            key={id}
            className={animar ? 'animate-entrar' : ''}
            style={{ animationDelay: `${120 + i * 90}ms` }}
          >
            <Seccion />
          </div>
        ))}
      </div>
    </section>
  )
}

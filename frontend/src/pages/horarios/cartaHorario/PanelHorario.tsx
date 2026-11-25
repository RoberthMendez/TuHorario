import TituloSubrayado from '../../../components/TituloSubrayado'
import type { HorarioEstudiante } from '../../../types/HorarioEstudiante'
import Cronograma from './cronograma/Cronograma'
import PreferenciasSinCumplir from './sinCumplir/PreferenciasSinCumplir'

interface PanelHorarioProps {
  horario: HorarioEstudiante
  /** Las piezas entran con animación (al desplegar la carta). */
  animar: boolean
}

// Contenido desplegado de la carta: el horario armado y lo que no cupo. Con
// su propio scroll, como el panel de preferencias, para que la carta abierta
// quepa en la pantalla.
export default function PanelHorario({ horario, animar }: PanelHorarioProps) {
  return (
    <section className="barra-scroll max-h-[calc(100dvh-var(--u)*76-4px-var(--u)*48)] overflow-y-auto border-t-2 border-bunting bg-link-water shadow-panel-interior">
      <div className="flex flex-col gap-5 px-3 pt-7 pb-7 sm:pr-4 sm:pl-6">
        <TituloSubrayado texto="Horario armado" />
        <div className={animar ? 'animate-entrar' : ''}>
          <Cronograma
            cursos={horario.cursos}
            sinCupo={horario.clasesNoAsignadas}
            animar={animar}
          />
        </div>
        <div
          style={{ animationDelay: '120ms' }}
          className={animar ? 'animate-entrar' : ''}
        >
          <PreferenciasSinCumplir horario={horario} animar={animar} />
        </div>
      </div>
    </section>
  )
}

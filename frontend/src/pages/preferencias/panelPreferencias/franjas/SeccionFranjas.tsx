import iconoSeccion from '../../../../assets/franjas/icono-seccion.svg'
import SeccionPreferencia from '../SeccionPreferencia'
import BotonesRapidos from './BotonesRapidos'
import GrillaFranjas from './GrillaFranjas'
import HorarioSinHuecos from './HorarioSinHuecos'
import LeyendaFranjas from './LeyendaFranjas'

export default function SeccionFranjas() {
  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Franjas Habilitadas"
      descripcion="Marca las horas en las que este estudiante quiere ver clase. Toca una casilla o arrastra para elegir varias horas a la vez."
    >
      <BotonesRapidos />
      <div className="mt-3">
        <HorarioSinHuecos />
      </div>
      <div className="mt-4">
        <GrillaFranjas />
      </div>
      <div className="mt-4">
        <LeyendaFranjas />
      </div>
    </SeccionPreferencia>
  )
}

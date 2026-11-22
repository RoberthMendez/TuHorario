import IlustracionHorario from '../ilustracionHorario/IlustracionHorario'
import {
  bloquesEjemplo,
  piezaEstadistica,
  piezaEtica,
} from '../../../data/horarioEjemplo'
import CirculoDecorativo from './CirculoDecorativo'
import EtiquetaEncaja from './EtiquetaEncaja'
import HuecoDisponible from './HuecoDisponible'
import PiezaFlotante from './PiezaFlotante'

export default function HeroHorario() {
  return (
    // En móvil la composición (≈780 unidades con el círculo amarillo) se
    // ajusta al ancho de la pantalla.
    <div className="relative mx-auto mt-14 h-155 w-185 shrink-0 [--u:min(1px,calc((100vw_-_3rem)/780))] escritorio:mx-0 escritorio:mt-0 escritorio:[--u:inherit]">
      <CirculoDecorativo className="top-70.25 left-137.5 size-57.5 bg-amarillo" />
      <CirculoDecorativo className="-top-13.25 left-75 size-24 bg-cerulean" />
      <div className="absolute -top-1.25 left-0">
        <IlustracionHorario bloques={bloquesEjemplo}>
          <HuecoDisponible />
          <PiezaFlotante
            bloque={piezaEstadistica}
            resaltado
            className="top-91.5 left-57 rotate-6 drop-shadow-pieza-arrastrada"
          />
          <EtiquetaEncaja />
        </IlustracionHorario>
      </div>
      <PiezaFlotante
        bloque={piezaEtica}
        className="top-89.5 left-158 rotate-4 drop-shadow-pieza-suelta"
      />
    </div>
  )
}

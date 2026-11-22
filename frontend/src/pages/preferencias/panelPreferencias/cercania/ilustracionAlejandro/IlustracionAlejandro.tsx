import caminando from '../../../../../assets/cercania/alejandro/caminando.json'
import corriendo from '../../../../../assets/cercania/alejandro/corriendo.json'
import AnimacionLottie from './AnimacionLottie'

const capa =
  'absolute inset-0 transition-[opacity,scale] duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none'
const visible = 'scale-100 opacity-100'
const oculta = 'scale-90 opacity-0'

interface IlustracionAlejandroProps {
  /** Corriendo (tarde) o caminando relajado (salones cercanos). */
  corriendo: boolean
}

/*
 * Alejandro en la sección "Cercanía entre salones". Las dos animaciones están
 * montadas una encima de la otra y se cruzan con un fundido; la que no se ve
 * queda en pausa.
 */
export default function IlustracionAlejandro({
  corriendo: apurado,
}: IlustracionAlejandroProps) {
  return (
    <div className="relative size-30 shrink-0">
      <AnimacionLottie
        datos={corriendo}
        reproduciendo={apurado}
        className={`${capa} ${apurado ? visible : oculta}`}
      />
      <AnimacionLottie
        datos={caminando}
        reproduciendo={!apurado}
        className={`${capa} ${apurado ? oculta : visible}`}
      />
    </div>
  )
}

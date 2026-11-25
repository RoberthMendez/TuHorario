import iconoCheck from '../../../../../assets/companeros/icono-check-blanco.svg'
import type {
  Companero,
  PreferenciaClase,
} from '../../../../../types/Preferencias'
import { BORDE_ACENTO, FONDO_PASTEL } from '../../../../../styles/colores'
import CompanerosDeClase from './CompanerosDeClase'

interface TarjetaClaseCompaneroProps {
  preferencia: PreferenciaClase
  /** Hay un compañero en espera: la ficha se puede tocar para elegirla. */
  eligiendo: boolean
  elegida: boolean
  /** Puesto en la lista: desfasa el temblor de cada ficha. */
  indice: number
  /** En reposo: con quién se quiere ver esta clase. */
  companeros: Companero[]
  colorDe: (idCompanero: number) => string | undefined
  bloqueada: boolean
  onAlternar: () => void
  onEditar: (companero: Companero) => void
}

/*
 * Ficha de una clase en Compañeros.
 * - Eligiendo, sin marcar: clarita, de borde punteado y temblando como las
 *   apps del celular cuando se van a mover ("tócame").
 * - Eligiendo, marcada: sólida, quieta y con el check azul.
 * - En reposo: la ficha normal con las iniciales de los compañeros abajo.
 */
export default function TarjetaClaseCompanero({
  preferencia,
  eligiendo,
  elegida,
  indice,
  companeros,
  colorDe,
  bloqueada,
  onAlternar,
  onEditar,
}: TarjetaClaseCompaneroProps) {
  const { clase, color } = preferencia
  const base = `relative flex h-35 w-full flex-col items-center justify-center rounded-seccion px-3 text-center ${FONDO_PASTEL[color]}`
  const textos = (
    <>
      <span className="font-jakarta text-14 font-extrabold text-bunting">
        {clase.nombre}
      </span>
      <span className="mt-1 font-dm-sans text-11 font-medium tracking-etiqueta text-bunting/55">
        {clase.codigo}
      </span>
    </>
  )

  if (!eligiendo) {
    return (
      <div
        className={`${base} cursor-default border-2 border-bunting ${
          companeros.length > 0 ? 'pb-7' : ''
        }`}
      >
        {textos}
        {companeros.length > 0 && (
          <CompanerosDeClase
            nombreClase={clase.nombre}
            companeros={companeros}
            colorDe={colorDe}
            onEditar={onEditar}
          />
        )}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onAlternar}
      disabled={bloqueada}
      aria-pressed={elegida}
      // Cada ficha arranca el temblor en otro punto, para que no vayan al
      // compás.
      style={
        elegida ? undefined : { animationDelay: `-${(indice * 110) % 300}ms` }
      }
      className={`${base} cursor-pointer transition-[translate,opacity,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sapphire disabled:pointer-events-none ${
        elegida
          ? 'border-2 border-bunting shadow-base-4 hover:-translate-y-1'
          : `animate-temblar border-[1.5px] border-dashed opacity-75 hover:opacity-100 motion-reduce:animate-none ${BORDE_ACENTO[color]}`
      }`}
    >
      {textos}
      {elegida && (
        <span className="absolute -top-2.25 -right-2.25 flex size-7 animate-pop items-center justify-center rounded-bloque border-[1.5px] border-bunting bg-sapphire">
          <img src={iconoCheck} alt="" className="size-3.5" />
        </span>
      )}
    </button>
  )
}

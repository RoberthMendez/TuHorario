import type {
  Companero,
  PreferenciaClase,
} from '../../../../../types/Preferencias'
import CajaSubseccion from '../../CajaSubseccion'
import { primerNombre } from '../../../../../components/avatarCompanero/iniciales'
import BotonListo from './BotonListo'
import SinCompaneros from './SinCompaneros'
import TarjetaClaseCompanero from './TarjetaClaseCompanero'

interface ClasesCompaneroProps {
  clases: PreferenciaClase[]
  /** Compañero que se está configurando (null: vista en reposo). */
  enEspera: Companero | null
  /** Clases marcadas para el compañero en espera. */
  seleccion: Set<number>
  companerosDeClase: (idClase: number) => Companero[]
  colorDe: (idCompanero: number) => string | undefined
  /** Se puede confirmar (hay algo marcado o había algo guardado). */
  puedeConfirmar: boolean
  bloqueada: boolean
  onAlternar: (idClase: number) => void
  onListo: () => void
  onEditar: (companero: Companero) => void
}

/*
 * Las clases del semestre vistas desde Compañeros. Con un compañero en
 * espera se eligen (tiemblan hasta tocarlas) y se confirma con "Listo"; en
 * reposo cada ficha muestra, en chiquito, con quién se quiere ver.
 */
export default function ClasesCompanero({
  clases,
  enEspera,
  seleccion,
  companerosDeClase,
  colorDe,
  puedeConfirmar,
  bloqueada,
  onAlternar,
  onListo,
  onEditar,
}: ClasesCompaneroProps) {
  const eligiendo = enEspera !== null
  const conCompaneros = clases.filter(
    (p) => companerosDeClase(p.clase.id).length > 0,
  ).length
  const vacia = clases.length === 0 || (!eligiendo && conCompaneros === 0)

  return (
    <CajaSubseccion
      titulo={
        eligiendo
          ? `Clases con ${enEspera.nombre}`
          : 'Tus clases con compañeros'
      }
      cantidad={eligiendo ? seleccion.size : conCompaneros}
      ayuda={
        eligiendo && clases.length > 0
          ? `Toca las clases que quieres ver con ${primerNombre(enEspera.nombre)}`
          : undefined
      }
      amplia
    >
      {vacia ? (
        <SinCompaneros sinClases={clases.length === 0} />
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-4 pt-3 sm:grid-cols-[repeat(auto-fill,calc(var(--u)*141))] sm:justify-center sm:gap-5">
            {clases.map((preferencia, i) => {
              const { id } = preferencia.clase
              return (
                <li key={id}>
                  <TarjetaClaseCompanero
                    preferencia={preferencia}
                    eligiendo={eligiendo}
                    elegida={seleccion.has(id)}
                    indice={i}
                    companeros={companerosDeClase(id)}
                    colorDe={colorDe}
                    bloqueada={bloqueada}
                    onAlternar={() => onAlternar(id)}
                    onEditar={onEditar}
                  />
                </li>
              )
            })}
          </ul>
          {eligiendo && (
            <div className="mt-5 flex justify-end">
              <BotonListo
                deshabilitado={!puedeConfirmar || bloqueada}
                onClick={onListo}
              />
            </div>
          )}
        </>
      )}
    </CajaSubseccion>
  )
}

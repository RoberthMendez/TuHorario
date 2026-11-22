import type {
  NivelPreferencia,
  PreferenciaClase,
  PreferenciaProfe,
} from '../../../../types/Preferencias'
import BotonAnadir from '../BotonAnadir'
import CajaSubseccion from '../CajaSubseccion'
import { useDeslizarAlReordenar } from '../useDeslizarAlReordenar'
import { clasesDelProfesor } from './clasesDelProfesor'
import SinProfesores from './SinProfesores'
import TarjetaProfesor from './TarjetaProfesor'

interface TusProfesoresProps {
  profesores: PreferenciaProfe[]
  clases: PreferenciaClase[]
  onCambiarNivel: (id: number, nivel: NivelPreferencia) => void
  onQuitar: (id: number) => void
  onAnadir: () => void
}

export default function TusProfesores({
  profesores,
  clases,
  onCambiarNivel,
  onQuitar,
  onAnadir,
}: TusProfesoresProps) {
  const registrar = useDeslizarAlReordenar()

  return (
    <CajaSubseccion titulo="Tus profesores" cantidad={profesores.length}>
      {profesores.length === 0 ? (
        <SinProfesores sinClases={clases.length === 0} onAnadir={onAnadir} />
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {profesores.map((preferencia) => {
              const { id } = preferencia.profesor
              return (
                <li key={id} ref={registrar(id)} className="animate-pop">
                  <TarjetaProfesor
                    preferencia={preferencia}
                    clases={clasesDelProfesor(preferencia.profesor, clases)}
                    onCambiarNivel={(nivel) => onCambiarNivel(id, nivel)}
                    onQuitar={() => onQuitar(id)}
                  />
                </li>
              )
            })}
          </ul>
          <div className="mt-6 flex justify-end">
            <BotonAnadir texto="Añadir profesor" onClick={onAnadir} />
          </div>
        </>
      )}
    </CajaSubseccion>
  )
}

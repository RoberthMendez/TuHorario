import type {
  HorarioEstudiante,
  PreferenciaNoCumplida,
} from '../../../../../types/HorarioEstudiante'
import ClaseSinCupo from './ClaseSinCupo'
import ConRestringido from './ConRestringido'
import FueraDeFranja from './FueraDeFranja'
import HorasLibres from './HorasLibres'
import OtroProfesor from './OtroProfesor'
import ProfesorVetado from './ProfesorVetado'
import SinCompanero from './SinCompanero'
import SinDescanso from './SinDescanso'
import TituloFicha from './TituloFicha'

interface ContenidoFichaProps {
  preferencia: PreferenciaNoCumplida
  horario: HorarioEstudiante
}

// Lo que dibuja cada caso (el backend dice cuál en `caso`).
export default function ContenidoFicha({
  preferencia,
  horario,
}: ContenidoFichaProps) {
  switch (preferencia.caso) {
    case 'claseSinCupo':
      return <ClaseSinCupo preferencia={preferencia} />
    case 'fueraDeFranja':
      return <FueraDeFranja preferencia={preferencia} />
    case 'profesorVetado':
      return <ProfesorVetado preferencia={preferencia} />
    case 'otroProfesor':
      return <OtroProfesor preferencia={preferencia} />
    case 'sinCompanero':
      return (
        <SinCompanero preferencia={preferencia} estudiante={horario.nombre} />
      )
    case 'conRestringido':
      return (
        <ConRestringido preferencia={preferencia} estudiante={horario.nombre} />
      )
    case 'sinDescanso':
      return <SinDescanso preferencia={preferencia} />
    case 'horasLibres':
      return <HorasLibres preferencia={preferencia} cursos={horario.cursos} />
    default:
      // Un caso que esta versión no conoce (p. ej. un backend desactualizado):
      // se muestra la frase completa para que la ficha no quede vacía.
      return (
        <TituloFicha>
          {(preferencia as PreferenciaNoCumplida).detalle}
        </TituloFicha>
      )
  }
}

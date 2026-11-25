import iconoCedula from '../../../assets/cartaEstudiante/icono-cedula.svg'
import iconoCodigo from '../../../assets/cartaEstudiante/icono-codigo.svg'
import iconoCorreo from '../../../assets/cartaEstudiante/icono-correo.svg'
import iconoTelefono from '../../../assets/cartaEstudiante/icono-telefono.svg'
import type { Estudiante } from '../../../types/Estudiante'
import DatoEstudiante from './DatoEstudiante'
import Desplegable from '../../../components/Desplegable'

interface DatosEstudianteProps {
  estudiante: Estudiante
  visible: boolean
}

export default function DatosEstudiante({
  estudiante,
  visible,
}: DatosEstudianteProps) {
  return (
    <Desplegable abierto={visible}>
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 px-5.5 pt-1.5 pb-7 sm:grid-cols-2">
        <DatoEstudiante
          icono={iconoCorreo}
          etiqueta="Correo"
          valor={estudiante.correo}
          inclinacion="rotate-[-3deg]"
        />
        <DatoEstudiante
          icono={iconoTelefono}
          etiqueta="Teléfono"
          valor={estudiante.celular}
          inclinacion="rotate-4"
        />
        <DatoEstudiante
          icono={iconoCedula}
          etiqueta={estudiante.tipoDocumento.tipo}
          valor={estudiante.numeroDocumento}
          inclinacion="rotate-3"
        />
        <DatoEstudiante
          icono={iconoCodigo}
          etiqueta="Código estudiantil"
          valor={estudiante.codigoEstudiantil}
          inclinacion="-rotate-4"
        />
      </div>
    </Desplegable>
  )
}

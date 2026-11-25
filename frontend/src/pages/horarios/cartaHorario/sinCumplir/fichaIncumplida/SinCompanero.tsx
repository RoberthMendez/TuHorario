import { primerNombre } from '../../../../../components/avatarCompanero/iniciales'
import { FONDO_COMPANERO } from '../../../../../styles/colores'
import type { NoCumplida } from '../../../../../types/HorarioEstudiante'
import ChipClase from './ChipClase'
import ParejaFicha from './ParejaFicha'
import PiezasFicha from './PiezasFicha'
import PuestoEstudiante from './PuestoEstudiante'
import SignoComparacion from './SignoComparacion'
import TituloFicha from './TituloFicha'

interface SinCompaneroProps {
  preferencia: NoCumplida<'sinCompanero'>
  /** Nombre del dueño del horario (el "Tú"). */
  estudiante: string
}

// "No quedaste con Luis": en la clase, tu puesto y el de tu compañero, cada
// uno con su curso, separados por ≠ (cursos distintos) o ✕ (alguno no quedó).
export default function SinCompanero({
  preferencia,
  estudiante,
}: SinCompaneroProps) {
  const { clase, companero, motivo, curso, cursoCompanero } = preferencia
  const nombre = primerNombre(companero.nombre)
  return (
    <>
      <TituloFicha>No quedaste con {nombre}</TituloFicha>
      <PiezasFicha>
        <ChipClase clase={clase} />
      </PiezasFicha>
      <ParejaFicha
        sangria="ml-1"
        primero={
          <PuestoEstudiante
            nombre={estudiante}
            etiqueta="Tú"
            fondo="bg-supernova"
            curso={curso}
            sinCurso="No quedaste"
          />
        }
        signo={
          <SignoComparacion
            signo={motivo === 'otroCurso' ? 'distinto' : 'falta'}
          />
        }
        segundo={
          <PuestoEstudiante
            nombre={companero.nombre}
            etiqueta={nombre}
            fondo={FONDO_COMPANERO[companero.id % FONDO_COMPANERO.length]}
            curso={cursoCompanero}
            sinCurso="No quedó"
          />
        }
      />
    </>
  )
}

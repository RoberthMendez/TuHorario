import { useState } from 'react'
import iconoSeccion from '../../../../assets/profesores/icono-seccion.svg'
import type {
  NivelPreferencia,
  PreferenciaClase,
  PreferenciaProfe,
  Profesor,
} from '../../../../types/Preferencias'
import SeccionPreferencia from '../SeccionPreferencia'
import ModalAnadirProfesores from './modalProfesores/ModalAnadirProfesores'
import NivelesProfesor from './NivelesProfesor'
import TusProfesores from './TusProfesores'

// Nivel con el que entra un profesor recién añadido ("Lo prefieres").
const NIVEL_INICIAL: NivelPreferencia = 2

interface SeccionProfesoresProps {
  /** Clases del estudiante: definen qué profesores se pueden elegir. */
  clases: PreferenciaClase[]
  /** Quita esta preferencia del estudiante. */
  onQuitar: () => void
}

/*
 * Profesores de las clases elegidas, cada uno con un nivel de 0 a 3. Se
 * añaden desde un modal (varios a la vez), igual que las clases. Si se quita
 * una clase, sus profesores se ocultan (y vuelven si se agrega de nuevo).
 */
export default function SeccionProfesores({
  clases,
  onQuitar,
}: SeccionProfesoresProps) {
  const [profesores, setProfesores] = useState<PreferenciaProfe[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)

  const idsClases = new Set(clases.map((p) => p.clase.id))
  const visibles = profesores.filter((p) =>
    p.profesor.idsClases.some((id) => idsClases.has(id)),
  )

  const anadir = (nuevos: Profesor[]) => {
    setProfesores((actuales) => [
      ...actuales,
      ...nuevos
        .filter((profe) => !actuales.some((p) => p.profesor.id === profe.id))
        .map((profesor) => ({ profesor, preferencia: NIVEL_INICIAL })),
    ])
    setModalAbierto(false)
  }

  const cambiarNivel = (id: number, nivel: NivelPreferencia) =>
    setProfesores((actuales) =>
      actuales.map((p) =>
        p.profesor.id === id ? { ...p, preferencia: nivel } : p,
      ),
    )

  const quitar = (id: number) =>
    setProfesores((actuales) => actuales.filter((p) => p.profesor.id !== id))

  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Profesores"
      onQuitar={onQuitar}
      descripcion="Añade profesores de las clases que elegiste y califícalos de 0 a 3."
      descripcionGrande
    >
      <NivelesProfesor />
      <div className="mt-4.5">
        <TusProfesores
          profesores={visibles}
          clases={clases}
          onCambiarNivel={cambiarNivel}
          onQuitar={quitar}
          onAnadir={() => setModalAbierto(true)}
        />
      </div>
      {modalAbierto && (
        <ModalAnadirProfesores
          clases={clases}
          idsAgregados={new Set(profesores.map((p) => p.profesor.id))}
          onConfirmar={anadir}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </SeccionPreferencia>
  )
}

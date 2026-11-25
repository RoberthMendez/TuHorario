import { useState } from 'react'
import type {
  NivelPreferencia,
  PreferenciaClase,
  PreferenciaProfe,
} from '../../../../types/Preferencias'
import BotonQuitar from '../BotonQuitar'
import { FONDO_PASTEL } from '../../../../styles/colores'
import AvatarProfesor from './avatarProfesor/AvatarProfesor'
import ContadorNivel from './ContadorNivel'

interface TarjetaProfesorProps {
  preferencia: PreferenciaProfe
  /** Clases del estudiante que dicta (la primera da el color). */
  clases: PreferenciaClase[]
  onCambiarNivel: (nivel: NivelPreferencia) => void
  onQuitar: () => void
}

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Profesor elegido: nombre, asignatura(s), su cara según el nivel (con el
// color de su clase) y el contador para cambiar el nivel. La X lo quita con
// un "pop" (como las clases).
export default function TarjetaProfesor({
  preferencia,
  clases,
  onCambiarNivel,
  onQuitar,
}: TarjetaProfesorProps) {
  const { profesor, preferencia: nivel } = preferencia
  const [saliendo, setSaliendo] = useState(false)
  const asignaturas = clases.map((p) => p.clase.nombre).join(' · ')

  const quitar = () => {
    if (reducirMovimiento()) onQuitar()
    else setSaliendo(true)
  }

  return (
    // Al pasar el mouse la ficha no se mueve: solo aparece la X.
    <div
      className={`group flex cursor-default flex-col items-center pt-3 ${saliendo ? 'pointer-events-none' : ''}`}
    >
      <div
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && e.animationName === 'salir') {
            onQuitar()
          }
        }}
        className={`flex w-full flex-col items-center ${saliendo ? 'animate-salir' : ''}`}
      >
        <p className="w-full truncate text-center font-jakarta text-15 font-extrabold text-bunting">
          {profesor.nombre}
        </p>
        <p
          title={asignaturas}
          className="w-full truncate text-center font-dm-sans text-12 font-medium text-east-bay"
        >
          {asignaturas}
        </p>
        <div className="relative mt-2.5">
          <AvatarProfesor
            genero={profesor.genero}
            nivel={nivel}
            fondo={FONDO_PASTEL[clases[0]?.color ?? 'titan-white']}
            className="size-23 rounded-resaltado"
          />
          <BotonQuitar
            etiqueta={`Quitar a ${profesor.nombre}`}
            titulo="Quitar profesor"
            onQuitar={quitar}
          />
        </div>
        <div className="mt-2.5">
          <ContadorNivel
            nivel={nivel}
            nombre={profesor.nombre}
            onCambiar={onCambiarNivel}
          />
        </div>
      </div>
    </div>
  )
}

import type { Genero, NivelPreferencia } from '../../../../types/Preferencias'
import { FONDO_NIVEL } from '../../../../styles/colores'
import AvatarProfesor from '../../../../components/avatarProfesor/AvatarProfesor'

interface NivelProfesorProps {
  nivel: NivelPreferencia
  titulo: string
  descripcion: string
  genero: Genero
}

// Un nivel de la leyenda, en pequeño: la carita de ese nivel, el número y un
// título corto. La explicación completa sale al pasar el mouse.
export default function NivelProfesor({
  nivel,
  titulo,
  descripcion,
  genero,
}: NivelProfesorProps) {
  return (
    <span title={descripcion} className="flex items-center gap-1.5">
      <AvatarProfesor
        genero={genero}
        nivel={nivel}
        fondo={FONDO_NIVEL[nivel]}
        className="size-6.5 rounded-full"
      />
      <span className="font-jakarta text-13 font-extrabold text-bunting">
        {nivel}
      </span>
      <span className="font-dm-sans text-13 text-east-bay">{titulo}</span>
      <span className="sr-only">: {descripcion}</span>
    </span>
  )
}

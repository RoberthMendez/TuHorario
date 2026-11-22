import type {
  Genero,
  NivelPreferencia,
} from '../../../../../types/Preferencias'
import { APARIENCIA } from './apariencia'
import Cara from './Cara'
import Celebracion from './Celebracion'
import CuerpoProfesor from './CuerpoProfesor'
import CuerpoProfesora from './CuerpoProfesora'
import Gafas from './Gafas'

interface AvatarProfesorProps {
  genero: Genero
  nivel: NivelPreferencia
  /** Clase de fondo de la ficha (p. ej. el pastel de su clase). */
  fondo: string
  className?: string
}

/*
 * Ilustración del profesor (los SVG del diseño, en línea). La expresión
 * depende del nivel: 0 triste en blanco y negro, 1 medio feliz, 2 contento,
 * 3 celebrando. Hay un profe y una profa genéricos (mismos colores para
 * todos). Al cambiar de nivel la nueva cara entra con un "pop".
 */
export default function AvatarProfesor({
  genero,
  nivel,
  fondo,
  className = '',
}: AvatarProfesorProps) {
  const a = APARIENCIA[genero]
  const esProfa = genero === 'femenino'

  return (
    <span
      className={`block overflow-hidden border-[1.5px] border-bunting ${fondo} ${className}`}
    >
      <svg
        key={nivel}
        viewBox="0 0 100 100"
        aria-hidden
        className={`size-full animate-pop motion-reduce:animate-none ${nivel === 0 ? 'grayscale' : ''}`}
      >
        {esProfa ? <CuerpoProfesora a={a} /> : <CuerpoProfesor a={a} />}
        <Cara
          nivel={nivel}
          cejas={a.pelo.cejas}
          boca={esProfa ? '#B94A5A' : '#9A4B3C'}
        />
        {a.gafas && <Gafas />}
        {nivel === 3 && <Celebracion a={a} />}
      </svg>
    </span>
  )
}

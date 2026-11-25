import { useEffect, useRef } from 'react'
import InsigniaNumero from '../../../components/InsigniaNumero'
import FondoBloqueo from './FondoBloqueo'
import FormularioNombre, {
  type ControlFormularioNombre,
} from './FormularioNombre'

interface NombrarEstudianteProps {
  /** Número que tendrá la carta del nuevo estudiante. */
  numero: number
  creando: boolean
  onConfirmar: (nombre: string) => void
}

/*
 * Carta de un estudiante que aún no existe: lo único que se puede hacer es
 * escribir su nombre. El resto de la página queda bajo un velo; si se toca
 * por fuera, la carta "niega" de lado a lado y pide el nombre.
 */
export default function NombrarEstudiante({
  numero,
  creando,
  onConfirmar,
}: NombrarEstudianteProps) {
  const formulario = useRef<ControlFormularioNombre>(null)
  const contenedor = useRef<HTMLDivElement>(null)

  // Al aparecer se centra en pantalla.
  useEffect(() => {
    contenedor.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'center',
    })
  }, [])

  return (
    <div ref={contenedor}>
      <FondoBloqueo onIntento={() => formulario.current?.negar()} />
      <FormularioNombre
        etiqueta="¿Cómo se llama tu estudiante?"
        creando={creando}
        onConfirmar={onConfirmar}
        ref={formulario}
        autoEnfocar
        insignia={<InsigniaNumero numero={numero} />}
        className="rounded-resaltado border-2 border-bunting bg-white px-5 py-4.5 shadow-carta"
      />
    </div>
  )
}

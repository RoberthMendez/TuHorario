import { useEffect, useId, useRef, useState } from 'react'
import type {
  IdPreferencia,
  PreferenciaOpcional,
} from '../preferenciasOpcionales'
import BotonNuevaPreferencia from './BotonNuevaPreferencia'
import OpcionPreferencia from './OpcionPreferencia'

interface NuevaPreferenciaProps {
  /** Preferencias que el estudiante aún no ha añadido. */
  disponibles: PreferenciaOpcional[]
  /** Aún no hay clases: las preferencias que dependen de ellas se bloquean. */
  sinClases: boolean
  onAnadir: (id: IdPreferencia) => void
}

/*
 * Botón "Nueva preferencia" con un desplegable de las preferencias que faltan
 * por añadir. Elegir una la añade y cierra el desplegable; también se cierra
 * con Escape o al hacer clic por fuera. Si ya están todas, no se muestra.
 * Sin clases, las que dependen de ellas aparecen bloqueadas.
 */
export default function NuevaPreferencia({
  disponibles,
  sinClases,
  onAnadir,
}: NuevaPreferenciaProps) {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef<HTMLDivElement>(null)
  const idMenu = useId()

  useEffect(() => {
    if (!abierto) return
    // Que el desplegable se vea completo dentro del panel.
    contenedor.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'nearest',
    })
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    const alPresionar = (e: PointerEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('keydown', alTeclear)
    document.addEventListener('pointerdown', alPresionar)
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.removeEventListener('pointerdown', alPresionar)
    }
  }, [abierto])

  if (disponibles.length === 0) return null

  return (
    <div ref={contenedor}>
      <BotonNuevaPreferencia
        abierto={abierto}
        onClick={() => setAbierto((a) => !a)}
        idMenu={idMenu}
      />
      {abierto && (
        <div
          id={idMenu}
          className="mt-3 animate-entrar-chip rounded-seccion border-2 border-bunting bg-white p-3 shadow-seccion motion-reduce:animate-none sm:p-4"
        >
          <p className="mb-3 px-1 font-dm-sans text-14 text-east-bay">
            ¿Qué más quieres tener en cuenta en tu horario?
          </p>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {disponibles.map((opcion, i) => (
              <li
                key={opcion.id}
                className="animate-pop motion-reduce:animate-none"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <OpcionPreferencia
                  opcion={opcion}
                  bloqueada={sinClases && opcion.requiereClases}
                  onElegir={() => {
                    setAbierto(false)
                    onAnadir(opcion.id)
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

import { useEffect, useId, useRef, useState } from 'react'
import type { Companero } from '../../../../../types/Preferencias'
import Caneca from './Caneca'
import FilaRestringido from './FilaRestringido'

interface VerRestringidosProps {
  restringidos: Companero[]
  onQuitar: (id: number) => void
}

/*
 * Los restringidos no se ven a simple vista: este botón (con la caneca y
 * cuántos hay) despliega la lista, desde donde se les puede quitar la
 * restricción. Se cierra al hacer clic afuera o con Esc.
 */
export default function VerRestringidos({
  restringidos,
  onQuitar,
}: VerRestringidosProps) {
  const [abierto, setAbierto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const boton = useRef<HTMLButtonElement>(null)
  const idPanel = useId()

  useEffect(() => {
    if (!abierto) return
    const alPresionar = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAbierto(false)
    }
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setAbierto(false)
      boton.current?.focus()
    }
    document.addEventListener('pointerdown', alPresionar)
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('pointerdown', alPresionar)
      document.removeEventListener('keydown', alTeclear)
    }
  }, [abierto])

  return (
    <div ref={ref} className="relative">
      <button
        ref={boton}
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-controls={idPanel}
        className={`flex h-8.5 cursor-pointer items-center gap-2 rounded-full border-[1.5px] pr-1.5 pl-1 font-dm-sans text-13 font-bold transition-colors ${
          abierto
            ? 'border-alizarin bg-fair-pink text-alizarin-oscuro'
            : 'border-link-water-20 bg-white text-east-bay hover:border-alizarin hover:bg-fair-pink hover:text-alizarin-oscuro'
        }`}
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-alizarin">
          <Caneca abierta={false} className="size-3.5" />
        </span>
        Restringidos
        <span
          // Al restringir a alguien el número da un saltico.
          key={restringidos.length}
          className="flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-alizarin px-1.5 font-jakarta text-11 font-extrabold text-white"
        >
          {restringidos.length}
        </span>
      </button>
      {abierto && (
        <div
          id={idPanel}
          role="region"
          aria-label="Estudiantes restringidos"
          className="absolute top-full right-0 z-30 mt-2 w-[min(calc(var(--u)*330),calc(100vw-var(--u)*56))] origin-top-right animate-entrar-chip rounded-caja border-2 border-bunting bg-white p-2 shadow-base-4"
        >
          <p className="cursor-default px-2 pt-1 font-dm-sans text-12 font-bold tracking-etiqueta text-east-bay uppercase">
            Restringidos
          </p>
          <p className="cursor-default px-2 pb-1.5 font-dm-sans text-13 text-east-bay">
            El algoritmo evitará que veas clases con ellos.
          </p>
          {restringidos.length === 0 ? (
            <p className="cursor-default rounded-icono bg-zircon-10 px-3 py-4 text-center font-dm-sans text-13 text-east-bay">
              Todavía no has restringido a nadie.
            </p>
          ) : (
            <ul className="barra-scroll max-h-60 overflow-y-auto">
              {restringidos.map((companero) => (
                <FilaRestringido
                  key={companero.id}
                  companero={companero}
                  onQuitar={() => onQuitar(companero.id)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

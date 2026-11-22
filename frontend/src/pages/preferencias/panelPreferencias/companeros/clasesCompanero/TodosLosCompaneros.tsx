import { useEffect, useId, useRef, useState, type SyntheticEvent } from 'react'
import type { Companero } from '../../../../../types/Preferencias'
import AvatarCompanero from '../AvatarCompanero'

// Separación mínima entre la lista y los bordes de la ventana.
const MARGEN = 8

interface TodosLosCompanerosProps {
  nombreClase: string
  companeros: Companero[]
  /** Cuántos no caben en la ficha (el "+n"). */
  resto: number
  colorDe: (idCompanero: number) => string | undefined
  onEditar: (companero: Companero) => void
}

/*
 * El "+n" de una ficha con más compañeros de los que caben: despliega la
 * lista completa de esa clase y desde ahí se puede editar a cualquiera.
 * Usa la API de popover del navegador (capa superior, se cierra al hacer
 * clic afuera o con Esc) y se ubica a mano junto al botón; si se hace
 * scroll, se cierra.
 */
export default function TodosLosCompaneros({
  nombreClase,
  companeros,
  resto,
  colorDe,
  onEditar,
}: TodosLosCompanerosProps) {
  const id = useId()
  const boton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    if (!abierto) return
    const cerrar = () => panel.current?.hidePopover()
    window.addEventListener('scroll', cerrar, { capture: true })
    window.addEventListener('resize', cerrar)
    return () => {
      window.removeEventListener('scroll', cerrar, { capture: true })
      window.removeEventListener('resize', cerrar)
    }
  }, [abierto])

  // Debajo del botón y centrada; arriba si no cabe abajo.
  const ubicar = () => {
    const el = panel.current
    const b = boton.current?.getBoundingClientRect()
    if (!el || !b) return
    const { offsetWidth: ancho, offsetHeight: alto } = el
    const izquierda = Math.min(
      Math.max(MARGEN, b.left + b.width / 2 - ancho / 2),
      window.innerWidth - ancho - MARGEN,
    )
    const abajo = b.bottom + MARGEN
    const arriba =
      abajo + alto > window.innerHeight - MARGEN
        ? Math.max(MARGEN, b.top - MARGEN - alto)
        : abajo
    el.style.left = `${izquierda}px`
    el.style.top = `${arriba}px`
  }

  const alCambiar = (e: SyntheticEvent<HTMLDivElement>) => {
    const abiertoAhora = (e.nativeEvent as ToggleEvent).newState === 'open'
    if (abiertoAhora) ubicar()
    setAbierto(abiertoAhora)
  }

  return (
    <>
      <button
        ref={boton}
        type="button"
        popoverTarget={id}
        aria-label={`Ver los ${companeros.length} compañeros en ${nombreClase}`}
        title="Ver todos"
        className={`relative flex size-6.5 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-bunting font-jakarta text-[calc(var(--u)*9.5)] font-extrabold transition-[translate,background-color,color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:z-10 hover:-translate-y-1 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sapphire ${
          abierto ? 'bg-white text-bunting' : 'bg-bunting text-white'
        }`}
      >
        +{resto}
      </button>
      <div
        ref={panel}
        id={id}
        popover="auto"
        onToggle={alCambiar}
        className="m-0 w-[min(calc(var(--u)*300),calc(100vw-var(--u)*16))] rounded-caja border-2 border-bunting bg-white p-1.5 text-left shadow-base-4 [inset:auto] open:animate-entrar-chip"
      >
        <p className="cursor-default px-2 pt-1 pb-1.5 font-dm-sans text-12 font-bold tracking-etiqueta text-east-bay uppercase">
          Compañeros en {nombreClase}
        </p>
        <ul className="barra-scroll max-h-64 overflow-y-auto">
          {companeros.map((companero) => (
            <li key={companero.id}>
              <button
                type="button"
                onClick={() => {
                  panel.current?.hidePopover()
                  onEditar(companero)
                }}
                className="group/fila flex w-full cursor-pointer items-center gap-2.5 rounded-icono px-2 py-1.5 text-left transition-colors hover:bg-zircon-21 focus-visible:outline-2 focus-visible:outline-sapphire"
              >
                <AvatarCompanero
                  nombre={companero.nombre}
                  fondo={colorDe(companero.id)}
                  className="size-8 text-11"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-dm-sans text-14 font-bold text-bunting">
                    {companero.nombre}
                  </span>
                  <span className="block truncate font-dm-sans text-12 text-east-bay">
                    {companero.correo}
                  </span>
                </span>
                <span className="shrink-0 font-dm-sans text-12 font-bold text-sapphire opacity-0 transition-opacity group-hover/fila:opacity-100 group-focus-visible/fila:opacity-100">
                  Editar
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

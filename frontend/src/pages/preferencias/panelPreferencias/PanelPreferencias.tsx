import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { PreferenciaClase } from '../../../types/Preferencias'
import SeccionCercania from './cercania/SeccionCercania'
import SeccionClases from './clases/SeccionClases'
import SeccionCompaneros from './companeros/SeccionCompaneros'
import SeccionFranjas from './franjas/SeccionFranjas'
import NuevaPreferencia from './nuevaPreferencia/NuevaPreferencia'
import {
  PREFERENCIAS_OPCIONALES,
  TIPO_CLASES,
  TIPO_SIN_HUECOS,
  type IdPreferencia,
} from './preferenciasOpcionales'
import SeccionPrioridad from './prioridad/SeccionPrioridad'
import SeccionProfesores from './profesores/SeccionProfesores'
import TituloPanel from './TituloPanel'

// Lo que dura el cierre de una sección al quitarla.
const SALIDA_MS = 300

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const tipoDe = (id: IdPreferencia) =>
  PREFERENCIAS_OPCIONALES.find((o) => o.id === id)?.tipo ?? id

interface PanelPreferenciasProps {
  /** Al desplegarse la carta, las secciones entran una tras otra. */
  animar: boolean
}

/*
 * Zona azul clara con scroll propio. Crece con su contenido (con solo las
 * clases llega hasta el botón "Nueva preferencia"); como máximo mide la
 * pantalla menos la cabecera de la carta (`--alto-cabecera`, la mide
 * CartaEstudiante) y los 4 px de borde de la carta, dejando 24 unidades de
 * aire arriba y abajo: así, con los datos del estudiante ocultos, la carta
 * desplegada cabe en la pantalla con un pequeño margen, y de ahí en adelante
 * hace scroll.
 *
 * Un estudiante nuevo solo tiene las clases (obligatorias). Con "Nueva
 * preferencia" añade las demás y con la X de cada una las quita. Cuando
 * hay al menos dos, aparece Prioridad de preferencias con solo las elegidas:
 * las nuevas entran de últimas.
 */
export default function PanelPreferencias({ animar }: PanelPreferenciasProps) {
  // Las clases elegidas viven aquí: las demás preferencias (profesores…) se
  // basan en ellas.
  const [clases, setClases] = useState<PreferenciaClase[]>([])
  const [activas, setActivas] = useState<IdPreferencia[]>([])
  const [saliendo, setSaliendo] = useState<IdPreferencia[]>([])
  const [sinHuecos, setSinHuecos] = useState(false)
  const [orden, setOrden] = useState<string[]>([TIPO_CLASES])
  // Pasada la entrada escalonada de la carta, lo que aparezca después (una
  // preferencia recién añadida) entra sin esperar.
  const [entradaLista, setEntradaLista] = useState(false)
  const nodos = useRef(new Map<IdPreferencia, HTMLDivElement>())
  const recienAnadida = useRef<IdPreferencia | null>(null)

  useEffect(() => {
    if (!animar) return
    const t = setTimeout(() => setEntradaLista(true), 900)
    return () => {
      clearTimeout(t)
      setEntradaLista(false)
    }
  }, [animar])

  // Lleva la vista hasta la preferencia que se acaba de añadir.
  useEffect(() => {
    const id = recienAnadida.current
    if (!id) return
    recienAnadida.current = null
    nodos.current.get(id)?.scrollIntoView({
      behavior: reducirMovimiento() ? 'auto' : 'smooth',
      block: 'nearest',
    })
  }, [activas])

  const anadir = (id: IdPreferencia) => {
    recienAnadida.current = id
    setActivas((a) => [...a, id])
    setOrden((o) => [...o, tipoDe(id)])
  }

  const quitar = (id: IdPreferencia) => {
    // Sale de la prioridad de una vez; la sección se cierra y luego se va.
    setOrden((o) =>
      o.filter(
        (t) => t !== tipoDe(id) && !(id === 'franjas' && t === TIPO_SIN_HUECOS),
      ),
    )
    if (id === 'franjas') setSinHuecos(false)
    const eliminar = () => {
      setActivas((a) => a.filter((x) => x !== id))
      setSaliendo((s) => s.filter((x) => x !== id))
    }
    if (reducirMovimiento()) return eliminar()
    setSaliendo((s) => [...s, id])
    setTimeout(eliminar, SALIDA_MS)
  }

  const cambiarSinHuecos = (activo: boolean) => {
    setSinHuecos(activo)
    setOrden((o) =>
      activo
        ? o.includes(TIPO_SIN_HUECOS)
          ? o
          : [...o, TIPO_SIN_HUECOS]
        : o.filter((t) => t !== TIPO_SIN_HUECOS),
    )
  }

  const seccionDe = (id: IdPreferencia): ReactNode => {
    const alQuitar = () => quitar(id)
    switch (id) {
      case 'profesores':
        return <SeccionProfesores clases={clases} onQuitar={alQuitar} />
      case 'companeros':
        return <SeccionCompaneros clases={clases} onQuitar={alQuitar} />
      case 'franjas':
        return (
          <SeccionFranjas
            sinHuecos={sinHuecos}
            onCambiarSinHuecos={cambiarSinHuecos}
            onQuitar={alQuitar}
          />
        )
      case 'cercania':
        return <SeccionCercania onQuitar={alQuitar} />
    }
  }

  const disponibles = PREFERENCIAS_OPCIONALES.filter(
    (o) => !activas.includes(o.id),
  )

  const secciones: { id: string; contenido: ReactNode; opcional?: true }[] = [
    {
      id: 'clases',
      contenido: <SeccionClases clases={clases} onCambiarClases={setClases} />,
    },
    ...PREFERENCIAS_OPCIONALES.filter((o) => activas.includes(o.id)).map(
      (o) => ({
        id: o.id,
        contenido: seccionDe(o.id),
        opcional: true as const,
      }),
    ),
  ]
  if (disponibles.length > 0) {
    secciones.push({
      id: 'nueva',
      contenido: (
        <NuevaPreferencia disponibles={disponibles} onAnadir={anadir} />
      ),
    })
  }
  if (orden.length > 1) {
    secciones.push({
      id: 'prioridad',
      contenido: <SeccionPrioridad orden={orden} onCambiarOrden={setOrden} />,
    })
  }

  return (
    <section className="barra-scroll max-h-[calc(100dvh-var(--alto-cabecera,calc(var(--u)*76))-4px-var(--u)*48)] overflow-y-auto border-t-2 border-bunting bg-link-water shadow-panel-interior">
      <div className="flex flex-col gap-5 px-3 pt-7 pb-7 sm:pr-4 sm:pl-6">
        <TituloPanel />
        {secciones.map(({ id, contenido, opcional }, i) => {
          const sale = opcional && saliendo.includes(id as IdPreferencia)
          return (
            <div
              key={id}
              ref={(el) => {
                if (!opcional) return
                if (el) nodos.current.set(id as IdPreferencia, el)
                else nodos.current.delete(id as IdPreferencia)
              }}
              className={animar ? 'animate-entrar' : ''}
              style={{
                animationDelay: entradaLista ? '0ms' : `${120 + i * 90}ms`,
              }}
            >
              {/* Al quitarla, la sección se desvanece y se pliega (de 1fr a
                  0fr) para que las de abajo suban suavemente. */}
              <div
                className={`grid grid-cols-1 transition-[grid-template-rows,opacity,scale] duration-300 ease-out ${
                  sale
                    ? 'pointer-events-none grid-rows-[0fr] scale-[0.98] opacity-0'
                    : 'grid-rows-[1fr]'
                }`}
              >
                <div className={`min-h-0 ${sale ? 'overflow-hidden' : ''}`}>
                  {contenido}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

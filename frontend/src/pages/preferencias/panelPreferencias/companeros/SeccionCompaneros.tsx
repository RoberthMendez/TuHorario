import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import iconoSeccion from '../../../../assets/companeros/icono-seccion.svg'
import type {
  Companero,
  PreferenciaClase,
  PreferenciaCompanero,
} from '../../../../types/Preferencias'
import { FONDO_COMPANERO } from '../../../../styles/colores'
import SeccionPreferencia from '../SeccionPreferencia'
import BuscadorCompaneros from './buscadorCompaneros/BuscadorCompaneros'
import ClasesCompanero from './clasesCompanero/ClasesCompanero'
import BotonRestringir from './restringidos/BotonRestringir'
import Muneco, { type RecorridoMuneco } from './restringidos/Muneco'
import VerRestringidos from './restringidos/VerRestringidos'

// Lo que tarda la caneca en cerrarse y sacudirse antes de despedir al
// compañero.
const SACUDIDA_MS = 450

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface SeccionCompanerosProps {
  /** Clases del estudiante: con cada compañero se eligen entre estas. */
  clases: PreferenciaClase[]
  /** Estudiante dueño de la carta (no se sugiere a sí mismo). */
  idEstudiante: number
  /** Compañeros por clase y restringidos (el estado vive en el panel). */
  preferencias: PreferenciaCompanero[]
  onCambiarPreferencias: Dispatch<SetStateAction<PreferenciaCompanero[]>>
  restringidos: Companero[]
  onCambiarRestringidos: Dispatch<SetStateAction<Companero[]>>
  /** Quita esta preferencia del estudiante. */
  onQuitar: () => void
}

/*
 * Compañeros, de uno en uno: se busca (como un destinatario de correo), queda
 * "en espera" en el buscador y entonces se restringe (el muñeco se va a la
 * caneca) o se eligen las clases para verlo y se confirma con "Listo".
 * Tocar las iniciales de alguien en una clase lo vuelve a abrir para editar.
 */
export default function SeccionCompaneros({
  clases,
  idEstudiante,
  preferencias,
  onCambiarPreferencias: setPreferencias,
  restringidos,
  onCambiarRestringidos: setRestringidos,
  onQuitar,
}: SeccionCompanerosProps) {
  const [enEspera, setEnEspera] = useState<Companero | null>(null)
  const [seleccion, setSeleccion] = useState<Set<number>>(new Set())
  // Restricción en curso: el muñeco va camino a la caneca.
  const [recorrido, setRecorrido] = useState<RecorridoMuneco | null>(null)
  const [tapaAbierta, setTapaAbierta] = useState(false)
  const [sacudiendo, setSacudiendo] = useState(false)
  // Color de cada compañero (índice en FONDO_COMPANERO). Se le asigna al
  // guardarle clases por primera vez y no cambia después. Los que ya llegan
  // con clases (al repetir un intento) los reciben en orden.
  const [colores, setColores] = useState<Map<number, number>>(() => {
    const iniciales = new Map<number, number>()
    for (const { estudiantePreferido } of preferencias) {
      if (!iniciales.has(estudiantePreferido.id)) {
        iniciales.set(
          estudiantePreferido.id,
          iniciales.size % FONDO_COMPANERO.length,
        )
      }
    }
    return iniciales
  })

  const escena = useRef<HTMLDivElement>(null)
  const avatar = useRef<HTMLSpanElement>(null)
  const caneca = useRef<HTMLSpanElement>(null)
  const despedida = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(despedida.current), [])

  // Al quitar una clase, el panel borra los compañeros de esa clase.
  const companerosDeClase = (idClase: number) =>
    preferencias
      .filter((p) => p.clase.id === idClase)
      .map((p) => p.estudiantePreferido)
  const clasesDe = (idCompanero: number) =>
    preferencias
      .filter((p) => p.estudiantePreferido.id === idCompanero)
      .map((p) => p.clase.id)
  const clasesPorCompanero = new Map<number, number>()
  for (const p of preferencias) {
    const id = p.estudiantePreferido.id
    clasesPorCompanero.set(id, (clasesPorCompanero.get(id) ?? 0) + 1)
  }
  const restringiendo = recorrido !== null
  const colorDe = (idCompanero: number) => {
    const indice = colores.get(idCompanero)
    return indice === undefined ? undefined : FONDO_COMPANERO[indice]
  }

  const elegir = (companero: Companero) => {
    setEnEspera(companero)
    setSeleccion(new Set(clasesDe(companero.id)))
  }

  const alternar = (idClase: number) =>
    setSeleccion((actual) => {
      const nueva = new Set(actual)
      if (nueva.has(idClase)) nueva.delete(idClase)
      else nueva.add(idClase)
      return nueva
    })

  // Guarda las clases marcadas (reemplaza las que tenía).
  const confirmar = () => {
    if (!enEspera) return
    setPreferencias((actuales) => [
      ...actuales.filter((p) => p.estudiantePreferido.id !== enEspera.id),
      ...clases
        .filter((p) => seleccion.has(p.clase.id))
        .map((p) => ({ estudiantePreferido: enEspera, clase: p.clase })),
    ])
    if (seleccion.size > 0 && !colores.has(enEspera.id)) {
      setColores((actuales) =>
        new Map(actuales).set(enEspera.id, colorMenosUsado()),
      )
    }
    setEnEspera(null)
  }

  // El color que menos llevan los compañeros que tienen clases ahora.
  const colorMenosUsado = () => {
    const usos = FONDO_COMPANERO.map(() => 0)
    for (const id of clasesPorCompanero.keys()) {
      const indice = colores.get(id)
      if (indice !== undefined) usos[indice]++
    }
    return usos.indexOf(Math.min(...usos))
  }

  const despedir = (companero: Companero) => {
    setRestringidos((actuales) => [...actuales, companero])
    setPreferencias((actuales) =>
      actuales.filter((p) => p.estudiantePreferido.id !== companero.id),
    )
    setColores((actuales) => {
      const nuevos = new Map(actuales)
      nuevos.delete(companero.id)
      return nuevos
    })
    setEnEspera(null)
    setRecorrido(null)
    setSacudiendo(false)
  }

  const restringir = () => {
    if (!enEspera) return
    const base = escena.current?.getBoundingClientRect()
    const a = avatar.current?.getBoundingClientRect()
    const c = caneca.current?.getBoundingClientRect()
    if (reducirMovimiento() || !base || !a || !c) {
      despedir(enEspera)
      return
    }
    setRecorrido({
      desde: {
        x: a.left + a.width / 2 - base.left,
        y: a.top + a.height / 2 - base.top,
      },
      hasta: { x: c.left + c.width / 2 - base.left, y: c.top - base.top },
    })
  }

  const alCaer = () => {
    const companero = enEspera
    setTapaAbierta(false)
    setSacudiendo(true)
    despedida.current = setTimeout(() => {
      if (companero) despedir(companero)
    }, SACUDIDA_MS)
  }

  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Compañeros"
      onQuitar={onQuitar}
      descripcion="Busca a un compañero y elige con qué clases quieres verlo. Si no quieres coincidir con él o ella en ninguna clase, restríngelo."
      insignia={
        <VerRestringidos
          restringidos={restringidos}
          onQuitar={(id) =>
            setRestringidos((actuales) => actuales.filter((c) => c.id !== id))
          }
        />
      }
    >
      <div ref={escena} className="relative">
        <BuscadorCompaneros
          idEstudiante={idEstudiante}
          refAvatar={avatar}
          enEspera={enEspera}
          restringiendo={restringiendo}
          idsRestringidos={new Set(restringidos.map((c) => c.id))}
          clasesPorCompanero={clasesPorCompanero}
          colorDe={colorDe}
          onElegir={elegir}
          onCancelar={() => setEnEspera(null)}
        />
        {enEspera && (
          <div className="mt-3.5 flex animate-entrar flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
            <p className="cursor-default font-dm-sans text-13 text-east-bay">
              Elige abajo las clases que quieres compartir o restringe a{' '}
              <strong className="font-bold text-bunting">
                {enEspera.nombre}
              </strong>{' '}
              para no coincidir en ninguna.
            </p>
            <BotonRestringir
              nombre={enEspera.nombre}
              tapaAbierta={tapaAbierta}
              sacudiendo={sacudiendo}
              deshabilitado={restringiendo}
              refCaneca={caneca}
              onRestringir={restringir}
            />
          </div>
        )}
        <div className="mt-4.5">
          <ClasesCompanero
            clases={clases}
            enEspera={enEspera}
            seleccion={seleccion}
            companerosDeClase={companerosDeClase}
            colorDe={colorDe}
            puedeConfirmar={
              enEspera !== null &&
              (seleccion.size > 0 || clasesDe(enEspera.id).length > 0)
            }
            bloqueada={restringiendo}
            onAlternar={alternar}
            onListo={confirmar}
            onEditar={elegir}
          />
        </div>
        {recorrido && enEspera && (
          <Muneco
            {...recorrido}
            fondo={colorDe(enEspera.id)}
            onLlegando={() => setTapaAbierta(true)}
            onFin={alCaer}
          />
        )}
      </div>
    </SeccionPreferencia>
  )
}

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from 'react'
import iconoBuscar from '../../../../../assets/companeros/icono-buscar.svg'
import type { Companero } from '../../../../../types/Preferencias'
import ChipEnEspera from './ChipEnEspera'
import ListaSugerencias from './ListaSugerencias'
import { useBuscarCompaneros } from './useBuscarCompaneros'

interface BuscadorCompanerosProps {
  /** Compañero que se está configurando (ocupa el buscador). */
  enEspera: Companero | null
  /** Se está restringiendo: el muñeco ya salió del chip. */
  restringiendo: boolean
  idsRestringidos: Set<number>
  clasesPorCompanero: Map<number, number>
  /** Color propio de cada compañero que ya tiene clases. */
  colorDe: (idCompanero: number) => string | undefined
  onElegir: (companero: Companero) => void
  onCancelar: () => void
  refAvatar: Ref<HTMLSpanElement>
}

/*
 * Buscador de compañeros que sugiere mientras se escribe, como el "Para" de
 * un correo: flechas para moverse, Enter para elegir, Esc para cerrar. Solo
 * se configura un compañero a la vez: al elegirlo queda "en espera" dentro
 * de la caja hasta que se confirma, se restringe o se suelta.
 */
export default function BuscadorCompaneros({
  enEspera,
  restringiendo,
  idsRestringidos,
  clasesPorCompanero,
  colorDe,
  onElegir,
  onCancelar,
  refAvatar,
}: BuscadorCompanerosProps) {
  const [consulta, setConsulta] = useState('')
  const [enfocado, setEnfocado] = useState(false)
  // Esc cierra las sugerencias hasta que se vuelva a escribir.
  const [cerrada, setCerrada] = useState(false)
  const [idActivo, setIdActivo] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idLista = useId()
  const { resultados, cargando, error, reintentar } =
    useBuscarCompaneros(consulta)

  // Al soltar, confirmar o restringir un compañero, el foco vuelve a la caja
  // para buscar el siguiente.
  const habiaEspera = useRef(false)
  useEffect(() => {
    if (!enEspera && habiaEspera.current) inputRef.current?.focus()
    habiaEspera.current = enEspera !== null
  }, [enEspera])

  const elegibles = resultados.filter((c) => !idsRestringidos.has(c.id))
  // Si el marcado ya no está en la lista, se marca el primero elegible.
  const activo =
    elegibles.find((c) => c.id === idActivo) ?? elegibles[0] ?? null
  const abierta = !enEspera && enfocado && !cerrada && consulta.trim() !== ''
  const idOpcion = (c: Companero) => `${idLista}-${c.id}`

  const elegir = (companero: Companero) => {
    setConsulta('')
    setIdActivo(null)
    onElegir(companero)
  }

  const mover = (paso: number) => {
    if (elegibles.length === 0) return
    const i = activo ? elegibles.indexOf(activo) : -1
    const siguiente = (i + paso + elegibles.length) % elegibles.length
    setIdActivo(elegibles[siguiente].id)
  }

  const alTeclear = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setCerrada(false)
      mover(e.key === 'ArrowDown' ? 1 : -1)
    } else if (e.key === 'Enter' && abierta && activo) {
      e.preventDefault()
      elegir(activo)
    } else if (e.key === 'Escape' && abierta) {
      e.preventDefault()
      setCerrada(true)
    }
  }

  const cantidad = cargando
    ? 'Buscando…'
    : `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'}`

  return (
    <div className="relative">
      <div
        className={`flex h-13 items-center gap-2.5 border-2 border-bunting bg-white transition-shadow ${
          abierta ? 'rounded-t-bloque' : 'rounded-bloque'
        } ${enEspera ? 'px-2.5' : 'px-4 has-focus-visible:shadow-base-3'}`}
      >
        {enEspera ? (
          <ChipEnEspera
            companero={enEspera}
            fondo={colorDe(enEspera.id)}
            saliendo={restringiendo}
            refAvatar={refAvatar}
            bloqueado={restringiendo}
            onCancelar={onCancelar}
          />
        ) : (
          <>
            <img src={iconoBuscar} alt="" className="size-5.5 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-label="Buscar compañeros por nombre"
              aria-autocomplete="list"
              aria-expanded={abierta}
              aria-controls={idLista}
              aria-activedescendant={
                abierta && activo ? idOpcion(activo) : undefined
              }
              autoComplete="off"
              spellCheck={false}
              placeholder="Busca a un compañero"
              value={consulta}
              onChange={(e) => {
                setConsulta(e.target.value)
                setCerrada(false)
              }}
              onFocus={() => setEnfocado(true)}
              onBlur={() => setEnfocado(false)}
              onKeyDown={alTeclear}
              className="h-full min-w-0 flex-1 bg-transparent font-dm-sans text-16 font-medium text-bunting caret-sapphire outline-none placeholder:font-normal placeholder:text-east-bay/70"
            />
          </>
        )}
        {abierta && (
          <span className="ml-auto shrink-0 font-dm-sans text-12 font-bold text-east-bay">
            {cantidad}
          </span>
        )}
      </div>
      {abierta && (
        <ListaSugerencias
          id={idLista}
          idOpcion={idOpcion}
          consulta={consulta}
          resultados={resultados}
          cargando={cargando}
          error={error}
          idActivo={activo?.id ?? null}
          idsRestringidos={idsRestringidos}
          clasesPorCompanero={clasesPorCompanero}
          colorDe={colorDe}
          onElegir={elegir}
          onActivar={setIdActivo}
          onReintentar={reintentar}
        />
      )}
    </div>
  )
}

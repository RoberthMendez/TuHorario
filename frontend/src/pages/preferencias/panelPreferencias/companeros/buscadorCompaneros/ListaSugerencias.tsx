import type { Companero } from '../../../../../types/Preferencias'
import ResultadoCompanero from './ResultadoCompanero'

interface ListaSugerenciasProps {
  id: string
  /** Id del elemento de cada sugerencia (para `aria-activedescendant`). */
  idOpcion: (companero: Companero) => string
  consulta: string
  resultados: Companero[]
  cargando: boolean
  error: boolean
  idActivo: number | null
  idsRestringidos: Set<number>
  clasesPorCompanero: Map<number, number>
  colorDe: (idCompanero: number) => string | undefined
  onElegir: (companero: Companero) => void
  onActivar: (id: number) => void
  onReintentar: () => void
}

// Lista desplegada bajo el buscador con las primeras coincidencias.
export default function ListaSugerencias({
  id,
  idOpcion,
  consulta,
  resultados,
  cargando,
  error,
  idActivo,
  idsRestringidos,
  clasesPorCompanero,
  colorDe,
  onElegir,
  onActivar,
  onReintentar,
}: ListaSugerenciasProps) {
  return (
    <ul
      id={id}
      role="listbox"
      aria-label="Sugerencias de compañeros"
      aria-busy={cargando}
      className="absolute inset-x-0 top-full z-20 animate-aparecer overflow-hidden rounded-b-bloque border-2 border-t-0 border-bunting bg-white shadow-base-4"
    >
      {error ? (
        <li className="flex flex-wrap items-center justify-center gap-x-2 px-3.5 py-4 font-dm-sans text-14 text-east-bay">
          No pudimos buscar en este momento.
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onReintentar}
            className="cursor-pointer font-bold text-sapphire underline"
          >
            Reintentar
          </button>
        </li>
      ) : resultados.length === 0 ? (
        <li className="px-3.5 py-4 text-center font-dm-sans text-14 text-east-bay">
          {cargando ? 'Buscando…' : `Nadie coincide con «${consulta.trim()}»`}
        </li>
      ) : (
        resultados.map((companero) => (
          <ResultadoCompanero
            key={companero.id}
            id={idOpcion(companero)}
            companero={companero}
            consulta={consulta}
            activo={companero.id === idActivo}
            restringido={idsRestringidos.has(companero.id)}
            clases={clasesPorCompanero.get(companero.id) ?? 0}
            fondo={colorDe(companero.id)}
            onElegir={() => onElegir(companero)}
            onActivar={() => onActivar(companero.id)}
          />
        ))
      )}
    </ul>
  )
}

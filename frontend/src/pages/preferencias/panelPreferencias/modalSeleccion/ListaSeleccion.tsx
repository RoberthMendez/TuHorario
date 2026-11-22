import type { ReactNode } from 'react'
import EsqueletoLista from './EsqueletoLista'
import EstadoLista from './EstadoLista'
import FilaSeleccion from './FilaSeleccion'
import type { TextosModal } from './ModalSeleccion'
import type { EstadoConsulta } from './useConsulta'

interface ListaSeleccionProps<T> {
  estado: EstadoConsulta<T[]>
  resultados: T[]
  consulta: string
  textos: TextosModal
  idDe: (item: T) => number
  idsSeleccionados: Set<number>
  idsAgregados: Set<number>
  contenidoFila: (item: T, consulta: string) => ReactNode
  onAlternar: (item: T) => void
  onReintentar: () => void
}

// Lista del modal según el estado de la consulta: cargando, error, vacía,
// sin resultados para la búsqueda o los resultados.
export default function ListaSeleccion<T>({
  estado,
  resultados,
  consulta,
  textos,
  idDe,
  idsSeleccionados,
  idsAgregados,
  contenidoFila,
  onAlternar,
  onReintentar,
}: ListaSeleccionProps<T>) {
  if (estado.tipo === 'cargando') return <EsqueletoLista />

  if (estado.tipo === 'error') {
    return (
      <EstadoLista
        titulo={textos.error}
        texto="Revisa tu conexión e inténtalo de nuevo."
        accion={{ texto: 'Reintentar', onClick: onReintentar }}
      />
    )
  }

  if (estado.datos.length === 0) {
    return (
      <EstadoLista
        titulo={textos.listaVacia.titulo}
        texto={textos.listaVacia.texto}
      />
    )
  }

  if (resultados.length === 0) {
    return (
      <EstadoLista
        titulo={textos.sinResultados}
        texto={`Nada coincide con "${consulta.trim()}". Prueba escribiéndolo de otra forma.`}
      />
    )
  }

  return (
    <ul
      aria-label={textos.etiquetaBuscar}
      className="flex flex-col gap-1.5 py-1"
    >
      {resultados.map((item) => (
        <li key={idDe(item)}>
          <FilaSeleccion
            seleccionada={idsSeleccionados.has(idDe(item))}
            agregada={idsAgregados.has(idDe(item))}
            textoAgregada={textos.yaAgregado}
            onAlternar={() => onAlternar(item)}
          >
            {contenidoFila(item, consulta)}
          </FilaSeleccion>
        </li>
      ))}
    </ul>
  )
}

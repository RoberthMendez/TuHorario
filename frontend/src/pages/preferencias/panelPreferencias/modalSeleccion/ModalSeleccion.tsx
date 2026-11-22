import { useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import BuscadorModal from './BuscadorModal'
import { coincide } from './buscar'
import EncabezadoModal from './EncabezadoModal'
import ListaSeleccion from './ListaSeleccion'
import PieSeleccion from './PieSeleccion'
import { useConsulta } from './useConsulta'

export interface TextosModal {
  titulo: string
  descripcion: string
  placeholder: string
  etiquetaBuscar: string
  /** Para contar: ["clase", "clases"]. */
  unidad: [singular: string, plural: string]
  /** Pista del pie cuando no hay nada elegido. */
  pista: string
  sinResultados: string
  listaVacia: { titulo: string; texto: string }
  error: string
  /** Etiqueta de los ya agregados ("Ya agregada"). */
  yaAgregado: string
}

interface ModalSeleccionProps<T> {
  icono: string
  textos: TextosModal
  /** Servicio que trae los elementos (se llama al abrir). */
  consultar: (signal: AbortSignal) => Promise<T[]>
  idDe: (item: T) => number
  /** Textos donde se busca (nombre, código, asignaturas…). */
  textosBusqueda: (item: T) => string[]
  /** Ya agregados: salen atenuados y no se pueden elegir. */
  idsAgregados: Set<number>
  /** Contenido de la fila (ficha, nombre resaltado, detalle). */
  contenidoFila: (item: T, consulta: string) => ReactNode
  /** Chip de un elemento elegido, en el pie. */
  chip: (item: T, quitar: () => void) => ReactNode
  onConfirmar: (items: T[]) => void
  onCerrar: () => void
}

/*
 * Ventana emergente para elegir varios elementos a la vez (clases,
 * profesores…): consulta un servicio, permite buscar y elegir varios antes de
 * confirmar. Usa `<dialog>` nativo: atrapa el foco, se cierra con Esc y su
 * fondo (`::backdrop`) se difumina. Se monta al abrirse y se desmonta al
 * cerrarse.
 */
export default function ModalSeleccion<T>({
  icono,
  textos,
  consultar,
  idDe,
  textosBusqueda,
  idsAgregados,
  contenidoFila,
  chip,
  onConfirmar,
  onCerrar,
}: ModalSeleccionProps<T>) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const buscador = useRef<HTMLInputElement>(null)
  const inicioClic = useRef<EventTarget | null>(null)
  const idTitulo = useId()
  const { estado, reintentar } = useConsulta(consultar)
  const [consulta, setConsulta] = useState('')
  const [seleccion, setSeleccion] = useState<T[]>([])

  useEffect(() => {
    const el = dialogo.current
    if (!el) return
    if (!el.open) el.showModal()
    buscador.current?.focus()
    return () => el.close()
  }, [])

  const resultados =
    estado.tipo === 'listo'
      ? estado.datos.filter((item) => coincide(textosBusqueda(item), consulta))
      : []
  const idsSeleccionados = new Set(seleccion.map(idDe))

  const alternar = (item: T) =>
    setSeleccion((actual) =>
      actual.some((x) => idDe(x) === idDe(item))
        ? actual.filter((x) => idDe(x) !== idDe(item))
        : [...actual, item],
    )

  // Enter en el buscador: elige el primer resultado disponible y limpia la
  // búsqueda para escribir el siguiente.
  const elegirPrimero = () => {
    const primero = resultados.find(
      (x) => !idsAgregados.has(idDe(x)) && !idsSeleccionados.has(idDe(x)),
    )
    if (!primero) return
    alternar(primero)
    setConsulta('')
  }

  // Clic en el fondo difuminado (fuera de la tarjeta) cierra el modal. Se
  // exige que el clic empiece y termine ahí, para no cerrarlo al soltar una
  // selección de texto fuera.
  const alClicFondo = (e: MouseEvent<HTMLDialogElement>) => {
    if (
      e.target === e.currentTarget &&
      inicioClic.current === e.currentTarget
    ) {
      onCerrar()
    }
  }

  return (
    <dialog
      ref={dialogo}
      aria-labelledby={idTitulo}
      onCancel={(e) => {
        e.preventDefault()
        onCerrar()
      }}
      onMouseDown={(e) => (inicioClic.current = e.target)}
      onClick={alClicFondo}
      className="m-auto h-[min(calc(var(--u)*680),calc(100dvh-var(--u)*48))] w-[calc(100vw-var(--u)*32)] max-w-160 overflow-visible rounded-tarjeta border-2 border-bunting bg-white p-0 text-bunting shadow-carta backdrop:animate-aparecer backdrop:bg-bunting/30 backdrop:backdrop-blur-sm open:flex open:animate-entrar motion-reduce:open:animate-none"
    >
      <div className="flex min-h-0 w-full flex-col">
        <div className="px-5 pt-6 sm:px-7">
          <EncabezadoModal
            idTitulo={idTitulo}
            icono={icono}
            titulo={textos.titulo}
            descripcion={textos.descripcion}
            onCerrar={onCerrar}
          />
          <div className="mt-5">
            <BuscadorModal
              ref={buscador}
              valor={consulta}
              onCambiar={setConsulta}
              onEnter={elegirPrimero}
              cantidad={estado.tipo === 'listo' ? resultados.length : null}
              unidad={textos.unidad}
              placeholder={textos.placeholder}
              etiqueta={textos.etiquetaBuscar}
            />
          </div>
        </div>
        <div className="barra-scroll mt-3 min-h-0 flex-1 overflow-y-auto px-5 pb-4 sm:px-7">
          <ListaSeleccion
            estado={estado}
            resultados={resultados}
            consulta={consulta}
            textos={textos}
            idDe={idDe}
            idsSeleccionados={idsSeleccionados}
            idsAgregados={idsAgregados}
            contenidoFila={contenidoFila}
            onAlternar={alternar}
            onReintentar={reintentar}
          />
        </div>
        <PieSeleccion
          cantidad={seleccion.length}
          unidad={textos.unidad}
          pista={textos.pista}
          chips={seleccion.map((item) => (
            <li key={idDe(item)}>{chip(item, () => alternar(item))}</li>
          ))}
          onCancelar={onCerrar}
          onConfirmar={() => onConfirmar(seleccion)}
        />
      </div>
    </dialog>
  )
}

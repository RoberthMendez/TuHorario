import { useEffect, useId, useRef } from 'react'
import type { MouseEvent } from 'react'
import iconoEjemplo from '../../../assets/icono-ejemplo.svg'
import { obtenerEjemplos } from '../../../services/ejemplosService'
import EncabezadoModal from '../panelPreferencias/modalSeleccion/EncabezadoModal'
import EsqueletoLista from '../panelPreferencias/modalSeleccion/EsqueletoLista'
import EstadoLista from '../panelPreferencias/modalSeleccion/EstadoLista'
import { useConsulta } from '../panelPreferencias/modalSeleccion/useConsulta'
import OpcionEjemplo from './OpcionEjemplo'

interface ModalEjemplosProps {
  /** Clave del ejemplo que se está creando (null si ninguno). */
  cargando: string | null
  /** Por qué falló la última carga (se borra al volver a intentar). */
  error: string | null
  onElegir: (clave: string) => void
  onCerrar: () => void
}

/*
 * Ventana para elegir qué ejemplo de la sustentación cargar: el completo y
 * uno por cada nivel del algoritmo (los trae el backend). Al tocar uno se
 * crea; si sale bien, la página se llena con sus estudiantes y el modal
 * desaparece con la sección que lo abrió. Usa `<dialog>` nativo, como
 * `ModalSeleccion`: atrapa el foco, se cierra con Esc o tocando el fondo
 * (salvo mientras carga).
 */
export default function ModalEjemplos({
  cargando,
  error,
  onElegir,
  onCerrar,
}: ModalEjemplosProps) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const inicioClic = useRef<EventTarget | null>(null)
  const idTitulo = useId()
  const { estado, reintentar } = useConsulta(obtenerEjemplos)

  useEffect(() => {
    const el = dialogo.current
    if (!el) return
    if (!el.open) el.showModal()
    return () => el.close()
  }, [])

  const cerrar = () => {
    if (cargando === null) onCerrar()
  }

  // Igual que en ModalSeleccion: el clic debe empezar y terminar en el fondo.
  const alClicFondo = (e: MouseEvent<HTMLDialogElement>) => {
    if (
      e.target === e.currentTarget &&
      inicioClic.current === e.currentTarget
    ) {
      cerrar()
    }
  }

  return (
    <dialog
      ref={dialogo}
      aria-labelledby={idTitulo}
      onCancel={(e) => {
        e.preventDefault()
        cerrar()
      }}
      onMouseDown={(e) => (inicioClic.current = e.target)}
      onClick={alClicFondo}
      className="m-auto max-h-[min(calc(var(--u)*760),calc(100dvh-var(--u)*48))] w-[calc(100vw-var(--u)*32)] max-w-180 overflow-visible rounded-tarjeta border-2 border-bunting bg-white p-0 text-bunting shadow-carta backdrop:animate-aparecer backdrop:bg-bunting/30 backdrop:backdrop-blur-sm open:flex open:animate-entrar motion-reduce:open:animate-none"
    >
      <div className="flex min-h-0 w-full flex-col">
        <div className="px-5 pt-6 sm:px-7">
          <EncabezadoModal
            idTitulo={idTitulo}
            icono={iconoEjemplo}
            titulo="¿Qué ejemplo quieres cargar?"
            descripcion="Cada nivel muestra lo que agrega ese nivel del algoritmo; el completo los usa todos. Puedes revisar y editar a los estudiantes antes de finalizar. Si ya habías cargado un ejemplo, se reemplaza."
            onCerrar={cerrar}
          />
          {error && (
            <p
              role="alert"
              className="mt-3 animate-entrar font-dm-sans text-14 font-bold text-alizarin"
            >
              {error}
            </p>
          )}
        </div>
        <div className="barra-scroll mt-4 min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-7">
          {estado.tipo === 'cargando' && <EsqueletoLista />}
          {estado.tipo === 'error' && (
            <EstadoLista
              titulo="No pudimos traer los ejemplos"
              texto="Revisa que el backend esté corriendo e inténtalo de nuevo."
              accion={{ texto: 'Reintentar', onClick: reintentar }}
            />
          )}
          {estado.tipo === 'listo' && (
            <ul className="flex flex-col gap-2">
              {estado.datos.map((ejemplo, i) => (
                <li
                  key={ejemplo.clave}
                  className="animate-entrar motion-reduce:animate-none"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <OpcionEjemplo
                    ejemplo={ejemplo}
                    cargando={cargando === ejemplo.clave}
                    bloqueada={cargando !== null}
                    onElegir={() => onElegir(ejemplo.clave)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </dialog>
  )
}

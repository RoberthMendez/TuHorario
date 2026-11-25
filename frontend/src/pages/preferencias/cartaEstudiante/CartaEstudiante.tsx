import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { CSSProperties } from 'react'
import type { Estudiante } from '../../../types/Estudiante'
import type { PreferenciasEstudiante } from '../../../types/Preferencias'
import PanelPreferencias from '../panelPreferencias/PanelPreferencias'
import CabeceraCarta from './CabeceraCarta'
import ConfirmarEliminar from './ConfirmarEliminar'
import DatosEstudiante from './DatosEstudiante'
import Desplegable from './Desplegable'

interface CartaEstudianteProps {
  estudiante: Estudiante
  numero: number
  /** Recién creado: se despliega solo (con su animación) y se muestra. */
  abrirAlMontar?: boolean
  /** Mientras se elimina (servicio y animación de salida). */
  eliminando: boolean
  onEliminar: () => void
  /** Recibe las preferencias del estudiante cada vez que cambian. */
  onCambiarPreferencias: (
    idEstudiante: number,
    preferencias: PreferenciasEstudiante,
  ) => void
}

// Carta de un estudiante: colapsada por defecto; la flecha la despliega, el
// ojo oculta/muestra sus datos personales y la caneca lo elimina (tras
// confirmar).
export default function CartaEstudiante({
  estudiante,
  numero,
  abrirAlMontar = false,
  eliminando,
  onEliminar,
  onCambiarPreferencias,
}: CartaEstudianteProps) {
  const idEstudiante = estudiante.id
  const cambiarPreferencias = useCallback(
    (preferencias: PreferenciasEstudiante) =>
      onCambiarPreferencias(idEstudiante, preferencias),
    [idEstudiante, onCambiarPreferencias],
  )
  const [abierta, setAbierta] = useState(false)
  const [verDatos, setVerDatos] = useState(true)
  const [confirmando, setConfirmando] = useState(false)
  const idContenido = `preferencias-estudiante-${estudiante.id}`
  const idConfirmacion = `eliminar-estudiante-${estudiante.id}`
  const botonEliminar = useRef<HTMLButtonElement>(null)

  // Alto real de la cabecera: el panel de preferencias lo resta de la altura
  // de la pantalla para que la carta abierta (sin datos) mida lo mismo que
  // ella.
  const cabecera = useRef<HTMLDivElement>(null)
  const carta = useRef<HTMLElement>(null)
  const [altoCabecera, setAltoCabecera] = useState<number>()

  // Se mide al abrir/cerrar (al aparecer el ojo el nombre puede partirse en
  // dos líneas) y cada vez que la cabecera cambia de tamaño.
  useLayoutEffect(() => {
    const el = cabecera.current
    if (!el) return
    const medir = () => setAltoCabecera(el.getBoundingClientRect().height)
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(el)
    return () => observador.disconnect()
  }, [abierta])

  // Se abre un cuadro después de montarse para que se vea el despliegue, y
  // la ventana baja hasta la carta.
  useEffect(() => {
    if (!abrirAlMontar) return
    const cuadro = requestAnimationFrame(() => {
      setAbierta(true)
      carta.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      })
    })
    return () => cancelAnimationFrame(cuadro)
  }, [abrirAlMontar])

  return (
    <article
      ref={carta}
      className="scroll-mt-6 overflow-hidden rounded-resaltado border-2 border-bunting bg-white shadow-carta"
      style={
        altoCabecera
          ? ({ '--alto-cabecera': `${altoCabecera}px` } as CSSProperties)
          : undefined
      }
    >
      <CabeceraCarta
        ref={cabecera}
        numero={numero}
        nombre={estudiante.nombre}
        abierta={abierta}
        verDatos={verDatos}
        idContenido={idContenido}
        onAlternar={() => setAbierta((valor) => !valor)}
        onAlternarDatos={() => setVerDatos((valor) => !valor)}
        refEliminar={botonEliminar}
        confirmando={confirmando}
        idConfirmacion={idConfirmacion}
        onPedirEliminar={() => setConfirmando((valor) => !valor)}
      />
      {confirmando && (
        <ConfirmarEliminar
          id={idConfirmacion}
          nombre={estudiante.nombre}
          eliminando={eliminando}
          onCancelar={() => {
            setConfirmando(false)
            botonEliminar.current?.focus()
          }}
          onConfirmar={onEliminar}
        />
      )}
      <Desplegable abierto={abierta} id={idContenido}>
        <div className={abierta ? 'animate-entrar' : ''}>
          <DatosEstudiante estudiante={estudiante} visible={verDatos} />
        </div>
        <PanelPreferencias
          animar={abierta}
          idEstudiante={idEstudiante}
          onCambiarPreferencias={cambiarPreferencias}
        />
      </Desplegable>
    </article>
  )
}

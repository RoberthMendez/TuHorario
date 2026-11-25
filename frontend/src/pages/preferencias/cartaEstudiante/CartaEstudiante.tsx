import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { Estudiante } from '../../../types/Estudiante'
import type { PreferenciasEstudiante } from '../../../types/Preferencias'
import PanelPreferencias from '../panelPreferencias/PanelPreferencias'
import CabeceraCarta from './CabeceraCarta'
import ConfirmarEliminar from './ConfirmarEliminar'
import DatosEstudiante from './DatosEstudiante'
import PistaDatos from './PistaDatos'
import Desplegable from '../../../components/Desplegable'

interface CartaEstudianteProps {
  estudiante: Estudiante
  numero: number
  /** Recién creado: se despliega solo (con su animación) y se muestra. */
  abrirAlMontar?: boolean
  /** Preferencias con las que arranca su panel (al repetir un intento). */
  preferenciasIniciales?: PreferenciasEstudiante
  /** Mientras se elimina (servicio y animación de salida). */
  eliminando: boolean
  onEliminar: () => void
  /** Guarda el nombre nuevo; si falla, lanza el error. */
  onRenombrar: (nombre: string) => Promise<void>
  /** Recibe las preferencias del estudiante cada vez que cambian. */
  onCambiarPreferencias: (
    idEstudiante: number,
    preferencias: PreferenciasEstudiante,
  ) => void
}

// Carta de un estudiante: colapsada por defecto; la flecha la despliega, el
// lápiz edita su nombre, el ojo oculta/muestra sus datos personales y la
// caneca lo elimina (tras confirmar). Los datos solo se ven de una al
// crearlo; cada vez que se abre la carta empiezan ocultos, con un aviso que
// señala el ojo.
export default function CartaEstudiante({
  estudiante,
  numero,
  abrirAlMontar = false,
  preferenciasIniciales,
  eliminando,
  onEliminar,
  onRenombrar,
  onCambiarPreferencias,
}: CartaEstudianteProps) {
  const idEstudiante = estudiante.id
  const cambiarPreferencias = useCallback(
    (preferencias: PreferenciasEstudiante) =>
      onCambiarPreferencias(idEstudiante, preferencias),
    [idEstudiante, onCambiarPreferencias],
  )
  const [abierta, setAbierta] = useState(false)
  const [verDatos, setVerDatos] = useState(abrirAlMontar)
  const [confirmando, setConfirmando] = useState(false)
  const idContenido = `preferencias-estudiante-${estudiante.id}`
  const idConfirmacion = `eliminar-estudiante-${estudiante.id}`
  const botonEliminar = useRef<HTMLButtonElement>(null)

  // Alto real de la cabecera (con el aviso del ojo, si está): el panel de
  // preferencias lo resta de la altura de la pantalla para que la carta
  // abierta (sin datos) mida lo mismo que ella.
  const cabecera = useRef<HTMLDivElement>(null)
  const carta = useRef<HTMLElement>(null)

  // Se mide al abrir/cerrar (al aparecer el ojo el nombre puede partirse en
  // dos líneas) y cada vez que la cabecera cambia de tamaño. Va directo al
  // estilo de la carta, sin estado: mientras el aviso se despliega cambia en
  // cada cuadro y así no se vuelve a pintar todo el panel.
  useLayoutEffect(() => {
    const el = cabecera.current
    const contenedor = carta.current
    if (!el || !contenedor) return
    const medir = () =>
      contenedor.style.setProperty(
        '--alto-cabecera',
        `${el.getBoundingClientRect().height}px`,
      )
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
    >
      <div ref={cabecera}>
        <CabeceraCarta
          numero={numero}
          nombre={estudiante.nombre}
          abierta={abierta}
          verDatos={verDatos}
          idContenido={idContenido}
          onAlternar={() => {
            // Al abrirla, los datos empiezan ocultos.
            if (!abierta) setVerDatos(false)
            setAbierta(!abierta)
          }}
          onAlternarDatos={() => setVerDatos((valor) => !valor)}
          onRenombrar={onRenombrar}
          refEliminar={botonEliminar}
          confirmando={confirmando}
          idConfirmacion={idConfirmacion}
          onPedirEliminar={() => setConfirmando((valor) => !valor)}
        />
        <Desplegable abierto={abierta && !verDatos}>
          <PistaDatos />
        </Desplegable>
      </div>
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
          iniciales={preferenciasIniciales}
          onCambiarPreferencias={cambiarPreferencias}
        />
      </Desplegable>
    </article>
  )
}

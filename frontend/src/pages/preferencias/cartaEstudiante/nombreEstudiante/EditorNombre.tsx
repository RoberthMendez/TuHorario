import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { mensajeDeError } from '../../../../services/api'
import {
  formatearNombre,
  limpiarNombre,
  revisarNombre,
  type ProblemaNombre,
} from '../../nombrarEstudiante/nombre'
import BotonGuardarNombre from './BotonGuardarNombre'

interface EditorNombreProps {
  nombre: string
  /** Guarda el nombre nuevo (ya limpio); si falla, se muestra el error. */
  onGuardar: (nombre: string) => Promise<void>
  onCancelar: () => void
}

const MENSAJES: Record<Exclude<ProblemaNombre, null>, string> = {
  vacio: 'Escribe su nombre y su apellido.',
  sinApellido: 'Falta el apellido.',
}

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
 * El nombre de la carta convertido en campo, con la misma tipografía. Sigue
 * las reglas de un estudiante nuevo (nombre y apellido, mayúscula inicial):
 * Enter o el chulo guardan, Escape cancela y al salir del campo se guarda si
 * cambió (o se descarta si quedó incompleto). Si falta algo, la caja niega.
 */
export default function EditorNombre({
  nombre,
  onGuardar,
  onCancelar,
}: EditorNombreProps) {
  const [valor, setValor] = useState(nombre)
  const [aviso, setAviso] = useState<ProblemaNombre>(null)
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const caja = useRef<HTMLFormElement>(null)
  const campo = useRef<HTMLInputElement>(null)

  useEffect(() => {
    campo.current?.focus({ preventScroll: true })
    campo.current?.select()
  }, [])

  const negar = (problema: Exclude<ProblemaNombre, null>) => {
    setAviso(problema)
    campo.current?.focus({ preventScroll: true })
    const el = caja.current
    if (!el || reducirMovimiento()) return
    el.classList.remove('animate-negar')
    void el.offsetWidth
    el.classList.add('animate-negar')
  }

  const alEscribir = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target
    const nuevo = formatearNombre(el.value)
    if (nuevo !== el.value) {
      const { selectionStart, selectionEnd } = el
      el.value = nuevo
      el.setSelectionRange(selectionStart, selectionEnd)
    }
    setValor(nuevo)
    setError(null)
    if (aviso) setAviso(revisarNombre(nuevo))
  }

  const guardar = async (limpio: string) => {
    setGuardando(true)
    setError(null)
    try {
      // Al guardar, la carta cierra el editor (este componente se desmonta).
      await onGuardar(limpio)
    } catch (err) {
      setError(mensajeDeError(err))
      setGuardando(false)
      campo.current?.focus({ preventScroll: true })
    }
  }

  const confirmar = (e: FormEvent) => {
    e.preventDefault()
    if (guardando) return
    const problema = revisarNombre(valor)
    if (problema) return negar(problema)
    const limpio = limpiarNombre(valor)
    if (limpio === nombre) return onCancelar()
    void guardar(limpio)
  }

  const alSalir = () => {
    if (guardando) return
    const limpio = limpiarNombre(valor)
    if (revisarNombre(valor) || limpio === nombre) return onCancelar()
    void guardar(limpio)
  }

  const mensaje = aviso
    ? MENSAJES[aviso]
    : error
      ? `No pudimos cambiar el nombre: ${error}`
      : null

  return (
    <form
      ref={caja}
      onSubmit={confirmar}
      onAnimationEnd={(e) =>
        e.target === e.currentTarget &&
        e.currentTarget.classList.remove('animate-negar')
      }
      aria-label="Editar nombre"
      className="flex min-w-0 flex-col"
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <input
          ref={campo}
          value={valor}
          onChange={alEscribir}
          onBlur={alSalir}
          onKeyDown={(e) => {
            if (e.key !== 'Escape' || guardando) return
            e.stopPropagation()
            onCancelar()
          }}
          readOnly={guardando}
          aria-label="Nombre del estudiante"
          aria-invalid={mensaje !== null}
          placeholder="Nombre y apellidos"
          autoComplete="off"
          spellCheck={false}
          maxLength={60}
          size={Math.max(valor.length, 12)}
          className={`max-w-full min-w-[calc(var(--u)*140)] border-b-2 bg-transparent font-jakarta text-22 font-extrabold text-bunting transition-[border-color,opacity] outline-none field-sizing-content placeholder:text-casper ${
            mensaje ? 'border-alizarin' : 'border-dashed border-sapphire'
          } ${guardando ? 'opacity-60' : ''}`}
        />
        <BotonGuardarNombre guardando={guardando} />
      </div>
      {mensaje && (
        <p
          aria-live="polite"
          className="mt-1 animate-entrar font-dm-sans text-13 font-bold text-alizarin motion-reduce:animate-none"
        >
          {mensaje}
        </p>
      )}
    </form>
  )
}

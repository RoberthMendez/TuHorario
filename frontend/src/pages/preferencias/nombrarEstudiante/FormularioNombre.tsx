import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type Ref,
} from 'react'
import BotonCrear from './BotonCrear'
import {
  formatearNombre,
  limpiarNombre,
  revisarNombre,
  type ProblemaNombre,
} from './nombre'

/** Para pedir el nombre desde fuera (p. ej. al tocar el velo). */
export interface ControlFormularioNombre {
  negar: () => void
}

interface FormularioNombreProps {
  ref?: Ref<ControlFormularioNombre>
  /** Pregunta sobre el campo. */
  etiqueta: string
  creando: boolean
  /** Por qué no se pudo crear el estudiante (lo manda el servidor). */
  error?: string | null
  onConfirmar: (nombre: string) => void
  /** Cada letra que se escribe (p. ej. para mostrarla en una ilustración). */
  onCambiarNombre?: (nombre: string) => void
  autoEnfocar?: boolean
  /** Va a la izquierda del campo (la insignia con el número). */
  insignia?: ReactNode
  /** Estilos de la caja (la que se sacude). */
  className?: string
}

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Lo que se le dice al usuario cuando no puede seguir.
type Aviso = Exclude<ProblemaNombre, null> | 'confirmar'

const MENSAJES: Record<Aviso, string> = {
  vacio: 'Primero ponle un nombre a tu estudiante.',
  sinApellido: 'Falta el apellido: escribe su nombre y su apellido.',
  confirmar: 'Toca «Crear estudiante» (o Enter) para seguir.',
}

/*
 * Campo para el nombre de un estudiante nuevo, con su botón "Crear
 * estudiante" (o Enter). Pide nombre y apellido, y mientras se escribe pone
 * cada palabra con mayúscula inicial (ver `nombre.ts`). Si falta algo no deja
 * seguir: la caja "niega" de lado a lado y dice qué falta en rojo.
 */
export default function FormularioNombre({
  ref,
  etiqueta,
  creando,
  error = null,
  onConfirmar,
  onCambiarNombre,
  autoEnfocar = false,
  insignia,
  className = '',
}: FormularioNombreProps) {
  const [nombre, setNombre] = useState('')
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const caja = useRef<HTMLFormElement>(null)
  const campo = useRef<HTMLInputElement>(null)
  const idCampo = useId()
  const idAyuda = useId()

  useEffect(() => {
    if (autoEnfocar) campo.current?.focus({ preventScroll: true })
  }, [autoEnfocar])

  const negar = (motivo: Aviso = revisarNombre(nombre) ?? 'confirmar') => {
    setAviso(motivo)
    campo.current?.focus({ preventScroll: true })
    const el = caja.current
    if (!el || reducirMovimiento()) return
    // Reinicia la animación aunque ya se hubiera sacudido antes.
    el.classList.remove('animate-negar')
    void el.offsetWidth
    el.classList.add('animate-negar')
  }

  useImperativeHandle(ref, () => ({ negar: () => negar() }))

  const alEscribir = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target
    const valor = formatearNombre(el.value)
    // Se corrige en el campo mismo y se deja el cursor donde estaba (el
    // formato no cambia el largo), así React no lo manda al final.
    if (valor !== el.value) {
      const { selectionStart, selectionEnd } = el
      el.value = valor
      el.setSelectionRange(selectionStart, selectionEnd)
    }
    setNombre(valor)
    onCambiarNombre?.(valor)
    // Si ya se estaba avisando, el aviso sigue lo que falte (o se va).
    if (aviso) setAviso(revisarNombre(valor))
  }

  const confirmar = (e: FormEvent) => {
    e.preventDefault()
    if (creando) return
    const problema = revisarNombre(nombre)
    if (problema) return negar(problema)
    onConfirmar(limpiarNombre(nombre))
  }

  return (
    <form
      ref={caja}
      onSubmit={confirmar}
      onAnimationEnd={(e) =>
        e.target === e.currentTarget &&
        e.currentTarget.classList.remove('animate-negar')
      }
      aria-label="Nuevo estudiante"
      className={className}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-3.75">
          {insignia}
          <div className="min-w-0 flex-1">
            <label
              htmlFor={idCampo}
              className="block font-dm-sans text-12 font-bold tracking-etiqueta text-east-bay uppercase"
            >
              {etiqueta}
            </label>
            <input
              ref={campo}
              id={idCampo}
              value={nombre}
              onChange={alEscribir}
              placeholder="Nombre y apellidos"
              autoComplete="off"
              spellCheck={false}
              maxLength={60}
              disabled={creando}
              aria-invalid={aviso !== null || error !== null}
              aria-describedby={idAyuda}
              className={`mt-0.5 w-full border-b-2 bg-transparent pb-0.5 font-jakarta text-22 font-extrabold text-bunting transition-colors outline-none placeholder:text-casper ${
                aviso
                  ? 'border-alizarin'
                  : 'border-dashed border-sapphire focus:border-solid'
              }`}
            />
          </div>
        </div>
        <BotonCrear creando={creando} />
      </div>
      <p
        id={idAyuda}
        aria-live="polite"
        className={`mt-3 font-dm-sans text-14 ${aviso || error ? 'font-bold text-alizarin' : 'text-east-bay'}`}
      >
        {aviso
          ? MENSAJES[aviso]
          : error
            ? `No pudimos crear al estudiante: ${error}`
            : 'Escribe su nombre y su apellido: con eso generamos su correo, cédula, teléfono y código estudiantil.'}
      </p>
    </form>
  )
}

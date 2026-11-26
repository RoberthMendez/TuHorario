import iconoEjemplo from '../../../assets/icono-ejemplo.svg'
import InsigniaNumero from '../../../components/InsigniaNumero'
import type { Ejemplo } from '../../../types/Ejemplo'

interface OpcionEjemploProps {
  ejemplo: Ejemplo
  /** Se está creando este ejemplo. */
  cargando: boolean
  /** Se está creando otro: no se puede elegir. */
  bloqueada: boolean
  onElegir: () => void
}

// "nivel-3" → 3; el completo no tiene número.
const numeroDeNivel = (clave: string) => {
  const numero = Number(clave.replace('nivel-', ''))
  return Number.isInteger(numero) ? numero : null
}

/*
 * Fila del modal de ejemplos: insignia (estrella del completo o número del
 * nivel), título, qué muestra y cuántos estudiantes crea. Al tocarla se carga.
 */
export default function OpcionEjemplo({
  ejemplo,
  cargando,
  bloqueada,
  onElegir,
}: OpcionEjemploProps) {
  const numero = numeroDeNivel(ejemplo.clave)
  const completo = numero === null

  return (
    <button
      type="button"
      onClick={onElegir}
      disabled={bloqueada}
      aria-busy={cargando}
      className={`group/opcion flex w-full cursor-pointer items-start gap-3.5 rounded-bloque border-2 px-3.5 py-3 text-left transition-[background-color,border-color,translate,rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sapphire motion-reduce:transition-none ${
        cargando
          ? 'disabled:cursor-wait border-sapphire bg-zircon-21'
          : completo
            ? 'border-bunting bg-cream-brulee/40 hover:-translate-y-0.5 hover:-rotate-[0.4deg] hover:bg-cream-brulee/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:rotate-0'
            : 'border-transparent bg-white hover:-translate-y-0.5 hover:rotate-[0.4deg] hover:border-link-water-27 hover:bg-zircon-10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:rotate-0'
      }`}
    >
      <span className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/opcion:-rotate-8 group-disabled/opcion:rotate-0 motion-reduce:transition-none">
        {completo ? (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-icono border-2 border-bunting bg-supernova shadow-diagonal">
            <img src={iconoEjemplo} alt="" className="size-6" />
          </span>
        ) : (
          <InsigniaNumero numero={numero} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="font-jakarta text-18 font-extrabold text-bunting">
            {ejemplo.titulo}
          </span>
          <span className="rounded-full bg-link-water px-2.5 py-0.5 font-dm-sans text-12 font-bold text-east-bay">
            {ejemplo.cantidadEstudiantes}{' '}
            {ejemplo.cantidadEstudiantes === 1 ? 'estudiante' : 'estudiantes'}
          </span>
          {cargando && (
            <span className="animate-pulse font-dm-sans text-12 font-bold text-sapphire motion-reduce:animate-none">
              Cargando…
            </span>
          )}
        </span>
        <span className="mt-1 block font-dm-sans text-14 text-east-bay">
          {ejemplo.descripcion}
        </span>
      </span>
    </button>
  )
}

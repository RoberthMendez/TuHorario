import iconoFlechaPanel from '../../assets/icono-flecha-panel.svg'
import Boton from '../../components/Boton'

interface ConfirmarFinalProps {
  /** Guarda las preferencias de todos y genera los horarios. */
  onFinalizar: () => void
  /** Mientras se guardan las preferencias y corre el algoritmo. */
  finalizando: boolean
  /** Estudiantes sin clases: mientras haya alguno no se puede finalizar. */
  faltanClases: string[]
  /** Mensaje si algo falló (se borra al volver a intentar). */
  error: string | null
}

// "Ana", "Ana y Luis", "Ana, Luis y Sara".
const lista = new Intl.ListFormat('es', { type: 'conjunction' })

export default function ConfirmarFinal({
  onFinalizar,
  finalizando,
  faltanClases,
  error,
}: ConfirmarFinalProps) {
  const bloqueado = faltanClases.length > 0

  return (
    <section className="flex flex-col gap-5 rounded-pie border-2 border-bunting bg-white px-8 py-7 shadow-carta sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-jakarta text-28 font-extrabold text-bunting">
          ¿Ya están todos?
        </h2>
        <p className="mt-1.5 font-dm-sans text-16 text-east-bay">
          Con esto armamos los horarios de todos los estudiantes.
        </p>
        {bloqueado ? (
          <p
            role="status"
            className="mt-2.5 animate-entrar font-dm-sans text-14 font-bold text-alizarin"
          >
            {faltanClases.length === 1
              ? `A ${faltanClases[0]} le falta elegir al menos una clase.`
              : `A ${lista.format(faltanClases)} les falta elegir al menos una clase.`}
          </p>
        ) : (
          error && (
            <p
              role="alert"
              className="mt-2.5 animate-entrar font-dm-sans text-14 font-bold text-alizarin"
            >
              {error}
            </p>
          )
        )}
      </div>
      <Boton
        texto={finalizando ? 'Generando…' : 'Finalizar'}
        icono={iconoFlechaPanel}
        variante="panel"
        ocupado={finalizando}
        deshabilitado={bloqueado}
        onClick={onFinalizar}
      />
    </section>
  )
}

import iconoFlechaPanel from '../../assets/icono-flecha-panel.svg'
import Boton from '../../components/Boton'

interface ConfirmarFinalProps {
  /** Guarda las preferencias de todos y genera los horarios. */
  onFinalizar: () => void
  /** Mientras se guardan las preferencias y corre el algoritmo. */
  finalizando: boolean
  /** Mensaje si algo falló (se borra al volver a intentar). */
  error: string | null
}

export default function ConfirmarFinal({
  onFinalizar,
  finalizando,
  error,
}: ConfirmarFinalProps) {
  return (
    <section className="flex flex-col gap-5 rounded-pie border-2 border-bunting bg-white px-8 py-7 shadow-carta sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-jakarta text-28 font-extrabold text-bunting">
          ¿Ya están todos?
        </h2>
        <p className="mt-1.5 font-dm-sans text-16 text-east-bay">
          Con esto armamos los horarios de todos los estudiantes.
        </p>
        {error && (
          <p
            role="alert"
            className="mt-2.5 animate-entrar font-dm-sans text-14 font-bold text-alizarin"
          >
            {error}
          </p>
        )}
      </div>
      <Boton
        texto={finalizando ? 'Generando…' : 'Finalizar'}
        icono={iconoFlechaPanel}
        variante="panel"
        ocupado={finalizando}
        onClick={onFinalizar}
      />
    </section>
  )
}

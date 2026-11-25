import iconoEjemplo from '../../assets/icono-ejemplo.svg'
import Boton from '../../components/Boton'

interface CargarEjemploProps {
  /** Crea los estudiantes del ejemplo y los pone en la página. */
  onCargar: () => void
  /** Mientras se crean y se recuperan sus preferencias. */
  cargando: boolean
  /** Por qué falló la última carga (se borra al volver a intentar). */
  error: string | null
}

/*
 * Atajo para la sustentación, debajo de la bienvenida: llena la página con
 * los 10 estudiantes del ejemplo (siempre los mismos, con sus preferencias)
 * pero no finaliza: se pueden revisar y editar antes de generar.
 */
export default function CargarEjemplo({
  onCargar,
  cargando,
  error,
}: CargarEjemploProps) {
  return (
    <section className="flex flex-col gap-5 rounded-pie border-3 border-dashed border-sapphire bg-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <span className="inline-block rotate-2 rounded-etiqueta bg-hawkes-blue px-3 py-1 font-jakarta text-13 font-extrabold text-bunting">
          Sustentación
        </span>
        <h2 className="mt-2.5 font-jakarta text-22 font-extrabold text-bunting">
          ¿Vas a presentar? Carga el ejemplo
        </h2>
        <p className="mt-1.5 font-dm-sans text-16 text-east-bay">
          10 estudiantes que usan todas las preferencias: a unos se les cumple
          todo y a otros les queda pendiente algo de cada tipo. Puedes
          revisarlos y editarlos antes de finalizar. Si ya lo habías cargado, se
          reemplaza.
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
        texto={cargando ? 'Cargando…' : 'Cargar ejemplo'}
        icono={iconoEjemplo}
        variante="claro"
        ocupado={cargando}
        onClick={onCargar}
      />
    </section>
  )
}

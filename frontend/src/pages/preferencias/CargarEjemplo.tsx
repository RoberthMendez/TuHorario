import { useState } from 'react'
import iconoEjemplo from '../../assets/icono-ejemplo.svg'
import Boton from '../../components/Boton'
import ModalEjemplos from './modalEjemplos/ModalEjemplos'

interface CargarEjemploProps {
  /** Crea los estudiantes del ejemplo elegido y los pone en la página. */
  onCargar: (clave: string) => void
  /** Clave del ejemplo que se está creando (null si ninguno). */
  cargando: string | null
  /** Por qué falló la última carga (se borra al volver a intentar). */
  error: string | null
}

/*
 * Atajo para la sustentación, debajo de la bienvenida: abre un modal para
 * elegir el ejemplo (el completo o uno por nivel del algoritmo) y llena la
 * página con sus estudiantes (siempre los mismos, con sus preferencias), pero
 * no finaliza: se pueden revisar y editar antes de generar.
 */
export default function CargarEjemplo({
  onCargar,
  cargando,
  error,
}: CargarEjemploProps) {
  const [abierto, setAbierto] = useState(false)

  return (
    <section className="flex flex-col gap-5 rounded-pie border-3 border-dashed border-sapphire bg-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <span className="inline-block rotate-2 rounded-etiqueta bg-hawkes-blue px-3 py-1 font-jakarta text-13 font-extrabold text-bunting">
          Sustentación
        </span>
        <h2 className="mt-2.5 font-jakarta text-22 font-extrabold text-bunting">
          ¿Vas a presentar? Carga un ejemplo
        </h2>
        <p className="mt-1.5 font-dm-sans text-16 text-east-bay">
          Elige el ejemplo completo, con todas las preferencias, o uno por cada
          nivel del algoritmo para mostrarlos de a uno. Puedes revisarlos y
          editarlos antes de finalizar.
        </p>
      </div>
      <Boton
        texto="Cargar ejemplo"
        icono={iconoEjemplo}
        variante="claro"
        onClick={() => setAbierto(true)}
      />
      {abierto && (
        <ModalEjemplos
          cargando={cargando}
          error={error}
          onElegir={onCargar}
          onCerrar={() => setAbierto(false)}
        />
      )}
    </section>
  )
}

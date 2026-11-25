import { useState } from 'react'
import FormularioNombre from '../nombrarEstudiante/FormularioNombre'
import IlustracionVacia from './ilustracionVacia/IlustracionVacia'
import PasosInicio from './PasosInicio'

interface EstadoVacioProps {
  creando: boolean
  /** Por qué falló el último intento de crear el estudiante. */
  error: string | null
  onConfirmar: (nombre: string) => void
}

/*
 * Bienvenida cuando aún no hay estudiantes: en vez de un botón suelto, una
 * tarjeta con la ilustración y el campo para el nombre del primero, listo
 * para escribir (en escritorio ya tiene el cursor; en el celular no, para no
 * abrir el teclado de una). Lo que se escribe aparece en la carta de la
 * ilustración.
 */
export default function EstadoVacio({
  creando,
  error,
  onConfirmar,
}: EstadoVacioProps) {
  const [nombre, setNombre] = useState('')
  const punteroFino = window.matchMedia('(pointer: fine)').matches

  return (
    <section className="grid gap-7 rounded-pie border-2 border-bunting bg-white px-5 py-7 shadow-carta sm:px-8 escritorio:grid-cols-[auto_1fr] escritorio:items-center escritorio:gap-10 escritorio:px-11 escritorio:py-9">
      <IlustracionVacia nombre={nombre} />
      <div className="min-w-0">
        <span
          className="inline-block -rotate-2 animate-pop rounded-etiqueta bg-buttercup px-3 py-1 font-jakarta text-13 font-extrabold text-bunting shadow-base-3 motion-reduce:animate-none"
          style={{ animationDelay: '420ms' }}
        >
          ¡Empecemos!
        </span>
        <h2 className="mt-3 font-jakarta text-28 font-extrabold text-bunting">
          ¿Quién es tu primer estudiante?
        </h2>
        <p className="mt-1.5 font-dm-sans text-16 text-east-bay">
          Escribe su nombre y le armamos su carta. Después eliges sus clases y
          sus preferencias, y nosotros encajamos las piezas.
        </p>
        <FormularioNombre
          etiqueta="Nombre del estudiante"
          creando={creando}
          error={error}
          onConfirmar={onConfirmar}
          onCambiarNombre={setNombre}
          autoEnfocar={punteroFino}
          className="mt-6"
        />
        <div className="mt-6 border-t-2 border-dashed border-link-water pt-5">
          <PasosInicio />
        </div>
      </div>
    </section>
  )
}

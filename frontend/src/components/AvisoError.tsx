import type { ReactNode } from 'react'

interface AvisoErrorProps {
  titulo: string
  /** Qué pasó (p. ej. el `detail` del backend o "no hay conexión"). */
  mensaje: string
  /** Botones para salir del error (reintentar, volver…). */
  children?: ReactNode
}

// Carta para cuando algo del backend falló y la página no puede seguir: dice
// qué pasó y ofrece cómo continuar. Misma forma que las cartas de cierre
// ("¿Ya están todos?", "¿Otro intento?").
export default function AvisoError({
  titulo,
  mensaje,
  children,
}: AvisoErrorProps) {
  return (
    <section
      role="alert"
      className="flex animate-entrar flex-col gap-6 rounded-pie border-2 border-bunting bg-white px-8 py-7 shadow-carta escritorio:flex-row escritorio:items-center escritorio:justify-between"
    >
      <div className="max-w-140">
        <h2 className="font-jakarta text-28 font-extrabold text-bunting">
          {titulo}
        </h2>
        <p className="mt-1.5 font-dm-sans text-16 font-bold text-alizarin">
          {mensaje}
        </p>
      </div>
      {children && (
        <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-5">
          {children}
        </div>
      )}
    </section>
  )
}

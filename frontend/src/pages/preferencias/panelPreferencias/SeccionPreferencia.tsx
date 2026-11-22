import type { ReactNode } from 'react'

interface SeccionPreferenciaProps {
  /** Ícono de la ficha amarilla del encabezado (vacía si no hay asset). */
  icono?: string
  titulo: string
  descripcion?: ReactNode
  /** La descripción de Profesores va a 16 unidades en el diseño. */
  descripcionGrande?: boolean
  insignia?: ReactNode
  children: ReactNode
}

// Tarjeta blanca común a todas las secciones del panel de preferencias.
export default function SeccionPreferencia({
  icono,
  titulo,
  descripcion,
  descripcionGrande = false,
  insignia,
  children,
}: SeccionPreferenciaProps) {
  return (
    <section className="rounded-seccion border-2 border-bunting bg-white px-4 pt-5 pb-5.5 shadow-seccion sm:px-5.5">
      <header className="flex items-center gap-3">
        <span className="flex size-9.5 shrink-0 items-center justify-center rounded-insignia border-[1.5px] border-bunting bg-supernova transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-12">
          {icono && <img src={icono} alt="" className="size-5.25" />}
        </span>
        <h4 className="font-jakarta text-18 font-extrabold text-bunting">
          {titulo}
        </h4>
        {insignia && <div className="ml-auto">{insignia}</div>}
      </header>
      {descripcion && (
        <p
          className={`mt-3 font-dm-sans text-east-bay ${descripcionGrande ? 'text-16' : 'text-14'}`}
        >
          {descripcion}
        </p>
      )}
      <div className={descripcion ? 'mt-2.5' : 'mt-3'}>{children}</div>
    </section>
  )
}

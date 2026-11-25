import type { Genero } from '../../types/Preferencias'

// Colores del profe y la profa genéricos (los de los SVG del diseño), iguales
// para todos los profesores.
export interface Apariencia {
  piel: { cara: string; cuello: string; nariz: string }
  pelo: { color: string; cejas: string }
  /** Saco (profe) o blusa (profa): color principal y solapas. */
  ropa: { color: string; oscuro: string }
  /** Corbata (profe) o aretes y dije (profa). */
  accesorio: string
  gafas: boolean
}

const piel = { cara: '#F4CBA6', cuello: '#E8B791', nariz: '#D9A07A' }

export const APARIENCIA: Record<Genero, Apariencia> = {
  masculino: {
    piel,
    pelo: { color: '#3A2B27', cejas: '#3A2B27' },
    ropa: { color: '#2B4BA8', oscuro: '#223B87' },
    accesorio: '#F7B418',
    gafas: true,
  },
  femenino: {
    piel,
    pelo: { color: '#6B4331', cejas: '#4A2E22' },
    ropa: { color: '#14224F', oscuro: '#0E1A40' },
    accesorio: '#F7B418',
    gafas: false,
  },
}

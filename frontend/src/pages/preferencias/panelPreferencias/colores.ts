import type { ColorPastel, NivelPreferencia } from '../../../types/Preferencias'

// Clases completas de Tailwind (no se pueden armar dinámicamente).

export const FONDO_PASTEL: Record<ColorPastel, string> = {
  beeswax: 'bg-beeswax',
  'white-ice': 'bg-white-ice',
  'tuft-bush': 'bg-tuft-bush',
  'titan-white': 'bg-titan-white',
  'carousel-pink': 'bg-carousel-pink',
  mabel: 'bg-mabel',
  snuff: 'bg-snuff',
  wheatfield: 'bg-wheatfield',
}

// Borde punteado de las clases sin elegir (color de acento de cada pastel).
export const BORDE_ACENTO: Record<ColorPastel, string> = {
  beeswax: 'border-buttercup',
  'white-ice': 'border-mountain-meadow',
  'tuft-bush': 'border-crusta',
  'titan-white': 'border-ship-cove',
  'carousel-pink': 'border-hopbush',
  mabel: 'border-pelorous',
  snuff: 'border-hopbush',
  wheatfield: 'border-sahara',
}

// Fondo de la ficha numérica de cada nivel de profesor (leyenda 0–3).
export const FONDO_NIVEL: Record<NivelPreferencia, string> = {
  0: 'bg-athens-gray',
  1: 'bg-zircon-21',
  2: 'bg-beeswax',
  3: 'bg-buttercup',
}

// Fondo del avatar del profesor según el nivel elegido.
export const FONDO_AVATAR: Record<NivelPreferencia, string> = {
  0: 'bg-mischka',
  1: 'bg-mountain-meadow',
  2: 'bg-buttercup',
  3: 'bg-crusta',
}

// Pastel + acento de cada bloque de la lista de prioridades (en orden).
export const COLORES_PRIORIDAD = [
  { fondo: 'bg-beeswax', numero: 'bg-buttercup' },
  { fondo: 'bg-white-ice', numero: 'bg-mountain-meadow' },
  { fondo: 'bg-titan-white', numero: 'bg-ship-cove' },
  { fondo: 'bg-tuft-bush', numero: 'bg-crusta' },
  { fondo: 'bg-carousel-pink', numero: 'bg-hopbush' },
  { fondo: 'bg-mabel', numero: 'bg-pelorous' },
]

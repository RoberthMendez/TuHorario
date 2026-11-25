import type { ColorPastel, NivelPreferencia } from '../types/Preferencias'

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

// Acento de cada pastel como relleno (el punto del profesor en los bloques
// del horario armado).
export const FONDO_ACENTO: Record<ColorPastel, string> = {
  beeswax: 'bg-buttercup',
  'white-ice': 'bg-mountain-meadow',
  'tuft-bush': 'bg-crusta',
  'titan-white': 'bg-ship-cove',
  'carousel-pink': 'bg-hopbush',
  mabel: 'bg-pelorous',
  snuff: 'bg-hopbush',
  wheatfield: 'bg-sahara',
}

// Fondo de la ficha numérica de cada nivel de profesor (leyenda 0–3).
export const FONDO_NIVEL: Record<NivelPreferencia, string> = {
  0: 'bg-athens-gray',
  1: 'bg-zircon-21',
  2: 'bg-beeswax',
  3: 'bg-buttercup',
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

// Color pastel fijo de cada clase según su id (el mismo en el modal y en la
// ficha de "Clases del semestre").
const COLORES_CLASE = Object.keys(FONDO_PASTEL) as ColorPastel[]

export function colorDeClase(id: number): ColorPastel {
  const n = COLORES_CLASE.length
  return COLORES_CLASE[((id % n) + n) % n]
}

// Color de las iniciales de cada compañero elegido: así dos con las mismas
// iniciales se distinguen, y cada uno se ve igual en todas sus clases.
// Acentos con buen contraste para el texto índigo.
export const FONDO_COMPANERO = [
  'bg-buttercup',
  'bg-mountain-meadow',
  'bg-ship-cove',
  'bg-crusta',
  'bg-hopbush',
  'bg-pelorous',
  'bg-sahara',
  'bg-periwinkle-gray',
]

// Lo mismo, como relleno de SVG (la camiseta de la personita que se lleva
// a la caneca al restringir), en el mismo orden que FONDO_COMPANERO.
export const RELLENO_COMPANERO = [
  'fill-buttercup',
  'fill-mountain-meadow',
  'fill-ship-cove',
  'fill-crusta',
  'fill-hopbush',
  'fill-pelorous',
  'fill-sahara',
  'fill-periwinkle-gray',
]

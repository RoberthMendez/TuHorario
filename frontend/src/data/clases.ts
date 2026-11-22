import type { Clase } from '../types/Preferencias'

// Mock de lo que devolverá `GET /clases` (ver services/clasesService.ts).
// Hay clases con el mismo nombre en distintas carreras: el código las
// diferencia (p. ej. los tres "Proyecto de Grado").
export const clasesDisponibles: Clase[] = [
  { id: 1, codigo: 'MAT-101', nombre: 'Cálculo Diferencial' },
  { id: 2, codigo: 'MAT-102', nombre: 'Cálculo Integral' },
  { id: 3, codigo: 'MAT-201', nombre: 'Cálculo Vectorial' },
  { id: 4, codigo: 'MAT-110', nombre: 'Álgebra Lineal' },
  { id: 5, codigo: 'MAT-210', nombre: 'Ecuaciones Diferenciales' },
  { id: 6, codigo: 'MAT-220', nombre: 'Estadística' },
  { id: 7, codigo: 'FIS-101', nombre: 'Física Mecánica' },
  { id: 8, codigo: 'FIS-102', nombre: 'Física Electricidad y Magnetismo' },
  { id: 9, codigo: 'QUI-101', nombre: 'Química General' },
  { id: 10, codigo: 'SIS-101', nombre: 'Introducción a la Programación' },
  { id: 11, codigo: 'SIS-201', nombre: 'Programación Avanzada' },
  { id: 12, codigo: 'SIS-202', nombre: 'Estructuras de Datos' },
  { id: 13, codigo: 'SIS-301', nombre: 'Análisis de Algoritmos' },
  { id: 14, codigo: 'SIS-302', nombre: 'Bases de Datos' },
  { id: 15, codigo: 'SIS-401', nombre: 'Ingeniería de Software' },
  { id: 16, codigo: 'IDI-210', nombre: 'Inglés Técnico' },
  { id: 17, codigo: 'HUM-301', nombre: 'Ética Profesional' },
  { id: 18, codigo: 'SIS-499', nombre: 'Proyecto de Grado' },
  { id: 19, codigo: 'ADM-499', nombre: 'Proyecto de Grado' },
  { id: 20, codigo: 'ARQ-499', nombre: 'Proyecto de Grado' },
]

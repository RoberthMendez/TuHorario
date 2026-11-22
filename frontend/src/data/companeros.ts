import type { Companero } from '../types/Preferencias'

// Estudiantes que se pueden buscar como compañeros (mock del backend).
const nombres = [
  'Sebastián Vargas',
  'Sebastián Vargas Pardo',
  'Sebastián Varela',
  'Sebastián Rincón',
  'Valentina Ospina',
  'Valeria Castro',
  'Juan Pablo Moreno',
  'Juan David Rojas',
  'Juliana Cárdenas',
  'María José Peña',
  'María Fernanda Gil',
  'Mateo Herrera',
  'Martín Suárez',
  'Camila Torres',
  'Carolina Ruiz',
  'Daniela Gómez',
  'David Restrepo',
  'Andrés Felipe León',
  'Andrea Molina',
  'Santiago Ríos',
  'Samuel Ortiz',
  'Laura Jiménez',
  'Luisa Fernanda Mejía',
  'Nicolás Prieto',
  'Natalia Acosta',
  'Tomás Beltrán',
  'Isabella Duarte',
  'Felipe Navarro',
]

/** "Sebastián Vargas Pardo" → "sebastian.vargaspardo@universidad.edu.co". */
function correoDe(nombre: string) {
  const [primero, ...resto] = nombre
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(' ')
  return `${primero}.${resto.join('')}@universidad.edu.co`
}

export const companerosDisponibles: Companero[] = nombres.map((nombre, i) => ({
  id: 101 + i,
  nombre,
  correo: correoDe(nombre),
}))

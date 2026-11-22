import type { Profesor } from '../types/Preferencias'

// Mock de lo que devolverá `GET /profesores?clases=…` (ver
// services/profesoresService.ts). `idsClases` usa los ids de data/clases.ts;
// algunos profes dictan más de una clase.
export const profesoresDisponibles: Profesor[] = [
  { id: 1, nombre: 'Natalia Pardo', genero: 'femenino', idsClases: [1, 2] },
  { id: 2, nombre: 'Sergio Quintero', genero: 'masculino', idsClases: [1] },
  { id: 3, nombre: 'Carlos Mejía', genero: 'masculino', idsClases: [2, 3] },
  { id: 4, nombre: 'Laura Restrepo', genero: 'femenino', idsClases: [3] },
  { id: 5, nombre: 'Andrés Rojas', genero: 'masculino', idsClases: [4] },
  { id: 6, nombre: 'Marcela Hurtado', genero: 'femenino', idsClases: [4, 5] },
  { id: 7, nombre: 'Julián Gómez', genero: 'masculino', idsClases: [5] },
  { id: 8, nombre: 'Diana Castro', genero: 'femenino', idsClases: [6] },
  { id: 9, nombre: 'Rodrigo Cañas', genero: 'masculino', idsClases: [7] },
  { id: 10, nombre: 'Paola Vargas', genero: 'femenino', idsClases: [7, 8] },
  { id: 11, nombre: 'Rodrigo Hurtado', genero: 'masculino', idsClases: [8] },
  { id: 12, nombre: 'Camila Ortiz', genero: 'femenino', idsClases: [9] },
  { id: 13, nombre: 'Felipe Salcedo', genero: 'masculino', idsClases: [9] },
  { id: 14, nombre: 'Rodrigo Rueda', genero: 'masculino', idsClases: [10, 11] },
  { id: 15, nombre: 'Valentina Ríos', genero: 'femenino', idsClases: [10] },
  {
    id: 16,
    nombre: 'Mauricio Vargas',
    genero: 'masculino',
    idsClases: [11, 12],
  },
  {
    id: 17,
    nombre: 'Juliana Martínez',
    genero: 'femenino',
    idsClases: [12, 13],
  },
  { id: 18, nombre: 'Óscar Bernal', genero: 'masculino', idsClases: [13] },
  { id: 19, nombre: 'Catalina Duarte', genero: 'femenino', idsClases: [14] },
  { id: 20, nombre: 'Hernán Moreno', genero: 'masculino', idsClases: [14, 15] },
  { id: 21, nombre: 'Lucía Fernández', genero: 'femenino', idsClases: [15] },
  { id: 22, nombre: 'Daniel Herrera', genero: 'masculino', idsClases: [16] },
  { id: 23, nombre: 'Sofía Navarro', genero: 'femenino', idsClases: [16] },
  { id: 24, nombre: 'Germán Pineda', genero: 'masculino', idsClases: [17] },
  { id: 25, nombre: 'Adriana Lozano', genero: 'femenino', idsClases: [17] },
  { id: 26, nombre: 'Ricardo Silva', genero: 'masculino', idsClases: [18] },
  { id: 27, nombre: 'Mónica Ramírez', genero: 'femenino', idsClases: [19] },
  { id: 28, nombre: 'Esteban Ruiz', genero: 'masculino', idsClases: [20] },
]

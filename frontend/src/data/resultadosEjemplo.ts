import type { Dia } from '../types/Horario'
import type { CursoAsignado, SesionCurso } from '../types/HorarioEstudiante'
import type { ResultadoEstudiante } from '../types/ResultadoEstudiante'

/*
 * TEMPORAL: resultados quemados para ajustar lo visual de la pantalla de
 * horarios mientras no se conecta con `POST /horarios/generar`. Tienen la
 * misma forma que la respuesta del backend (`HorarioEstudiante`). Los ids de
 * las clases están elegidos para que `colorDeClase` dé los colores de Figma.
 */

const sesion = (
  dia: Dia,
  horaInicio: string,
  horaFin: string,
  salon: string,
): SesionCurso => ({
  dia,
  horaInicio,
  horaFin,
  salon: { codigo: salon, edificio: '' },
})

const calculo = (sesiones: SesionCurso[]): CursoAsignado => ({
  id: 1,
  codigo: '2431',
  clase: { id: 8, codigo: '2431', nombre: 'Cálculo Integral' },
  profesor: { id: 1, nombre: 'Laura Duarte' },
  sesiones,
})

const algebra = (sesiones: SesionCurso[]): CursoAsignado => ({
  id: 2,
  codigo: '2467',
  clase: { id: 11, codigo: '2467', nombre: 'Álgebra Lineal' },
  profesor: { id: 2, nombre: 'Natalia Pardo' },
  sesiones,
})

const programacion = (sesiones: SesionCurso[]): CursoAsignado => ({
  id: 3,
  codigo: '2689',
  clase: { id: 10, codigo: '2689', nombre: 'Programación Avanzada' },
  profesor: { id: 3, nombre: 'Carlos Mejía' },
  sesiones,
})

const quimica = (sesiones: SesionCurso[]): CursoAsignado => ({
  id: 4,
  codigo: '2305',
  clase: { id: 12, codigo: '2305', nombre: 'Química General' },
  profesor: { id: 4, nombre: 'Rodrigo Cañas' },
  sesiones,
})

const fisica = (sesiones: SesionCurso[]): CursoAsignado => ({
  id: 5,
  codigo: '2512',
  clase: { id: 9, codigo: '2512', nombre: 'Física Mecánica' },
  profesor: { id: 5, nombre: 'Marcela Hurtado' },
  sesiones,
})

const etica = (sesiones: SesionCurso[]): CursoAsignado => ({
  id: 6,
  codigo: '2093',
  clase: { id: 15, codigo: '2093', nombre: 'Ética Profesional' },
  profesor: { id: 6, nombre: 'Rodrigo Hurtado' },
  sesiones,
})

const bases: CursoAsignado = {
  id: 7,
  codigo: '2120',
  clase: { id: 13, codigo: '2120', nombre: 'Bases de Datos' },
  profesor: { id: 7, nombre: 'Andrea Rincón' },
  sesiones: [
    sesion('martes', '11:00', '13:00', 'Lab. Sistemas 1'),
    sesion('jueves', '11:00', '13:00', 'Lab. Sistemas 1'),
  ],
}

export const resultadosEjemplo: ResultadoEstudiante[] = [
  {
    horario: {
      idEstudiante: 1,
      nombre: 'Guden Silva',
      cursos: [
        calculo([
          sesion('martes', '07:00', '09:00', 'Salón 4-203'),
          sesion('jueves', '07:00', '09:00', 'Salón 4-203'),
        ]),
        algebra([
          sesion('lunes', '10:00', '12:00', 'Salón 2-108'),
          sesion('miércoles', '10:00', '12:00', 'Salón 2-108'),
        ]),
        bases,
        etica([sesion('viernes', '14:00', '17:00', 'Salón 6-102')]),
      ],
      clasesNoAsignadas: [],
    },
    preferenciasSinCumplir: [],
  },
  {
    horario: {
      idEstudiante: 2,
      nombre: 'Adriana Salazar',
      cursos: [
        calculo([
          sesion('lunes', '07:00', '09:00', 'Salón 4-203'),
          sesion('miércoles', '07:00', '09:00', 'Salón 4-203'),
        ]),
        algebra([
          sesion('lunes', '09:00', '11:00', 'Salón 2-108'),
          sesion('miércoles', '09:00', '11:00', 'Salón 2-108'),
        ]),
        programacion([
          sesion('martes', '08:00', '10:00', 'Lab. Sistemas 2'),
          sesion('jueves', '14:00', '16:00', 'Lab. Sistemas 2'),
        ]),
        quimica([sesion('martes', '14:00', '16:00', 'Lab. Química 1')]),
        fisica([
          sesion('lunes', '16:00', '18:00', 'Salón 5-110'),
          sesion('viernes', '14:00', '16:00', 'Salón 5-110'),
        ]),
        etica([sesion('sábado', '08:00', '10:00', 'Salón 6-102')]),
      ],
      clasesNoAsignadas: [
        {
          clase: { id: 13, codigo: '2120', nombre: 'Bases de Datos' },
          prioridad: false,
        },
      ],
    },
    preferenciasSinCumplir: [
      'Ver Cálculo Integral con Samuel Velandia',
      'No ver clase a las 4:00 p. m. de un lunes',
      'Ver Álgebra Lineal con Sebastián Vargas',
      'No ver clase con Sergio Quintero',
    ],
  },
  {
    horario: {
      idEstudiante: 3,
      nombre: 'Roberth Méndez',
      cursos: [
        programacion([
          sesion('lunes', '08:00', '10:00', 'Lab. Sistemas 2'),
          sesion('miércoles', '08:00', '10:00', 'Lab. Sistemas 2'),
        ]),
        bases,
        fisica([
          sesion('martes', '14:00', '16:00', 'Salón 5-110'),
          sesion('jueves', '14:00', '16:00', 'Salón 5-110'),
        ]),
        quimica([sesion('viernes', '18:00', '20:00', 'Lab. Química 1')]),
      ],
      clasesNoAsignadas: [
        {
          clase: { id: 15, codigo: '2093', nombre: 'Ética Profesional' },
          prioridad: true,
        },
      ],
    },
    preferenciasSinCumplir: [
      'Ver clase con Adriana Salazar en Física Mecánica',
      'Horario sin huecos',
    ],
  },
]

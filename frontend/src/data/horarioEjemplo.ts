import type { BloqueHorario } from '../types/BloqueHorario'

// Horario de ejemplo que se muestra en la ilustración de la Landing.
export const bloquesEjemplo: BloqueHorario[] = [
  {
    id: 1,
    clase: 'Cálculo Diferencial',
    salon: 'Salón B-204',
    profesor: 'Mejía',
    horario: { id: 1, dia: 'lunes', horaInicio: '7:00', horaFin: '9:00' },
    color: 'azul',
    conector: 'derecha',
  },
  {
    id: 2,
    clase: 'Cálculo Diferencial',
    salon: 'Salón B-204',
    profesor: 'Mejía',
    horario: { id: 2, dia: 'miércoles', horaInicio: '7:00', horaFin: '9:00' },
    color: 'azul',
    conector: 'derecha',
  },
  {
    id: 3,
    clase: 'Arquitectura del Computador',
    salon: 'Salón E-012',
    profesor: 'Salcedo',
    horario: { id: 3, dia: 'sábado', horaInicio: '8:00', horaFin: '11:00' },
    color: 'crema',
  },
  {
    id: 4,
    clase: 'Programación',
    salon: 'Lab. C-301',
    profesor: 'Vargas',
    horario: { id: 4, dia: 'lunes', horaInicio: '9:00', horaFin: '11:00' },
    color: 'amarillo',
    conector: 'derecha',
  },
  {
    id: 5,
    clase: 'Física Mecánica',
    salon: 'Salón A-110',
    profesor: 'Pardo',
    horario: { id: 5, dia: 'martes', horaInicio: '9:00', horaFin: '11:00' },
    color: 'indigo',
    conector: 'derecha',
  },
  {
    id: 6,
    clase: 'Física Mecánica',
    salon: 'Salón A-110',
    profesor: 'Pardo',
    horario: { id: 6, dia: 'jueves', horaInicio: '9:00', horaFin: '11:00' },
    color: 'indigo',
  },
  {
    id: 7,
    clase: 'Programación',
    salon: 'Lab. C-301',
    profesor: 'Vargas',
    horario: { id: 7, dia: 'viernes', horaInicio: '9:00', horaFin: '12:00' },
    color: 'amarillo',
  },
]

// Pieza que "se está encajando" en el hueco del martes.
export const piezaEstadistica: BloqueHorario = {
  id: 8,
  clase: 'Estadística',
  salon: 'Salón D-105',
  profesor: 'Ortiz',
  horario: { id: 8, dia: 'martes', horaInicio: '11:00', horaFin: '13:00' },
  color: 'azul',
  conector: 'izquierda',
}

// Pieza suelta que sobresale de la tarjeta.
export const piezaEtica: BloqueHorario = {
  id: 9,
  clase: 'Ética Profesional',
  salon: 'Salón E-101',
  profesor: 'Rojas',
  horario: { id: 9, dia: 'sábado', horaInicio: '12:00', horaFin: '14:00' },
  color: 'azul',
}

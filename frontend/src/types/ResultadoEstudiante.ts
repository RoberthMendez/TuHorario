import type { HorarioEstudiante } from './HorarioEstudiante'

// Lo que muestra la pantalla de horarios de cada estudiante: el horario que
// le armó el algoritmo y, en texto, las preferencias que no se pudieron
// cumplir (el backend todavía no las devuelve).
export interface ResultadoEstudiante {
  horario: HorarioEstudiante
  preferenciasSinCumplir: string[]
}

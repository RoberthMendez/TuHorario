import type {
  ColorPastel,
  FranjaHabilitada,
  NivelPreferencia,
  PreferenciaClase,
  PreferenciaProfe,
  PrioridadPreferencias,
} from '../types/Preferencias'
import type { Dia } from '../types/Horario'

// Preferencias de ejemplo (iguales para todos los estudiantes por ahora).

export const clasesSemestre: PreferenciaClase[] = [
  {
    clase: { id: 1, codigo: 'MAT-101', nombre: 'Cálculo Diferencial' },
    prioridad: true,
    color: 'beeswax',
  },
  {
    clase: { id: 2, codigo: 'FIS-101', nombre: 'Física Mecánica' },
    prioridad: true,
    color: 'white-ice',
  },
  {
    clase: { id: 3, codigo: 'SIS-201', nombre: 'Programación Avanzada' },
    prioridad: true,
    color: 'tuft-bush',
  },
  {
    clase: { id: 4, codigo: 'MAT-102', nombre: 'Álgebra Lineal' },
    prioridad: true,
    color: 'titan-white',
  },
  {
    clase: { id: 5, codigo: 'QUI-101', nombre: 'Química General' },
    prioridad: false,
    color: 'carousel-pink',
  },
  {
    clase: { id: 6, codigo: 'IDI-201', nombre: 'Inglés Técnico' },
    prioridad: false,
    color: 'mabel',
  },
  {
    clase: { id: 7, codigo: 'MAT-201', nombre: 'Estadística' },
    prioridad: false,
    color: 'snuff',
  },
  {
    clase: { id: 8, codigo: 'HUM-101', nombre: 'Ética Profesional' },
    prioridad: false,
    color: 'wheatfield',
  },
]

export const nivelesProfesor: {
  nivel: NivelPreferencia
  descripcion: string
}[] = [
  { nivel: 0, descripcion: 'No quieres ver clase con ese profesor.' },
  {
    nivel: 1,
    descripcion: 'Buen profe, pero no está entre tus primeras opciones.',
  },
  {
    nivel: 2,
    descripcion: 'Lo prefieres: ojalá te toque, pero no es lo máximo.',
  },
  {
    nivel: 3,
    descripcion: 'Prioridad máxima: ¡que el algoritmo te ponga con él o ella!',
  },
]

// Búsqueda de profesores en curso.
export const busquedaProfesores = {
  consulta: 'Rodr',
  resultados: [
    { id: 11, nombre: 'Rodrigo Cañas', color: 'beeswax' as ColorPastel },
    { id: 12, nombre: 'Rodrigo Hurtado', color: 'white-ice' as ColorPastel },
    { id: 13, nombre: 'Rodrigo Rueda', color: 'tuft-bush' as ColorPastel },
  ],
}

export const profesoresElegidos: PreferenciaProfe[] = [
  { profesor: { id: 1, nombre: 'Sergio Quintero' }, preferencia: 0 },
  { profesor: { id: 2, nombre: 'Marcela Hurtado' }, preferencia: 1 },
  { profesor: { id: 3, nombre: 'Natalia Pardo' }, preferencia: 2 },
  { profesor: { id: 4, nombre: 'Carlos Mejía' }, preferencia: 3 },
]

// Búsqueda de compañeros en curso.
export const busquedaCompaneros = {
  consulta: 'Sebastián Var',
  resultados: [
    {
      id: 21,
      nombre: 'Sebastián Vargas',
      iniciales: 'SV',
      correo: 'sebastian.vargas@universidad.edu.co',
    },
    {
      id: 22,
      nombre: 'Sebastián Vargas Pardo',
      iniciales: 'SP',
      correo: 'sebastian.vargasp@universidad.edu.co',
    },
    {
      id: 23,
      nombre: 'Sebastián Varela',
      iniciales: 'SL',
      correo: 'sebastian.varela@universidad.edu.co',
    },
  ],
  restringidos: 2,
}

// Clases que se quieren compartir con el compañero elegido (orden del diseño).
export const clasesConCompanero: {
  nombre: string
  color: ColorPastel
  elegida: boolean
}[] = [
  { nombre: 'Cálculo Diferencial', color: 'beeswax', elegida: true },
  { nombre: 'Física Mecánica', color: 'white-ice', elegida: false },
  { nombre: 'Programación Avanzada', color: 'tuft-bush', elegida: true },
  { nombre: 'Álgebra Lineal', color: 'titan-white', elegida: true },
  { nombre: 'Química General', color: 'carousel-pink', elegida: false },
  { nombre: 'Inglés Técnico', color: 'mabel', elegida: true },
  { nombre: 'Estadística', color: 'snuff', elegida: true },
  { nombre: 'Ética Profesional', color: 'wheatfield', elegida: false },
]

export const diasFranjas: { dia: Dia; nombre: string }[] = [
  { dia: 'lunes', nombre: 'Lunes' },
  { dia: 'martes', nombre: 'Martes' },
  { dia: 'miércoles', nombre: 'Miércoles' },
  { dia: 'jueves', nombre: 'Jueves' },
  { dia: 'viernes', nombre: 'Viernes' },
  { dia: 'sábado', nombre: 'Sábado' },
]

// 7:00 a. m. a 8:00 p. m. (una fila por hora).
export const horasFranjas = Array.from({ length: 14 }, (_, i) => 7 + i)

export const franjasHabilitadas: FranjaHabilitada[] = [
  { dia: 'lunes', desde: 7, hasta: 12 },
  { dia: 'martes', desde: 7, hasta: 12 },
  { dia: 'miércoles', desde: 7, hasta: 12 },
  { dia: 'jueves', desde: 14, hasta: 19 },
  { dia: 'viernes', desde: 14, hasta: 19 },
]

// Selección que se está arrastrando en el diseño (sábado 8–11).
export const franjaArrastrando: FranjaHabilitada = {
  dia: 'sábado',
  desde: 8,
  hasta: 11,
}

export const prioridades: PrioridadPreferencias[] = [
  { tipoPreferencia: 'Clases con prioridad', prioridad: 1 },
  { tipoPreferencia: 'Profesores', prioridad: 2 },
  { tipoPreferencia: 'Compañeros', prioridad: 3 },
  { tipoPreferencia: 'Franjas Habilitadas', prioridad: 4 },
  { tipoPreferencia: 'Horario sin huecos', prioridad: 5 },
  { tipoPreferencia: 'Cercanía entre salones', prioridad: 6 },
]

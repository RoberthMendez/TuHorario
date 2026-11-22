import type { Estudiante } from '../types/Estudiante'

// Por ahora todos muestran los mismos datos de ejemplo del diseño.
const datosEjemplo = {
  codigoEstudiantil: '[Código]',
  tipoDocumento: { id: 1, tipo: 'Cédula' },
  numeroDocumento: '[N.º de cédula]',
  correo: '[correo@universidad.edu.co]',
  celular: '[N.º de teléfono]',
}

export const estudiantes: Estudiante[] = [
  { id: 1, nombre: 'Guden Silva', ...datosEjemplo },
  { id: 2, nombre: 'Adriana Salazar', ...datosEjemplo },
  { id: 3, nombre: 'Roberth Méndez', ...datosEjemplo },
]

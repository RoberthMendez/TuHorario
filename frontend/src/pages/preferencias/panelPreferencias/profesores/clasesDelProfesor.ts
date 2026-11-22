import type { PreferenciaClase, Profesor } from '../../../../types/Preferencias'

/**
 * Clases del estudiante que dicta el profesor, en el orden en que el
 * estudiante las tiene. La primera define el color del profesor.
 */
export function clasesDelProfesor(
  profesor: Profesor,
  clases: PreferenciaClase[],
): PreferenciaClase[] {
  return clases.filter((p) => profesor.idsClases.includes(p.clase.id))
}

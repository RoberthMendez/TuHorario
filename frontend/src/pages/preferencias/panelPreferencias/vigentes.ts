import type {
  PreferenciaClase,
  PreferenciaCompanero,
  PreferenciaProfe,
} from '../../../types/Preferencias'

/*
 * Las preferencias de profesores y compañeros siempre van ligadas a las
 * clases elegidas: al quitar una clase, el panel las recorta con estas
 * funciones (lo que se borra no vuelve si se agrega la clase de nuevo).
 */

/** Profesores que dictan alguna de las clases. */
export function profesoresDeClases(
  profesores: PreferenciaProfe[],
  clases: PreferenciaClase[],
) {
  const idsClases = new Set(clases.map((p) => p.clase.id))
  const quedan = profesores.filter((p) =>
    p.profesor.idsClases.some((id) => idsClases.has(id)),
  )
  return quedan.length === profesores.length ? profesores : quedan
}

/** Preferencias de compañeros en clases que siguen elegidas. */
export function companerosDeClases(
  preferencias: PreferenciaCompanero[],
  clases: PreferenciaClase[],
) {
  const idsClases = new Set(clases.map((p) => p.clase.id))
  const quedan = preferencias.filter((p) => idsClases.has(p.clase.id))
  return quedan.length === preferencias.length ? preferencias : quedan
}

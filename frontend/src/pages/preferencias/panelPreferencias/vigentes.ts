import type {
  PreferenciaClase,
  PreferenciaCompanero,
  PreferenciaProfe,
} from '../../../types/Preferencias'

/*
 * Los profesores y compañeros se guardan aunque se quite su clase (vuelven
 * si se agrega de nuevo), pero solo cuentan los ligados a clases elegidas.
 * Lo usan las secciones (para mostrar) y el panel (para armar las
 * preferencias del estudiante).
 */

/** Profesores que dictan alguna de las clases elegidas. */
export function profesoresVisibles(
  profesores: PreferenciaProfe[],
  clases: PreferenciaClase[],
) {
  const idsClases = new Set(clases.map((p) => p.clase.id))
  return profesores.filter((p) =>
    p.profesor.idsClases.some((id) => idsClases.has(id)),
  )
}

/** Preferencias de compañeros en clases que siguen elegidas. */
export function companerosVigentes(
  preferencias: PreferenciaCompanero[],
  clases: PreferenciaClase[],
) {
  const idsClases = new Set(clases.map((p) => p.clase.id))
  return preferencias.filter((p) => idsClases.has(p.clase.id))
}

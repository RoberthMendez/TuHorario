import { companerosDisponibles } from '../data/companeros'
import { coincide } from '../pages/preferencias/panelPreferencias/modalSeleccion/buscar'
import type { Companero } from '../types/Preferencias'
import { simularRespuesta } from './simulacion'

/*
 * Servicio de compañeros (otros estudiantes). Endpoint previsto:
 *
 *   GET /estudiantes?buscar=seb&limite=5
 *     →  200 [{ "id": 101, "nombre": "…", "correo": "…" }, …]
 *
 * Busca por nombre o correo (sin importar tildes) y devuelve como mucho
 * `limite` estudiantes, como las sugerencias de un correo.
 */

export const LIMITE_SUGERENCIAS = 5

/** Primeros estudiantes cuyo nombre o correo contiene `consulta`. */
export function buscarCompaneros(
  consulta: string,
  signal?: AbortSignal,
): Promise<Companero[]> {
  // TODO: cuando exista el endpoint, reemplazar por:
  //   return obtenerJson<Companero[]>(
  //     `/estudiantes?buscar=${encodeURIComponent(consulta)}` +
  //       `&limite=${LIMITE_SUGERENCIAS}`,
  //     { signal },
  //   )
  // (importando `obtenerJson` de './api').
  const encontrados = consulta.trim()
    ? companerosDisponibles
        .filter((c) => coincide([c.nombre, c.correo], consulta))
        .slice(0, LIMITE_SUGERENCIAS)
    : []
  return simularRespuesta(encontrados, signal, 220)
}

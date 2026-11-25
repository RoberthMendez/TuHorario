import type { PreferenciasEstudiante } from '../../../types/Preferencias'
import { agregar } from './franjas/horas'
import {
  PREFERENCIAS_OPCIONALES,
  TIPO_CLASES,
  TIPO_SIN_HUECOS,
  tipoDe,
  type IdPreferencia,
} from './preferenciasOpcionales'

/*
 * Con qué arranca el panel de un estudiante. Uno nuevo solo tiene las clases;
 * uno recuperado de un intento anterior abre las secciones que tienen algo,
 * con sus horas marcadas y su ranking.
 */

/** Secciones opcionales que tienen algo guardado. */
export function seccionesIniciales(
  p: PreferenciasEstudiante | undefined,
): IdPreferencia[] {
  if (!p) return []
  const tieneAlgo: Record<IdPreferencia, boolean> = {
    profesores: p.profesores.length > 0,
    companeros: p.companeros.length > 0 || p.restringidos.length > 0,
    franjas: p.franjasHabilitadas.length > 0 || p.preferenciaSinHuecos,
    cercania: p.preferenciaCercania,
  }
  return PREFERENCIAS_OPCIONALES.map((o) => o.id).filter((id) => tieneAlgo[id])
}

/**
 * Ranking guardado y, de últimas, lo que falte de las secciones abiertas
 * (así el ranking siempre tiene exactamente lo elegido).
 */
export function ordenInicial(
  p: PreferenciasEstudiante | undefined,
  activas: IdPreferencia[],
): string[] {
  const elegidas = [
    TIPO_CLASES,
    ...activas.map(tipoDe),
    ...(p?.preferenciaSinHuecos ? [TIPO_SIN_HUECOS] : []),
  ]
  const guardado = [...(p?.prioridades ?? [])]
    .sort((a, b) => a.prioridad - b.prioridad)
    .map((x) => x.tipoPreferencia)
    .filter((tipo) => elegidas.includes(tipo))
  return [...new Set([...guardado, ...elegidas])]
}

/** Horas marcadas en la grilla de franjas ("lunes|14"…). */
export const horasIniciales = (p: PreferenciasEstudiante | undefined) =>
  (p?.franjasHabilitadas ?? []).reduce(agregar, new Set<string>())

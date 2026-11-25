import type { PreferenciasEstudiante } from '../types/Preferencias'
import { enviarJson } from './api'

/*
 * Servicio de preferencias.
 *
 *   PUT /estudiantes/{id}/preferencias
 *     { "clases": [{ "idClase": 1, "prioridad": true }],
 *       "franjasHabilitadas": [{ "dia": "lunes", "horaInicio": "07:00", "horaFin": "09:00" }],
 *       "profesores": [{ "idProfesor": 2, "preferencia": 3 }],
 *       "companeros": [{ "idEstudiante": 5, "idClase": 1 }],
 *       "restringidos": [7],
 *       "preferenciaCercania": false, "preferenciaSinHuecos": true,
 *       "prioridades": [{ "tipoPreferencia": "clases", "prioridad": 1 }] }
 *     →  200 (lo guardado)
 *
 * Reemplaza todas las preferencias del estudiante.
 */

type TipoPreferencia =
  'clases' | 'profesores' | 'estudiantes' | 'horarios' | 'huecos' | 'cercania'

// Etiquetas del ranking en la vista (ver preferenciasOpcionales.ts) → tipos
// del backend (TAD Prioridad Preferencias).
const TIPO_DE_ETIQUETA: Record<string, TipoPreferencia> = {
  'Clases con prioridad': 'clases',
  Profesores: 'profesores',
  Compañeros: 'estudiantes',
  'Franjas Habilitadas': 'horarios',
  'Horario sin huecos': 'huecos',
  'Cercanía entre salones': 'cercania',
}

const hora = (h: number) => `${String(h).padStart(2, '0')}:00`

/*
 * El ranking solo puede incluir preferencias que tengan algo (el backend lo
 * valida): una sección añadida pero vacía, o un interruptor apagado, sale
 * del ranking y los demás suben de puesto.
 */
function tieneDatos(tipo: TipoPreferencia, p: PreferenciasEstudiante) {
  switch (tipo) {
    case 'clases':
      return true
    case 'profesores':
      return p.profesores.length > 0
    case 'estudiantes':
      return p.companeros.length > 0 || p.restringidos.length > 0
    case 'horarios':
      return p.franjasHabilitadas.length > 0
    case 'huecos':
      return p.preferenciaSinHuecos
    case 'cercania':
      return p.preferenciaCercania
  }
}

/** Cuerpo del PUT a partir de lo que arma el panel. */
export function aCuerpo(p: PreferenciasEstudiante) {
  const tipos = [...p.prioridades]
    .sort((a, b) => a.prioridad - b.prioridad)
    .map((x) => TIPO_DE_ETIQUETA[x.tipoPreferencia])
    .filter((tipo) => tipo !== undefined && tieneDatos(tipo, p))
  return {
    clases: p.clases.map((c) => ({
      idClase: c.clase.id,
      prioridad: c.prioridad,
    })),
    franjasHabilitadas: p.franjasHabilitadas.map((f) => ({
      dia: f.dia,
      horaInicio: hora(f.desde),
      horaFin: hora(f.hasta),
    })),
    profesores: p.profesores.map((x) => ({
      idProfesor: x.profesor.id,
      preferencia: x.preferencia,
    })),
    companeros: p.companeros.map((x) => ({
      idEstudiante: x.estudiantePreferido.id,
      idClase: x.clase.id,
    })),
    restringidos: p.restringidos.map((c) => c.id),
    preferenciaCercania: p.preferenciaCercania,
    preferenciaSinHuecos: p.preferenciaSinHuecos,
    prioridades: [...new Set(tipos)].map((tipoPreferencia, i) => ({
      tipoPreferencia,
      prioridad: i + 1,
    })),
  }
}

/** Guarda (reemplaza) todas las preferencias de un estudiante. */
export async function guardarPreferencias(
  idEstudiante: number,
  preferencias: PreferenciasEstudiante,
  signal?: AbortSignal,
): Promise<void> {
  await enviarJson(
    'PUT',
    `/estudiantes/${idEstudiante}/preferencias`,
    aCuerpo(preferencias),
    { signal },
  )
}

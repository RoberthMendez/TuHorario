import { ErrorApi } from '../../services/api'
import { obtenerClases } from '../../services/clasesService'
import { obtenerEstudiante } from '../../services/estudiantesService'
import {
  etiquetasDelRanking,
  obtenerPreferencias,
  type CuerpoPreferencias,
} from '../../services/preferenciasService'
import { obtenerProfesores } from '../../services/profesoresService'
import { colorDeClase } from '../../styles/colores'
import type { Estudiante } from '../../types/Estudiante'
import type {
  Clase,
  Companero,
  PreferenciasEstudiante,
  Profesor,
} from '../../types/Preferencias'

/*
 * "Repetir intento": vuelve a armar en Preferencias los estudiantes de un
 * intento anterior con lo que guardó el backend (sus datos y sus
 * preferencias, que solo traen ids). Los estudiantes que ya no existen se
 * omiten, igual que lo que apunte a algo borrado.
 */

export interface Intento {
  estudiantes: Estudiante[]
  /** Preferencias de cada estudiante (por id), con la forma del panel. */
  preferencias: Map<number, PreferenciasEstudiante>
}

interface Catalogos {
  clases: Map<number, Clase>
  profesores: Map<number, Profesor>
  estudiantes: Map<number, Companero>
}

const porId = <T extends { id: number }>(lista: T[]) =>
  new Map(lista.map((x) => [x.id, x]))

/** El resultado, o null si el recurso ya no existe (404). */
async function siExiste<T>(pedido: Promise<T>): Promise<T | null> {
  try {
    return await pedido
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) return null
    throw error
  }
}

/** "07:00" → 7 (las franjas van en horas en punto). */
const horaEntera = (hhmm: string) => Number(hhmm.split(':')[0])

function desdeCuerpo(
  cuerpo: CuerpoPreferencias,
  { clases, profesores, estudiantes }: Catalogos,
): PreferenciasEstudiante {
  return {
    clases: cuerpo.clases.flatMap(({ idClase, prioridad }) => {
      const clase = clases.get(idClase)
      return clase ? [{ clase, prioridad, color: colorDeClase(idClase) }] : []
    }),
    profesores: cuerpo.profesores.flatMap(({ idProfesor, preferencia }) => {
      const profesor = profesores.get(idProfesor)
      return profesor ? [{ profesor, preferencia }] : []
    }),
    companeros: cuerpo.companeros.flatMap(({ idEstudiante, idClase }) => {
      const estudiantePreferido = estudiantes.get(idEstudiante)
      const clase = clases.get(idClase)
      return estudiantePreferido && clase
        ? [{ estudiantePreferido, clase }]
        : []
    }),
    restringidos: cuerpo.restringidos.flatMap((id) => {
      const restringido = estudiantes.get(id)
      return restringido ? [restringido] : []
    }),
    franjasHabilitadas: cuerpo.franjasHabilitadas.map((f) => ({
      dia: f.dia,
      desde: horaEntera(f.horaInicio),
      hasta: horaEntera(f.horaFin),
    })),
    preferenciaCercania: cuerpo.preferenciaCercania,
    preferenciaSinHuecos: cuerpo.preferenciaSinHuecos,
    prioridades: etiquetasDelRanking(cuerpo).map((tipoPreferencia, i) => ({
      tipoPreferencia,
      prioridad: i + 1,
    })),
  }
}

/** Estudiantes (en ese orden) y preferencias guardadas de un intento. */
export async function recuperarIntento(
  ids: number[],
  signal?: AbortSignal,
): Promise<Intento> {
  const [clases, profesores, guardados] = await Promise.all([
    obtenerClases(signal),
    obtenerProfesores(signal),
    Promise.all(
      ids.map((id) =>
        siExiste(
          Promise.all([
            obtenerEstudiante(id, signal),
            obtenerPreferencias(id, signal),
          ]),
        ),
      ),
    ),
  ])
  const vivos = guardados.filter((g) => g !== null)
  const estudiantes = new Map<number, Companero>(vivos.map(([e]) => [e.id, e]))

  // Compañeros o restringidos que no están en este intento (p. ej. creados
  // en otra sesión): se piden aparte.
  const otros = new Set(
    vivos
      .flatMap(([, c]) => [
        ...c.companeros.map((x) => x.idEstudiante),
        ...c.restringidos,
      ])
      .filter((id) => !estudiantes.has(id)),
  )
  const encontrados = await Promise.all(
    [...otros].map((id) => siExiste(obtenerEstudiante(id, signal))),
  )
  for (const otro of encontrados) {
    if (otro) estudiantes.set(otro.id, otro)
  }

  const catalogos: Catalogos = {
    clases: porId(clases),
    profesores: porId(profesores),
    estudiantes,
  }
  return {
    estudiantes: vivos.map(([e]) => e),
    preferencias: new Map(
      vivos.map(([e, cuerpo]) => [e.id, desdeCuerpo(cuerpo, catalogos)]),
    ),
  }
}

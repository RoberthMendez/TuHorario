import type { Estudiante } from '../types/Estudiante'
import { simularRespuesta } from './simulacion'

/*
 * Servicio de estudiantes. Endpoint previsto en el backend:
 *
 *   POST /estudiantes  { "nombre": "Roberth Méndez" }
 *     →  201 { "id": 1, "codigoEstudiantil": "20260001", … }
 *   DELETE /estudiantes/{id}  →  204
 *
 * El backend genera los demás datos. Mientras no exista, se simulan aquí con
 * las mismas reglas:
 *   - Código estudiantil: 2026 + consecutivo de 4 cifras (20260001, 20260002…).
 *   - Cédula: 10 cifras, consecutiva desde 1000000001; las últimas cifras son
 *     el número del estudiante (el 3.º es 1000000003).
 *   - Correo: inicial del nombre + primer apellido + últimas 2 cifras de la
 *     cédula, en minúscula y sin tildes (rmendez01@javeriana.edu.co).
 *   - Celular: 310 + 7 cifras al azar (310 482 1937).
 */

const DOMINIO = 'javeriana.edu.co'
const CEDULA_BASE = 1_000_000_000

// Consecutivo de la simulación (el backend lo llevaría en la base de datos).
let ultimoId = 0

/** Minúsculas, sin tildes ni eñes, solo letras y números. */
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

/*
 * Primer apellido según cuántas palabras tenga el nombre: "Ana Ruiz" → Ruiz;
 * "Ana Ruiz Gómez" → Ruiz; "Ana María Ruiz Gómez" → Ruiz (penúltima).
 */
function primerApellido(palabras: string[]) {
  if (palabras.length <= 1) return ''
  if (palabras.length <= 3) return palabras[1]
  return palabras[palabras.length - 2]
}

function generarCorreo(nombre: string, cedula: string) {
  const palabras = nombre.trim().split(/\s+/).map(normalizar).filter(Boolean)
  const inicial = palabras[0]?.[0] ?? 'e'
  const usuario = `${inicial}${primerApellido(palabras)}${cedula.slice(-2)}`
  return `${usuario}@${DOMINIO}`
}

function generarCelular() {
  const cifras = Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 10),
  ).join('')
  return `310 ${cifras.slice(0, 3)} ${cifras.slice(3)}`
}

/** Crea un estudiante con solo su nombre; el resto se genera. */
export function crearEstudiante(
  nombre: string,
  signal?: AbortSignal,
): Promise<Estudiante> {
  // TODO: cuando exista el endpoint, reemplazar por un POST a '/estudiantes'
  // con { nombre } (añadiendo a './api' una función para enviar JSON).
  const id = ++ultimoId
  const numeroDocumento = String(CEDULA_BASE + id)
  const estudiante: Estudiante = {
    id,
    nombre: nombre.trim().replace(/\s+/g, ' '),
    codigoEstudiantil: `2026${String(id).padStart(4, '0')}`,
    tipoDocumento: { id: 1, tipo: 'Cédula' },
    numeroDocumento,
    correo: generarCorreo(nombre, numeroDocumento),
    celular: generarCelular(),
  }
  return simularRespuesta(estudiante, signal, 350)
}

/** Elimina un estudiante (con sus clases y preferencias). */
export function eliminarEstudiante(
  id: number,
  signal?: AbortSignal,
): Promise<void> {
  // TODO: cuando exista el endpoint, reemplazar por un DELETE a
  // `/estudiantes/${id}` (añadiendo a './api' una función para enviarlo).
  // El consecutivo no se reutiliza: código y cédula no se repiten.
  void id
  return simularRespuesta(undefined, signal, 250)
}

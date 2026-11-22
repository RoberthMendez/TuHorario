import { partirPorCoincidencia } from './buscar'

interface TextoResaltadoProps {
  texto: string
  consulta: string
}

// Texto con las partes que coinciden con la búsqueda resaltadas en amarillo
// (sin importar mayúsculas ni tildes).
export default function TextoResaltado({
  texto,
  consulta,
}: TextoResaltadoProps) {
  return partirPorCoincidencia(texto, consulta).map((tramo, i) =>
    tramo.coincide ? (
      <mark key={i} className="rounded-marca bg-cream-brulee text-inherit">
        {tramo.texto}
      </mark>
    ) : (
      <span key={i}>{tramo.texto}</span>
    ),
  )
}

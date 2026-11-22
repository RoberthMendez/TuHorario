interface TextoCoincidenciaProps {
  texto: string
  consulta: string
  /** En Compañeros el resto del nombre también va en negrita. */
  restoNegrita?: boolean
}

// Nombre de un resultado con la parte buscada resaltada en amarillo.
export default function TextoCoincidencia({
  texto,
  consulta,
  restoNegrita = false,
}: TextoCoincidenciaProps) {
  const coincide = texto.toLowerCase().startsWith(consulta.toLowerCase())
  const resaltado = coincide ? texto.slice(0, consulta.length) : ''
  const resto = coincide ? texto.slice(consulta.length) : texto

  return (
    <span className="font-dm-sans text-15 text-bunting">
      {resaltado && (
        <mark className="rounded-marca bg-cream-brulee px-px font-bold text-bunting">
          {resaltado}
        </mark>
      )}
      <span className={restoNegrita ? 'font-bold' : ''}>{resto}</span>
    </span>
  )
}

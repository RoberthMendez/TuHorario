interface ResaltadoTituloProps {
  texto: string
}

export default function ResaltadoTitulo({ texto }: ResaltadoTituloProps) {
  return (
    // Ancho según el texto con margen igual a ambos lados: el tracking de -4
    // de la última letra se compensa con 4 unidades extra a la derecha.
    <span className="ml-1 inline-flex h-26.5 rotate-[-2.5deg] items-center rounded-resaltado bg-amarillo pr-5.5 pb-2 pl-4.5 shadow-solida">
      {texto}
    </span>
  )
}

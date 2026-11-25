interface TituloSubrayadoProps {
  texto: string
}

// Título de un panel desplegado, subrayado en amarillo ("Clases y
// preferencias", "Horario armado").
export default function TituloSubrayado({ texto }: TituloSubrayadoProps) {
  return (
    <h3 className="w-fit border-b-[calc(var(--u)*4.44)] border-supernova pr-8 pb-1 font-jakarta text-24 font-extrabold text-bunting">
      {texto}
    </h3>
  )
}

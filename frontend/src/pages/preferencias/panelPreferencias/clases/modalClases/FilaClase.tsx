import type { Clase } from '../../../../../types/Preferencias'
import { colorDeClase, FONDO_PASTEL } from '../../../../../styles/colores'
import TextoResaltado from '../../modalSeleccion/TextoResaltado'

interface FilaClaseProps {
  clase: Clase
  consulta: string
}

// Contenido de una clase en la lista del modal: ficha de color con su
// inicial, nombre (con la parte buscada resaltada) y código en pequeño.
export default function FilaClase({ clase, consulta }: FilaClaseProps) {
  return (
    <>
      <span
        aria-hidden
        className={`flex size-9.5 shrink-0 items-center justify-center rounded-icono border-[1.5px] border-bunting font-jakarta text-15 font-extrabold text-bunting transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/fila:-rotate-6 ${FONDO_PASTEL[colorDeClase(clase.id)]}`}
      >
        {clase.nombre.charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-jakarta text-15 font-extrabold text-bunting">
          <TextoResaltado texto={clase.nombre} consulta={consulta} />
        </span>
        <span className="mt-0.5 block font-dm-sans text-12 font-medium tracking-etiqueta text-east-bay/80">
          <TextoResaltado texto={clase.codigo} consulta={consulta} />
        </span>
      </span>
    </>
  )
}

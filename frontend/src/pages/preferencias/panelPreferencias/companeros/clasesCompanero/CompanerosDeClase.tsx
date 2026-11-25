import type { Companero } from '../../../../../types/Preferencias'
import AvatarCompanero from '../../../../../components/avatarCompanero/AvatarCompanero'
import TodosLosCompaneros from './TodosLosCompaneros'

// Iniciales que caben en la ficha; el resto va en el "+n".
const MAXIMO = 3

interface CompanerosDeClaseProps {
  nombreClase: string
  companeros: Companero[]
  colorDe: (idCompanero: number) => string | undefined
  onEditar: (companero: Companero) => void
}

// Fila discreta de iniciales (cada compañero con su color) al pie de la
// ficha de una clase. Tocar unas iniciales vuelve a abrir a ese compañero;
// el "+n" despliega la lista completa.
export default function CompanerosDeClase({
  nombreClase,
  companeros,
  colorDe,
  onEditar,
}: CompanerosDeClaseProps) {
  const visibles = companeros.slice(0, MAXIMO)
  const resto = companeros.length - visibles.length

  return (
    <ul
      aria-label={`Compañeros en ${nombreClase}`}
      className="absolute inset-x-0 bottom-2.5 flex justify-center -space-x-1.5"
    >
      {visibles.map((companero) => (
        <li key={companero.id} className="animate-pop">
          <button
            type="button"
            onClick={() => onEditar(companero)}
            title={`Con ${companero.nombre}`}
            aria-label={`Editar las clases con ${companero.nombre}`}
            className="relative block cursor-pointer rounded-full transition-[translate] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:z-10 hover:-translate-y-1 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sapphire"
          >
            <AvatarCompanero
              nombre={companero.nombre}
              fondo={colorDe(companero.id)}
              className="size-6.5 text-[calc(var(--u)*9.5)]"
            />
          </button>
        </li>
      ))}
      {resto > 0 && (
        <li className="animate-pop">
          <TodosLosCompaneros
            nombreClase={nombreClase}
            companeros={companeros}
            resto={resto}
            colorDe={colorDe}
            onEditar={onEditar}
          />
        </li>
      )}
    </ul>
  )
}

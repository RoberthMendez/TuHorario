const PASOS = [
  { texto: 'Nombre', fondo: 'bg-buttercup' },
  { texto: 'Clases', fondo: 'bg-white-ice' },
  { texto: 'Preferencias', fondo: 'bg-titan-white' },
]

// Los tres pasos por estudiante; el primero (el de ahora) va resaltado.
export default function PasosInicio() {
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2.5 sm:gap-x-2">
      {PASOS.map(({ texto, fondo }, i) => (
        <li key={texto} className="flex items-center gap-1.5 sm:gap-2">
          {i > 0 && (
            <span
              aria-hidden
              className="h-0 w-3 border-t-2 sm:w-5 border-dashed border-periwinkle-gray"
            />
          )}
          <span
            className={`flex size-7 items-center justify-center rounded-full border-2 border-bunting font-jakarta text-13 font-extrabold text-bunting ${fondo} ${
              i === 0 ? 'shadow-base-3' : ''
            }`}
          >
            {i + 1}
          </span>
          <span
            className={`font-dm-sans text-13 sm:text-14 ${i === 0 ? 'font-bold text-bunting' : 'text-east-bay'}`}
          >
            {texto}
          </span>
        </li>
      ))}
    </ol>
  )
}

// Flecha entre dos paradas del recorrido: al pasar el mouse por la ficha
// avanza un poquito, como si fuera de un edificio al otro. En el celular,
// donde las paradas se apilan, apunta hacia abajo.
export default function FlechaRecorrido() {
  return (
    <svg
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden
      className="size-5.5 shrink-0 rotate-90 text-bunting transition-[translate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-1 motion-reduce:transition-none sm:mt-0.75 sm:rotate-0 sm:group-hover:translate-x-1 sm:group-hover:translate-y-0"
    >
      <path
        d="M4.58 11H17.42M11.92 16.5L17.42 11L11.92 5.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

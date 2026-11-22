// Filas grises que laten mientras llega la respuesta del servicio.
export default function EsqueletoLista() {
  return (
    <ul
      aria-busy="true"
      aria-label="Cargando"
      className="flex animate-pulse flex-col gap-1.5 py-1 motion-reduce:animate-none"
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <li key={i} className="flex items-center gap-3 px-3 py-2.25">
          <span className="size-9.5 shrink-0 rounded-icono bg-link-water" />
          <span className="flex-1">
            <span
              className="block h-3.5 rounded-full bg-link-water"
              style={{ width: `${55 + ((i * 17) % 35)}%` }}
            />
            <span className="mt-2 block h-2.5 w-16 rounded-full bg-zircon-21" />
          </span>
          <span className="size-6.5 shrink-0 rounded-full bg-zircon-21" />
        </li>
      ))}
    </ul>
  )
}

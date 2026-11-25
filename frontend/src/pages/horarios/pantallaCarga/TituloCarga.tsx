// "Armando los horarios…" con los puntos saltando.
export default function TituloCarga() {
  return (
    <h1 className="flex items-center gap-2 font-jakarta text-28 font-extrabold whitespace-nowrap text-bunting">
      Armando los
      <span
        className="inline-flex h-11 rotate-[-1.5deg] animate-pop items-center rounded-icono bg-buttercup px-3 shadow-base-4"
        style={{ animationDelay: '200ms' }}
      >
        horarios
      </span>
      <span aria-hidden className="ml-0.5 flex gap-1 self-end pb-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 animate-saltar rounded-full bg-bunting motion-reduce:animate-none"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
    </h1>
  )
}

// Figuras decorativas a la derecha del título; flotan suavemente.
export default function Decoracion() {
  return (
    <div
      aria-hidden
      className="absolute -top-2 right-0 hidden h-37.5 w-50 sm:block"
    >
      <div className="absolute top-0 left-15.5 animate-flotar motion-reduce:animate-none">
        <div className="size-23 rounded-full bg-sapphire" />
      </div>
      <div className="absolute top-3.5 left-12 size-5.5 rounded-full bg-supernova" />
      <div className="absolute top-21 left-7 h-10 w-13 rounded-icono border-3 border-dashed border-bunting" />
      <div
        className="absolute top-17.5 left-35 animate-flotar motion-reduce:animate-none"
        style={{ animationDelay: '-2s' }}
      >
        <div className="size-15 rotate-12 rounded-caja border-2 border-bunting bg-supernova" />
      </div>
    </div>
  )
}

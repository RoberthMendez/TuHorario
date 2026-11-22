// Cronómetro de Alejandro (fuente Orbitron); los dos puntos titilan.
export default function Cronometro() {
  return (
    <span className="inline-block font-orbitron text-15 font-bold text-bunting tabular-nums">
      12
      <span className="animate-titilar motion-reduce:animate-none">:</span>
      04.64
    </span>
  )
}

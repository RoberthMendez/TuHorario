export default function FondoCuadricula() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-cuadricula)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-cuadricula)_1px,transparent_1px)] bg-size-[calc(var(--u)*60)_calc(var(--u)*60)]"
    />
  )
}

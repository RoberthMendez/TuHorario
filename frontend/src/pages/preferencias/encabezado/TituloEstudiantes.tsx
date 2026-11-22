export default function TituloEstudiantes() {
  return (
    // En móvil el título (≈470 unidades) se ajusta al ancho de la pantalla.
    <h1 className="flex items-center gap-2.25 font-jakarta text-56 font-extrabold whitespace-nowrap text-bunting [--u:min(1px,calc((100vw_-_2rem)/470))] escritorio:[--u:inherit]">
      Tus
      <span
        className="inline-flex h-16.5 rotate-[-1.5deg] animate-pop items-center rounded-bloque bg-buttercup px-4 shadow-base-5"
        style={{ animationDelay: '250ms' }}
      >
        Estudiantes
      </span>
    </h1>
  )
}

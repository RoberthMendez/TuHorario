// Mientras se recuperan del backend los estudiantes de un intento anterior
// ("Repetir intento" o al recargar la página): los puntos saltan como en la
// pantalla de carga de los horarios.
export default function CargandoIntento() {
  return (
    <section
      role="status"
      className="flex animate-entrar items-center gap-4 rounded-pie border-2 border-bunting bg-white px-8 py-7 shadow-carta"
    >
      <span aria-hidden className="flex shrink-0 gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2.5 animate-saltar rounded-full bg-bunting motion-reduce:animate-none"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
      <p className="font-jakarta text-22 font-extrabold text-bunting">
        Recuperando a tus estudiantes y sus preferencias…
      </p>
    </section>
  )
}

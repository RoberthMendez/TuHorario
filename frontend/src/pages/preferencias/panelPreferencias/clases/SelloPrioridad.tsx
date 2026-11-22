import IconoSello from './IconoSello'

interface SelloPrioridadProps {
  prioridad: boolean
  /** Se acaba de marcar: hace la animación de estampar. */
  estampando: boolean
  nombreClase: string
  onAlternar: () => void
  onFinEstampado: () => void
}

/*
 * Sello de prioridad de una clase (SVG del diseño, en línea para poder
 * cambiar su relleno).
 * - Sin prioridad: aparece en blanco al pasar el mouse por la clase, con
 *   `animate-aparecer-sello` (sin giro ni rebote: si girara mientras la
 *   ficha se inclina con rebote, se vería "temblar"). Con el mouse encima
 *   solo se tiñe de amarillo pastel.
 * - Al marcarlo: se "estampa" (baja, golpea la tarjeta, se aplasta y rebota)
 *   y en el golpe sale una onda amarilla. Queda amarillo siempre.
 */
export default function SelloPrioridad({
  prioridad,
  estampando,
  nombreClase,
  onAlternar,
  onFinEstampado,
}: SelloPrioridadProps) {
  const estampar = prioridad && estampando

  return (
    <button
      type="button"
      onClick={onAlternar}
      aria-pressed={prioridad}
      aria-label={
        prioridad
          ? `Quitar la prioridad de ${nombreClase}`
          : `Marcar ${nombreClase} con prioridad`
      }
      title={prioridad ? 'Quitar prioridad' : 'Marcar con prioridad'}
      className={`group/sello absolute -top-3 -left-2.5 size-10 -rotate-14 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire ${
        prioridad
          ? 'z-10'
          : 'pointer-events-none opacity-0 group-has-focus-visible:pointer-events-auto group-has-focus-visible:opacity-100 group-hover:pointer-events-auto group-hover:animate-aparecer-sello group-hover:opacity-100'
      }`}
    >
      {/* Onda del golpe */}
      {estampar && (
        <span
          aria-hidden
          className="absolute inset-0 animate-onda rounded-full border-[3px] border-supernova opacity-0 motion-reduce:hidden"
        />
      )}
      {/* `key` reinicia la animación al cambiar de estado */}
      <IconoSello
        key={String(prioridad)}
        onAnimationEnd={(e) => {
          if (e.animationName === 'estampar') onFinEstampado()
        }}
        relleno={`transition-[fill] duration-200 ${
          prioridad
            ? 'fill-supernova'
            : 'fill-white group-hover/sello:fill-beeswax'
        }`}
        className={`relative size-full ${
          estampar ? 'animate-estampar motion-reduce:animate-none' : ''
        }`}
      />
    </button>
  )
}

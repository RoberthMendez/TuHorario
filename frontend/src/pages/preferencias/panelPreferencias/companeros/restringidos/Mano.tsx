interface ManoProps {
  className?: string
}

/*
 * Mano (guante blanco, como el cursor del Wii) que agarra a la personita de
 * la camiseta. Dibujo de 24 × 32; pellizca en (12, 28).
 */
export default function Mano({ className = '' }: ManoProps) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      overflow="visible"
      aria-hidden
      className={className}
      stroke="var(--color-bunting)"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Manga que viene de arriba. */}
      <path d="M7.5 -8H16.5V11H7.5Z" fill="var(--color-link-water)" />
      <path d="M6.5 8.5H17.5V12.5H6.5Z" fill="white" />
      {/* Puño cerrado, pellizcando con los dedos hacia abajo. */}
      <path
        d="M5 15.5Q5 11.5 9 11.5H15Q19 11.5 19 15.5V22Q19 26 15 26H9Q5 26 5 22Z"
        fill="white"
      />
      <path d="M9 20.5V25.5M12 20.5V26M15 20.5V25.5" strokeWidth="1" />
      <path d="M10.5 26Q12 29.5 13.5 26" fill="white" />
      <path d="M5 17Q2.8 17.5 3.4 20.5Q4.4 22 6.5 21" fill="white" />
    </svg>
  )
}

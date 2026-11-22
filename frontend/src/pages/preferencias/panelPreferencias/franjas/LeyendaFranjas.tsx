const texto = 'font-dm-sans text-14 text-east-bay'
const muestra = 'size-4 rounded-marca border-2 border-bunting'

export default function LeyendaFranjas() {
  return (
    <div className="flex items-center gap-4.5">
      <span className="flex items-center gap-2">
        <span className={`${muestra} bg-zumthor`} />
        <span className={texto}>Libre</span>
      </span>
      <span className="flex items-center gap-2">
        <span className={`${muestra} bg-hawkes-blue`} />
        <span className={texto}>Seleccionada</span>
      </span>
    </div>
  )
}

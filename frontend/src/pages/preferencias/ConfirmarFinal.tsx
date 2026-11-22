import iconoFlechaPanel from '../../assets/icono-flecha-panel.svg'
import Boton from '../../components/Boton'

export default function ConfirmarFinal() {
  return (
    <section className="flex flex-col gap-5 rounded-pie border-2 border-bunting bg-white px-8 py-7 shadow-carta sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-jakarta text-28 font-extrabold text-bunting">
          ¿Ya están todos?
        </h2>
        <p className="mt-1.5 font-dm-sans text-16 text-east-bay">
          Con esto armamos los horarios de todos los estudiantes.
        </p>
      </div>
      <Boton texto="Finalizar" icono={iconoFlechaPanel} variante="panel" />
    </section>
  )
}

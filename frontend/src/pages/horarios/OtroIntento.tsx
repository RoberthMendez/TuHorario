import iconoDeCero from '../../assets/otroIntento/icono-de-cero.svg'
import iconoRepetir from '../../assets/otroIntento/icono-repetir.svg'
import Boton from '../../components/Boton'

interface OtroIntentoProps {
  /** Vuelve a Preferencias con los mismos estudiantes y preferencias. */
  onRepetir: () => void
  /** Vuelve a Preferencias vacía, para armar un intento nuevo. */
  onEmpezarDeCero: () => void
}

// Cierre de la página: probar otra vez, con lo mismo o desde cero.
export default function OtroIntento({
  onRepetir,
  onEmpezarDeCero,
}: OtroIntentoProps) {
  return (
    <section className="flex flex-col gap-6 rounded-pie border-2 border-bunting bg-white px-8 py-7 shadow-carta escritorio:flex-row escritorio:items-center escritorio:justify-between">
      <div className="max-w-100">
        <h2 className="font-jakarta text-28 font-extrabold text-bunting">
          ¿Otro intento?
        </h2>
        <p className="mt-1.5 font-dm-sans text-16 text-east-bay">
          Repítelo con los mismos estudiantes y sus preferencias, o arma uno
          nuevo desde cero.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-5">
        <Boton
          texto="Desde cero"
          icono={iconoDeCero}
          variante="claro"
          onClick={onEmpezarDeCero}
        />
        <Boton
          texto="Repetir intento"
          icono={iconoRepetir}
          variante="panel"
          onClick={onRepetir}
        />
      </div>
    </section>
  )
}

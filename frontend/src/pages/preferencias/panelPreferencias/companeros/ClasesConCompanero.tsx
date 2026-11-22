import { clasesConCompanero } from '../../../../data/preferenciasEjemplo'
import CajaSubseccion from '../CajaSubseccion'
import BotonListo from './BotonListo'
import TarjetaClaseCompanero from './TarjetaClaseCompanero'

// Las clases sin elegir van un poco torcidas, alternando el giro.
const INCLINACIONES = ['rotate-[-0.82deg]', 'rotate-[1.66deg]']

interface ClasesConCompaneroProps {
  nombre: string
}

export default function ClasesConCompanero({
  nombre,
}: ClasesConCompaneroProps) {
  const elegidas = clasesConCompanero.filter((clase) => clase.elegida).length
  // Giro de cada clase sin elegir, alternando según su orden entre ellas.
  const inclinaciones = clasesConCompanero.map((clase, i) =>
    clase.elegida
      ? ''
      : INCLINACIONES[
          clasesConCompanero.slice(0, i).filter((c) => !c.elegida).length % 2
        ],
  )

  return (
    <CajaSubseccion
      titulo={`Clases con ${nombre}`}
      cantidad={elegidas}
      ayuda="Toca las clases que quieras ver con él"
      amplia
    >
      <ul className="grid grid-cols-2 gap-4 pt-3 sm:grid-cols-[repeat(4,calc(var(--u)*141))] sm:justify-center sm:gap-5">
        {clasesConCompanero.map((clase, i) => (
          <li key={clase.nombre}>
            <TarjetaClaseCompanero
              nombre={clase.nombre}
              color={clase.color}
              elegida={clase.elegida}
              inclinacion={inclinaciones[i]}
            />
          </li>
        ))}
      </ul>
      <div className="mt-2.5 flex justify-end">
        <BotonListo />
      </div>
    </CajaSubseccion>
  )
}

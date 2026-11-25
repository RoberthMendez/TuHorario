import Decoracion from '../../../components/Decoracion'
import DescripcionHorarios from './DescripcionHorarios'
import TituloHorarios from './TituloHorarios'

export default function EncabezadoHorarios() {
  return (
    <header
      className="relative mt-7 animate-entrar"
      style={{ animationDelay: '80ms' }}
    >
      <TituloHorarios />
      <DescripcionHorarios />
      <Decoracion />
    </header>
  )
}

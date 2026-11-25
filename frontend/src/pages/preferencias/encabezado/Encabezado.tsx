import Decoracion from '../../../components/Decoracion'
import DescripcionEncabezado from './DescripcionEncabezado'
import TituloEstudiantes from './TituloEstudiantes'

export default function Encabezado() {
  return (
    <header
      className="relative mt-7 animate-entrar"
      style={{ animationDelay: '80ms' }}
    >
      <TituloEstudiantes />
      <DescripcionEncabezado />
      <Decoracion />
    </header>
  )
}

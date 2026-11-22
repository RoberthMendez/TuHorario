import Beneficio from './Beneficio'

export default function Beneficios() {
  return (
    <ul className="flex flex-col gap-1.5">
      <Beneficio texto="Tú defines las prioridades" />
      <Beneficio texto="TuHorario conecta las piezas" />
    </ul>
  )
}

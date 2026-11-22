import { DIAS_SEMANA } from '../../../data/semana'

export default function EncabezadoDias() {
  return (
    <div className="absolute top-0 left-12 grid h-12.5 w-161 grid-cols-[repeat(6,calc(var(--u)*108))] border-b-2 border-madison/18 pt-4 font-dm-sans text-dia font-bold text-madison">
      {DIAS_SEMANA.map(({ dia, abreviatura }) => (
        <span key={dia} className="text-center">
          {abreviatura}
        </span>
      ))}
    </div>
  )
}

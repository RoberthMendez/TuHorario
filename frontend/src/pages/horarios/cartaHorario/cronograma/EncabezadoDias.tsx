import { DIAS_SEMANA } from '../../../../data/semana'

// Fila de los días: esquina vacía sobre la columna de horas y un día por
// columna.
export default function EncabezadoDias() {
  return (
    <div className="grid grid-cols-[calc(var(--u)*104)_repeat(6,minmax(0,1fr))] border-b-2 border-bunting bg-zircon-10">
      <div className="h-10.5 border-r-2 border-bunting" />
      {DIAS_SEMANA.map(({ dia }, i) => (
        <div
          key={dia}
          className={`flex h-10.5 items-center justify-center font-jakarta text-12 font-extrabold tracking-[calc(var(--u)*0.72)] text-bunting uppercase ${i > 0 ? 'border-l-[1.333px] border-bunting/30' : ''}`}
        >
          {dia}
        </div>
      ))}
    </div>
  )
}

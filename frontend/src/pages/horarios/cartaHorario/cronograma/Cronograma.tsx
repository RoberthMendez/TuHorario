import iconoCronograma from '../../../../assets/cronograma/icono-seccion.svg'
import Seccion from '../../../../components/Seccion'
import { DIAS_SEMANA } from '../../../../data/semana'
import type {
  ClaseNoAsignada,
  CursoAsignado,
} from '../../../../types/HorarioEstudiante'
import BloqueCurso from './bloqueCurso/BloqueCurso'
import ClasesSinCupo from './ClasesSinCupo'
import ConteoClases from './ConteoClases'
import EncabezadoDias from './EncabezadoDias'
import FilaHora from './FilaHora'
import { HORAS, aMinutos } from './horas'

interface CronogramaProps {
  cursos: CursoAsignado[]
  /** Clases pedidas que el algoritmo no pudo ubicar. */
  sinCupo: ClaseNoAsignada[]
  /** Los bloques entran con animación (al desplegar la carta). */
  animar: boolean
}

// Semana del estudiante: cada sesión de cada curso en su día y sus horas.
// En pantallas angostas la grilla conserva su ancho y se desliza de lado.
export default function Cronograma({
  cursos,
  sinCupo,
  animar,
}: CronogramaProps) {
  const sesiones = cursos
    .flatMap((curso) => curso.sesiones.map((sesion) => ({ curso, sesion })))
    // Entran en orden de lectura: por hora y, a la misma hora, por día.
    .sort(
      (a, b) =>
        aMinutos(a.sesion.horaInicio) - aMinutos(b.sesion.horaInicio) ||
        DIAS_SEMANA.findIndex((d) => d.dia === a.sesion.dia) -
          DIAS_SEMANA.findIndex((d) => d.dia === b.sesion.dia),
    )
  return (
    <Seccion
      icono={iconoCronograma}
      titulo="Cronograma semanal"
      descripcion="Cada clase ocupa la franja en la que se dicta, con su profesor y su salón. Pasa el mouse por una para ver su código."
      extra={
        <ConteoClases
          inscritas={cursos.length}
          pedidas={cursos.length + sinCupo.length}
        />
      }
    >
      <div className="barra-scroll overflow-x-auto pb-1.5">
        <div className="min-w-234 overflow-hidden rounded-caja border-2 border-bunting bg-white">
          <EncabezadoDias />
          <div className="relative">
            {HORAS.map((hora, i) => (
              <FilaHora
                key={hora}
                hora={hora}
                ultima={i === HORAS.length - 1}
              />
            ))}
            <div className="absolute inset-y-0 right-0 left-26 grid grid-cols-6">
              {DIAS_SEMANA.map(({ dia }) => (
                <div key={dia} className="relative">
                  {sesiones.map(
                    ({ curso, sesion }, orden) =>
                      sesion.dia === dia && (
                        <BloqueCurso
                          key={`${curso.id}-${sesion.dia}-${sesion.horaInicio}`}
                          curso={curso}
                          sesion={sesion}
                          animar={animar}
                          orden={orden}
                        />
                      ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* En móvil/tablet la grilla no cabe: se avisa que se desliza. */}
      <p className="mt-1.5 font-dm-sans text-12 font-bold text-east-bay escritorio:hidden">
        ← Desliza para ver toda la semana →
      </p>
      {sinCupo.length > 0 && <ClasesSinCupo clases={sinCupo} />}
    </Seccion>
  )
}

import { useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import iconoSeccion from '../../../../assets/clases/icono-seccion.svg'
import type { Clase, PreferenciaClase } from '../../../../types/Preferencias'
import { colorDeClase } from '../colores'
import SeccionPreferencia from '../SeccionPreferencia'
import BotonAnadir from '../BotonAnadir'
import IconoSello from './IconoSello'
import InsigniaObligatorio from './InsigniaObligatorio'
import ModalAnadirClases from './modalClases/ModalAnadirClases'
import SinClases from './SinClases'
import TarjetaClase from './TarjetaClase'
import { useDeslizarAlReordenar } from '../useDeslizarAlReordenar'

// Al marcar una prioridad, la clase pasa adelante después del estampado.
const RETRASO_ORDEN_MS = 600

const reducirMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
 * Única preferencia obligatoria: arranca vacía y las clases se añaden desde
 * el modal (varias a la vez). Las clases con prioridad se muestran primero
 * (a la izquierda); al marcar una, primero se estampa el sello y luego la
 * ficha se desliza a su nuevo puesto.
 */
interface SeccionClasesProps {
  /** Las clases viven en el panel: las demás preferencias dependen de ellas. */
  clases: PreferenciaClase[]
  onCambiarClases: Dispatch<SetStateAction<PreferenciaClase[]>>
}

export default function SeccionClases({
  clases,
  onCambiarClases: setClases,
}: SeccionClasesProps) {
  // Ids que ya se muestran adelante (va un poco detrás de `prioridad` para
  // dejar ver el estampado antes de mover la ficha).
  const [adelante, setAdelante] = useState<Set<number>>(new Set())
  const [modalAbierto, setModalAbierto] = useState(false)
  const temporizadores = useRef(new Map<number, number>())
  const registrar = useDeslizarAlReordenar()

  useEffect(() => {
    const pendientes = temporizadores.current
    return () => pendientes.forEach((t) => clearTimeout(t))
  }, [])

  // Orden estable: primero las de prioridad, cada grupo en el orden en que
  // se añadieron.
  const ordenadas = [...clases].sort(
    (a, b) =>
      Number(!adelante.has(a.clase.id)) - Number(!adelante.has(b.clase.id)),
  )

  const abrirModal = () => setModalAbierto(true)

  const anadir = (nuevas: Clase[]) => {
    setClases((actuales) => [
      ...actuales,
      ...nuevas
        .filter((clase) => !actuales.some((p) => p.clase.id === clase.id))
        .map((clase) => ({
          clase,
          prioridad: false,
          color: colorDeClase(clase.id),
        })),
    ])
    setModalAbierto(false)
  }

  const alternarPrioridad = (id: number, nuevaPrioridad: boolean) => {
    setClases((actuales) =>
      actuales.map((p) =>
        p.clase.id === id ? { ...p, prioridad: nuevaPrioridad } : p,
      ),
    )
    const mover = () =>
      setAdelante((actual) => {
        const siguiente = new Set(actual)
        if (nuevaPrioridad) siguiente.add(id)
        else siguiente.delete(id)
        return siguiente
      })
    clearTimeout(temporizadores.current.get(id))
    if (nuevaPrioridad && !reducirMovimiento()) {
      temporizadores.current.set(id, setTimeout(mover, RETRASO_ORDEN_MS))
    } else {
      mover()
    }
  }

  const quitar = (id: number) =>
    setClases((actuales) => actuales.filter((p) => p.clase.id !== id))

  return (
    <SeccionPreferencia
      icono={iconoSeccion}
      titulo="Clases del semestre"
      insignia={<InsigniaObligatorio />}
      descripcion={
        <>
          Agrega las materias que este estudiante va a inscribir. A las que sean
          prioridad ponles el sello{' '}
          <IconoSello
            relleno="fill-supernova"
            className="inline-block size-4.5 -translate-y-0.25 -rotate-14 align-middle"
          />{' '}
          (pasa el mouse por la clase y tócalo): el algoritmo intentará
          asegurarlas primero.
        </>
      }
    >
      <div className="rounded-caja border-2 border-dashed border-sapphire bg-zircon-21 px-3 pt-8.5 pb-5.5 sm:px-5">
        {clases.length === 0 ? (
          <SinClases onAnadir={abrirModal} />
        ) : (
          <>
            {/* Rejilla de columnas fijas centrada: la segunda fila sigue las columnas */}
            <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-[repeat(auto-fill,calc(var(--u)*142))] sm:justify-center sm:gap-x-6.5 sm:gap-y-7">
              {ordenadas.map((preferencia) => (
                <li
                  key={preferencia.clase.id}
                  ref={registrar(preferencia.clase.id)}
                  className="animate-pop"
                >
                  <TarjetaClase
                    preferencia={preferencia}
                    onAlternarPrioridad={() =>
                      alternarPrioridad(
                        preferencia.clase.id,
                        !preferencia.prioridad,
                      )
                    }
                    onQuitar={() => quitar(preferencia.clase.id)}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-end">
              <BotonAnadir texto="Añadir clase" onClick={abrirModal} />
            </div>
          </>
        )}
      </div>
      {modalAbierto && (
        <ModalAnadirClases
          idsAgregados={new Set(clases.map((p) => p.clase.id))}
          onConfirmar={anadir}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </SeccionPreferencia>
  )
}

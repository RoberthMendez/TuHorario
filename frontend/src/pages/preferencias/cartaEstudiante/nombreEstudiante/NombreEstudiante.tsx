import { useEffect, useRef, useState } from 'react'
import BotonLapiz from './BotonLapiz'
import EditorNombre from './EditorNombre'

interface NombreEstudianteProps {
  nombre: string
  /** Guarda el nombre nuevo en el backend; si falla, lanza el error. */
  onRenombrar: (nombre: string) => Promise<void>
}

/*
 * Nombre de la cabecera con su lápiz. Al tocar el lápiz el nombre se vuelve
 * un campo editable (ver `EditorNombre`); al terminar, el foco vuelve al
 * lápiz.
 */
export default function NombreEstudiante({
  nombre,
  onRenombrar,
}: NombreEstudianteProps) {
  const [editando, setEditando] = useState(false)
  const lapiz = useRef<HTMLButtonElement>(null)
  const devolverFoco = useRef(false)

  useEffect(() => {
    if (editando || !devolverFoco.current) return
    devolverFoco.current = false
    lapiz.current?.focus({ preventScroll: true })
  }, [editando])

  const terminar = () => {
    // Solo si el foco seguía en el editor (no si se hizo clic en otra parte).
    devolverFoco.current = document.activeElement?.tagName === 'INPUT'
    setEditando(false)
  }

  if (editando) {
    return (
      <EditorNombre
        nombre={nombre}
        onCancelar={terminar}
        onGuardar={async (nuevo) => {
          await onRenombrar(nuevo)
          terminar()
        }}
      />
    )
  }

  return (
    <div className="flex min-w-0 items-center gap-1">
      <h2 className="font-jakarta text-22 font-extrabold text-bunting">
        {nombre}
      </h2>
      <BotonLapiz
        ref={lapiz}
        nombre={nombre}
        onClick={() => setEditando(true)}
      />
    </div>
  )
}

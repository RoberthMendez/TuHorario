import ResaltadoTitulo from './ResaltadoTitulo'

export default function Titulo() {
  return (
    // En móvil el título (≈590 unidades de ancho) se ajusta al ancho de la pantalla.
    <h1 className="font-bricolage text-titulo font-extrabold whitespace-nowrap text-madison [--u:min(1px,calc((100vw_-_3rem)/590))] escritorio:[--u:inherit]">
      <span className="block">Bienvenido</span>
      <span className="mt-[calc(var(--u)*-16.667)] flex items-center">
        a&nbsp;<span className="text-cerulean">Tu</span>
        <ResaltadoTitulo texto="Horario" />
      </span>
    </h1>
  )
}

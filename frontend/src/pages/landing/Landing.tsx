import { useNavigate } from 'react-router-dom'
import iconoFlecha from '../../assets/icono-flecha.svg'
import Boton from '../../components/Boton'
import FondoCuadricula from '../../components/FondoCuadricula'
import Logo from '../../components/Logo'
import Beneficios from './beneficios/Beneficios'
import Descripcion from './Descripcion'
import HeroHorario from './heroHorario/HeroHorario'
import Titulo from './titulo/Titulo'

/*
 * Escritorio: el lienzo de 1440×900 (unidades de diseño) se escala con `--u`
 * para caber completo en la ventana, sin scroll, con cualquier zoom.
 * Móvil/tablet vertical: columnas apiladas con scroll normal.
 */
export default function Landing() {
  const navegar = useNavigate()

  return (
    <div className="relative min-h-dvh overflow-hidden bg-zumthor escritorio:flex escritorio:h-dvh escritorio:items-center escritorio:justify-center escritorio:[--u:min(100vw/1440,100dvh/900,1.5px)]">
      <FondoCuadricula />
      <div className="relative mx-auto flex max-w-197 flex-col px-6 py-10 escritorio:mx-0 escritorio:block escritorio:h-225 escritorio:w-360 escritorio:max-w-none escritorio:shrink-0 escritorio:px-0 escritorio:py-0 escritorio:pt-19 escritorio:pl-18">
        <Logo />
        <main className="mt-10 flex flex-col gap-14 escritorio:mt-15.5 escritorio:flex-row escritorio:gap-0">
          <section className="escritorio:w-157 escritorio:shrink-0 escritorio:pt-2">
            <Titulo />
            <Descripcion />
            <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8 escritorio:mt-10">
              <Boton
                texto="Comenzar"
                icono={iconoFlecha}
                onClick={() => navegar('/preferencias')}
              />
              <Beneficios />
            </div>
          </section>
          <HeroHorario />
        </main>
      </div>
    </div>
  )
}

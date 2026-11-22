import type { CSSProperties } from 'react'

// Los 46 trazos de la ilustración, exportados de Figma (v0.svg … v45.svg).
const archivos = import.meta.glob<string>(
  '../../../../assets/cercania/alejandro/*.svg',
  { eager: true, import: 'default' },
)
const trazo = (n: number) =>
  archivos[`../../../../assets/cercania/alejandro/v${n}.svg`]

/*
 * Geometría copiada de Figma. `caja`: posición (inset en %) dentro del marco
 * de la sección (950 × 120). `marco`: margen del SVG respecto a su caja.
 * `giro`: trazos rotados (tamaño con unidades de contenedor, como en Figma).
 */
interface Trazo {
  n: number
  caja: string
  marco?: string
  giro?: { alto: string; ancho: string; grados: number }
}

const G12 = 12
const TRAZOS: Trazo[] = [
  { n: 0, caja: '89.34% 86.41% 7% 7.42%' },
  { n: 1, caja: '33.39% 93.45% 66.61% 4.44%', marco: '-0.68px -3.41%' },
  { n: 2, caja: '45.6% 94.33% 54.4% 3.72%', marco: '-0.68px -3.68%' },
  { n: 3, caja: '57.81% 93.81% 42.19% 4.59%', marco: '-0.68px -4.52%' },
  { n: 4, caja: '63.1% 90.47% 23.88% 6.91%', marco: '-26.25% -16.47%' },
  { n: 5, caja: '63.1% 90.47% 23.88% 6.91%', marco: '-16.25% -10.2%' },
  {
    n: 6,
    caja: '69.2% 92.67% 13% 5.75%',
    marco: '-8.89% -4%',
    giro: {
      alto: 'hypot(-55.2846cqw, -14.0736cqh)',
      ancho: 'hypot(-44.7154cqw, 85.9264cqh)',
      grados: 110,
    },
  },
  {
    n: 7,
    caja: '69.06% 93.35% 14.95% 5.71%',
    marco: '-24% -3%',
    giro: {
      alto: 'hypot(-25.5639cqw, -4.35164cqh)',
      ancho: 'hypot(-74.4361cqw, 95.6484cqh)',
      grados: 110,
    },
  },
  {
    n: 8,
    caja: '63.1% 88.57% 17.78% 9.68%',
    marco: '-17.88% -24.71% -17.87% -24.71%',
  },
  {
    n: 9,
    caja: '63.1% 88.57% 17.78% 9.68%',
    marco: '-11.07% -15.29% -11.06% -15.3%',
  },
  { n: 6, caja: '81% 87.34% 11.68% 10.61%', marco: '-8.89% -4%' },
  { n: 10, caja: '86.7% 87.34% 11.27% 10.61%', marco: '-24% -3%' },
  { n: 11, caja: '81.81% 88.37% 15.75% 11.12%', marco: '-13.33% -8%' },
  { n: 12, caja: '33.39% 89.29% 60.1% 9.99%', marco: '-7.5% -8.57%' },
  {
    n: 13,
    caja: '35.82% 88.31% 33.65% 8.23%',
    marco: '-2.46% -2.91%',
    giro: {
      alto: 'hypot(-20.0769cqw, 84.7561cqh)',
      ancho: 'hypot(79.9231cqw, 15.2439cqh)',
      grados: G12,
    },
  },
  {
    n: 14,
    caja: '39.16% 88.41% 56.96% 10.36%',
    marco: '-25.19% -5.11%',
    giro: {
      alto: 'hypot(-4.1316cqw, 48.8198cqh)',
      ancho: 'hypot(95.8684cqw, 51.1802cqh)',
      grados: G12,
    },
  },
  {
    n: 15,
    caja: '30.22% 91.39% 58.53% 8.02%',
    marco: '-4.44% -20%',
    giro: {
      alto: 'hypot(-48.8884cqw, 95.4896cqh)',
      ancho: 'hypot(51.1116cqw, 4.51043cqh)',
      grados: G12,
    },
  },
  {
    n: 16,
    caja: '29.22% 90.99% 57.93% 8.37%',
    marco: '-3.87% -20%',
    giro: {
      alto: 'hypot(-52.3403cqw, 96.0486cqh)',
      ancho: 'hypot(47.6597cqw, 3.95144cqh)',
      grados: G12,
    },
  },
  {
    n: 17,
    caja: '31.8% 90.7% 57.34% 8.73%',
    marco: '-4.62% -20%',
    giro: {
      alto: 'hypot(-47.9459cqw, 95.3242cqh)',
      ancho: 'hypot(52.0541cqw, 4.6758cqh)',
      grados: G12,
    },
  },
  {
    n: 18,
    caja: '35.77% 90.74% 38.47% 7.27%',
    marco: '-2.71% -5.93%',
    giro: {
      alto: 'hypot(-31.7162cqw, 91.1351cqh)',
      ancho: 'hypot(68.2838cqw, 8.86486cqh)',
      grados: G12,
    },
  },
  {
    n: 19,
    caja: '55.27% 91.27% 38.47% 7.27%',
    marco: '-12% -4.44%',
    giro: {
      alto: 'hypot(-7.29794cqw, 63.5363cqh)',
      ancho: 'hypot(92.7021cqw, 36.4637cqh)',
      grados: G12,
    },
  },
  {
    n: 20,
    caja: '35.73% 90.74% 53.99% 7.66%',
    marco: '-8% -5.84%',
    giro: {
      alto: 'hypot(-13.4276cqw, 77.4418cqh)',
      ancho: 'hypot(86.5724cqw, 22.5582cqh)',
      grados: G12,
    },
  },
  {
    n: 21,
    caja: '41% 92.1% 54.43% 7.44%',
    marco: '-10% -14.29%',
    giro: {
      alto: 'hypot(-23.2924cqw, 87.0481cqh)',
      ancho: 'hypot(76.7076cqw, 12.9519cqh)',
      grados: G12,
    },
  },
  {
    n: 22,
    caja: '47.73% 91.31% 41.68% 7.59%',
    marco: '-6.96% -9.41%',
    giro: {
      alto: 'hypot(-22.3347cqw, 86.4224cqh)',
      ancho: 'hypot(77.6653cqw, 13.5776cqh)',
      grados: G12,
    },
  },
  {
    n: 23,
    caja: '50.46% 91.57% 48.78% 7.98%',
    marco: '-0.39px -8.89%',
    giro: {
      alto: 'hypot(-4.83684cqw, 107.056cqh)',
      ancho: 'hypot(100cqw, 100cqh)',
      grados: G12,
    },
  },
  {
    n: 24,
    caja: '34.67% 91.25% 62.48% 8.24%',
    marco: '-22.86% -13.33%',
    giro: {
      alto: 'hypot(-11.0313cqw, 73.2932cqh)',
      ancho: 'hypot(88.9687cqw, 26.7068cqh)',
      grados: G12,
    },
  },
  {
    n: 25,
    caja: '39.56% 90.11% 40.11% 8.65%',
    marco: '-7.5% -24.92%',
    giro: {
      alto: 'hypot(-41.3924cqw, 93.9875cqh)',
      ancho: 'hypot(58.6076cqw, 6.01248cqh)',
      grados: G12,
    },
  },
  {
    n: 26,
    caja: '39.56% 90.11% 40.11% 8.65%',
    marco: '-3.33% -11.08%',
    giro: {
      alto: 'hypot(-41.3924cqw, 93.9875cqh)',
      ancho: 'hypot(58.6076cqw, 6.01248cqh)',
      grados: G12,
    },
  },
  { n: 27, caja: '43.16% 87.31% 46.26% 10.63%', marco: '-23.08% -15%' },
  { n: 28, caja: '43.16% 87.31% 46.26% 10.63%', marco: '-10.77% -7%' },
  { n: 29, caja: '43.16% 89.03% 51.55% 10.63%', marco: '-55.4% -110.79%' },
  { n: 30, caja: '43.16% 89.03% 51.55% 10.63%', marco: '-33.85% -67.71%' },
  { n: 31, caja: '44.99% 86.88% 49.31% 12.4%', marco: '-11.43%' },
  { n: 32, caja: '11.01% 87.7% 61.67% 8.76%', marco: '-2.38% -2.32%' },
  { n: 33, caja: '19.96% 90.42% 69.46% 8.76%', marco: '-4.62% -7.5%' },
  { n: 34, caja: '24.03% 90.01% 71.08% 9.37%', marco: '-10%' },
  { n: 35, caja: '33.6% 88.2% 63.96% 11.52%', marco: '-16.67% -18.18%' },
  { n: 36, caja: '26.48% 88.83% 73.52% 10.01%', marco: '-0.59px -5.33%' },
  { n: 37, caja: '23.83% 88.31% 70.88% 11.17%', marco: '-9.23% -12%' },
  { n: 38, caja: '25.76% 88.38% 72.41% 11.39%' },
  { n: 39, caja: '22% 88.42% 76.37% 10.97%', marco: '-35.01% -11.67%' },
  { n: 40, caja: '7.35% 88.21% 79.22% 8.7%', marco: '-4.85% -2.66%' },
  {
    n: 41,
    caja: '7.76% 89.7% 80.04% 10.13%',
    marco: '-3.33% -31.26% -3.33% -31.25%',
  },
  { n: 42, caja: '6.33% 89.57% 91.63% 10.17%', marco: '-20%' },
  { n: 43, caja: '16.87% 86.93% 78.2% 11.22%', marco: '-13.22% -4.44%' },
  { n: 44, caja: '8.98% 91.55% 84.1% 8.04%', marco: '-5.88% -12.5%' },
  { n: 45, caja: '10.61% 87.13% 85.33% 12.66%', marco: '-10% -25%' },
]

function Svg({ t }: { t: Trazo }) {
  const marco: CSSProperties = { position: 'absolute', inset: t.marco ?? 0 }
  return (
    <span className="relative block size-full">
      <span style={marco}>
        <img src={trazo(t.n)} alt="" className="block size-full max-w-none" />
      </span>
    </span>
  )
}

// Alejandro caminando (ilustración de la sección "Cercanía entre salones").
export default function IlustracionAlejandro() {
  return (
    <div
      aria-hidden
      className="relative h-26 w-23.5 shrink-0 overflow-clip [overflow-clip-margin:calc(var(--u)*8)]"
    >
      {/* Marco de 950 × 120 de Figma, desplazado para que el grupo quede en la
          caja. Se recorta (con un margen para no cortar trazos del borde)
          porque su parte transparente creaba un scroll horizontal vacío. */}
      <div className="absolute top-[calc(var(--u)*-7.6)] left-[calc(var(--u)*-35.34)] h-30 w-237.5">
        {TRAZOS.map((t, i) =>
          t.giro ? (
            <div
              key={i}
              className="absolute flex items-center justify-center"
              style={{ inset: t.caja, containerType: 'size' }}
            >
              <div
                style={{
                  flex: 'none',
                  height: t.giro.alto,
                  width: t.giro.ancho,
                  rotate: `${t.giro.grados}deg`,
                }}
              >
                <Svg t={t} />
              </div>
            </div>
          ) : (
            <div key={i} className="absolute" style={{ inset: t.caja }}>
              <Svg t={t} />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

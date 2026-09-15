import { useMemo, useState } from 'react'
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppData } from '../../context/AppDataContext'
import { KpiCard } from '../../components/ui/KpiCard'
import { format, parseISO } from 'date-fns'

type Rango = 7 | 30 | 90 | 365

const OPCIONES_RANGO: { valor: Rango; label: string }[] = [
  { valor: 7, label: '7 días' },
  { valor: 30, label: '30 días' },
  { valor: 90, label: '3 meses' },
  { valor: 365, label: '1 año' },
]

const COLORES_DISPOSITIVO = ['#c9a227', '#e4c968', '#4f7a5c']
const COLORES_FUENTE = ['#c9a227', '#e4c968', '#b5822a', '#4f7a5c', '#a34a3f']

export default function Analitica() {
  const { analitica } = useAppData()
  const [rango, setRango] = useState<Rango>(30)

  const datos = useMemo(() => analitica.slice(-Math.min(rango, analitica.length)), [analitica, rango])

  const totales = useMemo(() => {
    const visitantes = datos.reduce((acc, d) => acc + d.visitantes, 0)
    const unicos = datos.reduce((acc, d) => acc + d.usuariosUnicos, 0)
    const paginas = datos.reduce((acc, d) => acc + d.paginasVistas, 0)
    const reservas = datos.reduce((acc, d) => acc + d.reservas, 0)
    const conversion = visitantes > 0 ? (reservas / visitantes) * 100 : 0
    const hoy = datos.at(-1)?.visitantes ?? 0
    return { visitantes, unicos, paginas, reservas, conversion, hoy }
  }, [datos])

  const dispositivo = datos.at(-1)?.dispositivo ?? { movil: 0, desktop: 0, tablet: 0 }
  const fuente = datos.at(-1)?.fuente ?? { google: 0, instagram: 0, facebook: 0, directo: 0, whatsapp: 0 }

  const dataDispositivo = [
    { name: 'Móvil', value: dispositivo.movil },
    { name: 'Desktop', value: dispositivo.desktop },
    { name: 'Tablet', value: dispositivo.tablet },
  ]
  const dataFuente = [
    { name: 'Google', value: fuente.google },
    { name: 'Instagram', value: fuente.instagram },
    { name: 'Facebook', value: fuente.facebook },
    { name: 'Directo', value: fuente.directo },
    { name: 'WhatsApp', value: fuente.whatsapp },
  ]

  const serie = datos.map((d) => ({ dia: format(parseISO(d.fecha), 'd MMM'), visitas: d.visitantes, reservas: d.reservas }))

  return (
    <div className="space-y-6">
      <p className="text-xs text-cream-dim/60">
        Métricas ilustrativas para esta demo — se conectan a Google Analytics / Meta Pixel reales en producción.
      </p>

      <div className="flex gap-1 rounded-sm border border-carbon-line p-1 w-fit">
        {OPCIONES_RANGO.map((o) => (
          <button
            key={o.valor}
            onClick={() => setRango(o.valor)}
            className={`rounded-sm px-3.5 py-1.5 text-sm transition-colors ${
              rango === o.valor ? 'bg-gold text-ink' : 'text-cream-dim hover:text-paper'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard etiqueta="Visitantes hoy" valor={totales.hoy} />
        <KpiCard etiqueta={`Visitantes (${rango}d)`} valor={totales.visitantes} />
        <KpiCard etiqueta="Usuarios únicos" valor={totales.unicos} />
        <KpiCard etiqueta="Páginas vistas" valor={totales.paginas} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard etiqueta="Reservas generadas" valor={totales.reservas} />
        <KpiCard etiqueta="Conversión visita → reserva" valor={`${totales.conversion.toFixed(1)}%`} />
        <KpiCard etiqueta="Duración promedio" valor="2m 40s" />
        <KpiCard etiqueta="Visitas totales del periodo" valor={totales.visitantes} />
      </div>

      <div className="rounded-sm border border-carbon-line bg-carbon p-5">
        <p className="mb-4 text-sm text-cream-dim">Visitas al sitio y reservas generadas</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={serie}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2f2a22" vertical={false} />
            <XAxis dataKey="dia" stroke="#b7ae9b" fontSize={11} tickLine={false} axisLine={false} minTickGap={24} />
            <YAxis stroke="#b7ae9b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: '#1e1a15', border: '1px solid #2f2a22', borderRadius: 4, fontSize: 12 }} labelStyle={{ color: '#f6f2e8' }} />
            <Line type="monotone" dataKey="visitas" stroke="#c9a227" strokeWidth={2} dot={false} name="Visitas" />
            <Line type="monotone" dataKey="reservas" stroke="#4f7a5c" strokeWidth={2} dot={false} name="Reservas" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-sm border border-carbon-line bg-carbon p-5">
          <p className="mb-4 text-sm text-cream-dim">Visitas por dispositivo</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={dataDispositivo} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {dataDispositivo.map((_, i) => (
                  <Cell key={i} fill={COLORES_DISPOSITIVO[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e1a15', border: '1px solid #2f2a22', borderRadius: 4, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-cream-dim">
            {dataDispositivo.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORES_DISPOSITIVO[i] }} /> {d.name} {d.value}%
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-sm border border-carbon-line bg-carbon p-5">
          <p className="mb-4 text-sm text-cream-dim">Fuente de tráfico</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={dataFuente} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {dataFuente.map((_, i) => (
                  <Cell key={i} fill={COLORES_FUENTE[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e1a15', border: '1px solid #2f2a22', borderRadius: 4, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-cream-dim">
            {dataFuente.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORES_FUENTE[i] }} /> {d.name} {d.value}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

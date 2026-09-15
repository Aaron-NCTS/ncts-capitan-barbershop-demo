import { CalendarClock, CircleDollarSign, Users2, Wallet } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppData } from '../../context/AppDataContext'
import { KpiCard } from '../../components/ui/KpiCard'
import { EstadoBadge } from '../../components/ui/Badge'
import { dashboardKpis } from '../../lib/metrics'
import { formatoMoneda } from '../../lib/utils'
import { format, subDays } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Dashboard() {
  const { citas, clientes, servicios, barberos } = useAppData()
  const kpis = dashboardKpis(citas, clientes)

  const serieCitas = Array.from({ length: 14 }).map((_, i) => {
    const fecha = format(subDays(new Date(), 13 - i), 'yyyy-MM-dd')
    const del = citas.filter((c) => c.fecha === fecha)
    return {
      dia: format(subDays(new Date(), 13 - i), 'd MMM', { locale: es }),
      citas: del.length,
      ingresos: del.reduce((acc, c) => acc + (c.pago.estado === 'pagado' ? c.pago.montoAnticipo : 0), 0),
    }
  })

  const proximasCitas = citas
    .filter((c) => c.estado === 'confirmada' || c.estado === 'pendiente')
    .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))
    .slice(0, 6)

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard etiqueta="Citas hoy" valor={kpis.citasHoy} icono={<CalendarClock size={18} />} />
        <KpiCard
          etiqueta="Citas esta semana"
          valor={kpis.citasSemana}
          variacion={kpis.variacionCitasSemana}
          comparadoCon="vs semana anterior"
          icono={<CalendarClock size={18} />}
        />
        <KpiCard
          etiqueta="Ingresos del mes"
          valor={formatoMoneda(kpis.ingresos)}
          variacion={kpis.variacionIngresos}
          comparadoCon="vs mes anterior"
          icono={<CircleDollarSign size={18} />}
        />
        <KpiCard etiqueta="Saldo pendiente" valor={formatoMoneda(kpis.saldoPendiente)} icono={<Wallet size={18} />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard etiqueta="Anticipos cobrados (mes)" valor={formatoMoneda(kpis.anticipos)} />
        <KpiCard etiqueta="Clientes nuevos (mes)" valor={kpis.clientesNuevos} icono={<Users2 size={18} />} />
        <KpiCard etiqueta="Clientes recurrentes" valor={kpis.clientesRecurrentes} />
        <KpiCard etiqueta="Cancelaciones / No-shows" valor={`${kpis.cancelaciones} / ${kpis.noShows}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-sm border border-carbon-line bg-carbon p-5">
          <p className="mb-4 text-sm text-cream-dim">Citas por día · últimos 14 días</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={serieCitas}>
              <defs>
                <linearGradient id="colorCitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a227" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#c9a227" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2f2a22" vertical={false} />
              <XAxis dataKey="dia" stroke="#b7ae9b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#b7ae9b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#1e1a15', border: '1px solid #2f2a22', borderRadius: 4, fontSize: 12 }}
                labelStyle={{ color: '#f6f2e8' }}
              />
              <Area type="monotone" dataKey="citas" stroke="#c9a227" fill="url(#colorCitas)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-sm border border-carbon-line bg-carbon p-5">
          <p className="mb-4 text-sm text-cream-dim">Ingresos por anticipos · últimos 14 días</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={serieCitas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2f2a22" vertical={false} />
              <XAxis dataKey="dia" stroke="#b7ae9b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#b7ae9b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e1a15', border: '1px solid #2f2a22', borderRadius: 4, fontSize: 12 }}
                labelStyle={{ color: '#f6f2e8' }}
                formatter={(v) => formatoMoneda(Number(Array.isArray(v) ? v[0] : v) || 0)}
              />
              <Bar dataKey="ingresos" fill="#c9a227" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-sm border border-carbon-line bg-carbon p-5">
        <p className="mb-4 text-sm text-cream-dim">Próximas citas</p>
        <div className="overflow-x-auto thin-scroll">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-carbon-line text-xs uppercase tracking-wide text-cream-dim/60">
                <th className="pb-2 pr-4">Cliente</th>
                <th className="pb-2 pr-4">Servicio</th>
                <th className="pb-2 pr-4">Barbero</th>
                <th className="pb-2 pr-4">Fecha</th>
                <th className="pb-2 pr-4">Hora</th>
                <th className="pb-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {proximasCitas.map((c) => {
                const cliente = clientes.find((cl) => cl.id === c.clienteId)
                const servicio = servicios.find((s) => s.id === c.servicioId)
                const barbero = barberos.find((b) => b.id === c.barberoAsignadoId)
                return (
                  <tr key={c.id} className="border-b border-carbon-line/60 last:border-0">
                    <td className="py-2.5 pr-4 text-paper">{cliente ? `${cliente.nombre} ${cliente.apellidos}` : '—'}</td>
                    <td className="py-2.5 pr-4 text-cream-dim">{servicio?.nombre ?? '—'}</td>
                    <td className="py-2.5 pr-4 text-cream-dim">{barbero?.nombre ?? '—'}</td>
                    <td className="py-2.5 pr-4 text-cream-dim">{c.fecha}</td>
                    <td className="py-2.5 pr-4 text-cream-dim">{c.hora}</td>
                    <td className="py-2.5">
                      <EstadoBadge estado={c.estado} />
                    </td>
                  </tr>
                )
              })}
              {proximasCitas.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-cream-dim/60">
                    No hay próximas citas. Reserva una desde el sitio público para verla aquí.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

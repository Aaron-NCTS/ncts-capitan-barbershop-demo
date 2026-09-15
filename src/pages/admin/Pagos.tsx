import { useMemo } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { KpiCard } from '../../components/ui/KpiCard'
import { EstadoBadge } from '../../components/ui/Badge'
import { formatoFechaCorta, formatoMoneda } from '../../lib/utils'

export default function Pagos() {
  const { citas, clientes, servicios } = useAppData()

  const resumen = useMemo(() => {
    const ingresos = citas.filter((c) => c.pago.estado === 'pagado').reduce((acc, c) => acc + c.pago.montoAnticipo, 0)
    const pendiente = citas
      .filter((c) => c.estado !== 'cancelada' && c.estado !== 'no_asistio')
      .reduce((acc, c) => acc + c.pago.montoPendiente, 0)
    const reembolsos = citas.filter((c) => c.pago.estado === 'reembolsado').reduce((acc, c) => acc + c.pago.montoAnticipo, 0)
    return { ingresos, pendiente, reembolsos, anticiposPendientes: citas.filter((c) => c.pago.estado === 'pendiente').length }
  }, [citas])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard etiqueta="Ingresos por anticipos" valor={formatoMoneda(resumen.ingresos)} />
        <KpiCard etiqueta="Pagos pendientes (anticipo)" valor={resumen.anticiposPendientes} />
        <KpiCard etiqueta="Saldo pendiente en tienda" valor={formatoMoneda(resumen.pendiente)} />
        <KpiCard etiqueta="Reembolsos" valor={formatoMoneda(resumen.reembolsos)} />
      </div>

      <div className="overflow-x-auto rounded-sm border border-carbon-line bg-carbon thin-scroll">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-carbon-line text-xs uppercase tracking-wide text-cream-dim/60">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Anticipo</th>
              <th className="px-4 py-3">Pendiente</th>
              <th className="px-4 py-3">Método</th>
              <th className="px-4 py-3">Estado de pago</th>
              <th className="px-4 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {citas
              .slice()
              .sort((a, b) => b.creadaEn.localeCompare(a.creadaEn))
              .map((c) => {
                const cliente = clientes.find((cl) => cl.id === c.clienteId)
                const servicio = servicios.find((s) => s.id === c.servicioId)
                return (
                  <tr key={c.id} className="border-b border-carbon-line/60 last:border-0">
                    <td className="px-4 py-3 text-paper">{cliente ? `${cliente.nombre} ${cliente.apellidos}` : '—'}</td>
                    <td className="px-4 py-3 text-cream-dim">{servicio?.nombre}</td>
                    <td className="px-4 py-3 text-paper">{formatoMoneda(c.pago.montoTotal)}</td>
                    <td className="px-4 py-3 text-gold">{formatoMoneda(c.pago.montoAnticipo)}</td>
                    <td className="px-4 py-3 text-cream-dim">{formatoMoneda(c.pago.montoPendiente)}</td>
                    <td className="px-4 py-3 capitalize text-cream-dim">{c.pago.metodo.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <EstadoBadge estado={c.pago.estado === 'pagado' ? 'confirmada' : c.pago.estado === 'reembolsado' ? 'cancelada' : 'pendiente'} />
                    </td>
                    <td className="px-4 py-3 text-cream-dim">{formatoFechaCorta(c.fecha)}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

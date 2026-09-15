import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { Modal } from '../../components/ui/Modal'
import { EstadoBadge } from '../../components/ui/Badge'
import { formatoFechaCorta, formatoMoneda, iniciales } from '../../lib/utils'
import { useToast } from '../../components/ui/Toast'
import type { Cliente } from '../../types'

export default function Clientes() {
  const { clientes, citas, servicios, barberos } = useAppData()
  const { mostrarToast } = useToast()
  const [busqueda, setBusqueda] = useState('')
  const [clienteAbierto, setClienteAbierto] = useState<Cliente | null>(null)

  const filas = useMemo(() => {
    return clientes.map((cliente) => {
      const citasCliente = citas.filter((c) => c.clienteId === cliente.id)
      const completadas = citasCliente.filter((c) => c.estado === 'completada')
      const totalGastado = completadas.reduce((acc, c) => acc + c.pago.montoTotal, 0)
      const ultima = citasCliente.slice().sort((a, b) => b.fecha.localeCompare(a.fecha))[0]
      const proxima = citasCliente
        .filter((c) => (c.estado === 'confirmada' || c.estado === 'pendiente'))
        .sort((a, b) => a.fecha.localeCompare(b.fecha))[0]

      const conteoServicio = new Map<string, number>()
      const conteoBarbero = new Map<string, number>()
      citasCliente.forEach((c) => {
        conteoServicio.set(c.servicioId, (conteoServicio.get(c.servicioId) ?? 0) + 1)
        conteoBarbero.set(c.barberoAsignadoId, (conteoBarbero.get(c.barberoAsignadoId) ?? 0) + 1)
      })
      const favoritoId = Array.from(conteoServicio.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]
      const barberoHabitualId = Array.from(conteoBarbero.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]

      return {
        cliente,
        citasCliente,
        visitas: citasCliente.length,
        totalGastado,
        ultima,
        proxima,
        servicioFavorito: servicios.find((s) => s.id === favoritoId)?.nombre ?? '—',
        barberoHabitual: barberos.find((b) => b.id === barberoHabitualId)?.nombre ?? '—',
      }
    })
  }, [clientes, citas, servicios, barberos])

  const filtrados = filas.filter((f) => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return true
    return (
      `${f.cliente.nombre} ${f.cliente.apellidos}`.toLowerCase().includes(q) ||
      f.cliente.correo.toLowerCase().includes(q) ||
      f.cliente.telefono.includes(q)
    )
  })

  const filaAbierta = filas.find((f) => f.cliente.id === clienteAbierto?.id)

  return (
    <div className="space-y-5">
      <div className="relative max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim/60" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cliente por nombre, correo o teléfono"
          className="w-full rounded-sm border border-carbon-line bg-carbon py-2.5 pl-9 pr-3 text-sm text-paper outline-none focus:border-gold"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((f) => (
          <button
            key={f.cliente.id}
            onClick={() => setClienteAbierto(f.cliente)}
            className="rounded-sm border border-carbon-line bg-carbon p-4 text-left transition-colors hover:border-gold/50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 font-display text-gold">
                {iniciales(f.cliente.nombre, f.cliente.apellidos)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-paper">
                  {f.cliente.nombre} {f.cliente.apellidos}
                </p>
                <p className="truncate text-xs text-cream-dim/70">{f.cliente.correo}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-cream-dim">
              <span>{f.visitas} visita{f.visitas !== 1 ? 's' : ''}</span>
              <span className="text-gold">{formatoMoneda(f.totalGastado)}</span>
            </div>
          </button>
        ))}
        {filtrados.length === 0 && <p className="col-span-full py-8 text-center text-cream-dim/60">Sin resultados.</p>}
      </div>

      <Modal
        abierto={Boolean(clienteAbierto)}
        titulo={clienteAbierto ? `${clienteAbierto.nombre} ${clienteAbierto.apellidos}` : ''}
        onCerrar={() => setClienteAbierto(null)}
        anchoMax="max-w-xl"
      >
        {filaAbierta && (
          <div className="space-y-5 text-sm">
            <dl className="grid grid-cols-2 gap-y-2">
              <dt className="text-cream-dim">Teléfono</dt>
              <dd className="text-paper">{filaAbierta.cliente.telefono}</dd>
              <dt className="text-cream-dim">WhatsApp</dt>
              <dd className="text-paper">{filaAbierta.cliente.whatsapp}</dd>
              <dt className="text-cream-dim">Correo</dt>
              <dd className="text-paper">{filaAbierta.cliente.correo}</dd>
              <dt className="text-cream-dim">Última visita</dt>
              <dd className="text-paper">{filaAbierta.ultima ? formatoFechaCorta(filaAbierta.ultima.fecha) : '—'}</dd>
              <dt className="text-cream-dim">Próxima cita</dt>
              <dd className="text-paper">{filaAbierta.proxima ? formatoFechaCorta(filaAbierta.proxima.fecha) : 'Sin citas próximas'}</dd>
              <dt className="text-cream-dim">Número de visitas</dt>
              <dd className="text-paper">{filaAbierta.visitas}</dd>
              <dt className="text-cream-dim">Total gastado</dt>
              <dd className="text-gold">{formatoMoneda(filaAbierta.totalGastado)}</dd>
              <dt className="text-cream-dim">Servicio favorito</dt>
              <dd className="text-paper">{filaAbierta.servicioFavorito}</dd>
              <dt className="text-cream-dim">Barbero habitual</dt>
              <dd className="text-paper">{filaAbierta.barberoHabitual}</dd>
            </dl>

            {filaAbierta.cliente.notas && (
              <div className="border-t border-carbon-line pt-3">
                <p className="text-xs text-cream-dim">Notas</p>
                <p className="mt-1 text-paper">{filaAbierta.cliente.notas}</p>
              </div>
            )}

            <div className="border-t border-carbon-line pt-3">
              <p className="mb-2 text-xs uppercase tracking-wide text-cream-dim/60">Historial de citas y pagos</p>
              <ul className="max-h-52 space-y-2 overflow-y-auto thin-scroll">
                {filaAbierta.citasCliente
                  .slice()
                  .sort((a, b) => b.fecha.localeCompare(a.fecha))
                  .map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-sm border border-carbon-line px-3 py-2">
                      <div>
                        <p className="text-paper">{servicios.find((s) => s.id === c.servicioId)?.nombre}</p>
                        <p className="text-xs text-cream-dim">
                          {formatoFechaCorta(c.fecha)} · {formatoMoneda(c.pago.montoTotal)}
                        </p>
                      </div>
                      <EstadoBadge estado={c.estado} />
                    </li>
                  ))}
                {filaAbierta.citasCliente.length === 0 && <p className="text-cream-dim/60">Sin historial todavía.</p>}
              </ul>
            </div>

            <button
              onClick={() => mostrarToast(`Seguimiento enviado a ${filaAbierta.cliente.nombre}.`, 'exito')}
              className="w-full rounded-sm bg-gold py-2.5 text-sm font-medium text-ink"
            >
              Enviar seguimiento
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}

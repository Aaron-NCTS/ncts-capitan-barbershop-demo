import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { EstadoBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { formatoFechaCorta, formatoMoneda } from '../../lib/utils'
import { useToast } from '../../components/ui/Toast'
import type { Cita, EstadoCita } from '../../types'

type Orden = 'fecha_desc' | 'fecha_asc'

const FILTROS_ESTADO: { valor: EstadoCita | 'todas'; label: string }[] = [
  { valor: 'todas', label: 'Todas' },
  { valor: 'confirmada', label: 'Confirmadas' },
  { valor: 'pendiente', label: 'Pendientes' },
  { valor: 'completada', label: 'Completadas' },
  { valor: 'cancelada', label: 'Canceladas' },
  { valor: 'no_asistio', label: 'No asistió' },
]

export default function Citas() {
  const { citas, clientes, servicios, barberos, actualizarCita } = useAppData()
  const { mostrarToast } = useToast()
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<EstadoCita | 'todas'>('todas')
  const [orden, setOrden] = useState<Orden>('fecha_desc')
  const [citaAbierta, setCitaAbierta] = useState<Cita | null>(null)
  const [nuevaFecha, setNuevaFecha] = useState('')
  const [nuevaHora, setNuevaHora] = useState('')

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    let lista = citas.map((c) => {
      const cliente = clientes.find((cl) => cl.id === c.clienteId)
      const servicio = servicios.find((s) => s.id === c.servicioId)
      const barbero = barberos.find((b) => b.id === c.barberoAsignadoId)
      return { c, cliente, servicio, barbero }
    })

    if (filtroEstado !== 'todas') lista = lista.filter((x) => x.c.estado === filtroEstado)

    if (q) {
      lista = lista.filter(
        (x) =>
          x.c.folio.toLowerCase().includes(q) ||
          `${x.cliente?.nombre} ${x.cliente?.apellidos}`.toLowerCase().includes(q) ||
          x.servicio?.nombre.toLowerCase().includes(q) ||
          x.barbero?.nombre.toLowerCase().includes(q),
      )
    }

    lista.sort((a, b) => {
      const clave = (x: typeof a) => `${x.c.fecha}${x.c.hora}`
      return orden === 'fecha_desc' ? clave(b).localeCompare(clave(a)) : clave(a).localeCompare(clave(b))
    })

    return lista
  }, [citas, clientes, servicios, barberos, busqueda, filtroEstado, orden])

  const abrirDetalle = (cita: Cita) => {
    setCitaAbierta(cita)
    setNuevaFecha(cita.fecha)
    setNuevaHora(cita.hora)
  }

  const cambiarEstado = (estado: EstadoCita) => {
    if (!citaAbierta) return
    actualizarCita(citaAbierta.id, { estado })
    setCitaAbierta({ ...citaAbierta, estado })
    mostrarToast(`Cita marcada como ${estado.replace('_', ' ')}.`, 'exito')
  }

  const reprogramar = () => {
    if (!citaAbierta) return
    actualizarCita(citaAbierta.id, { fecha: nuevaFecha, hora: nuevaHora })
    mostrarToast('Cita reprogramada.', 'exito')
    setCitaAbierta(null)
  }

  const clienteDe = (cita: Cita) => clientes.find((c) => c.id === cita.clienteId)
  const servicioDe = (cita: Cita) => servicios.find((s) => s.id === cita.servicioId)
  const barberoDe = (cita: Cita) => barberos.find((b) => b.id === cita.barberoAsignadoId)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim/60" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por folio, cliente, servicio o barbero"
            className="w-full rounded-sm border border-carbon-line bg-carbon py-2.5 pl-9 pr-3 text-sm text-paper outline-none focus:border-gold"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as EstadoCita | 'todas')}
          className="rounded-sm border border-carbon-line bg-carbon px-3 py-2.5 text-sm text-paper outline-none focus:border-gold"
        >
          {FILTROS_ESTADO.map((f) => (
            <option key={f.valor} value={f.valor}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value as Orden)}
          className="rounded-sm border border-carbon-line bg-carbon px-3 py-2.5 text-sm text-paper outline-none focus:border-gold"
        >
          <option value="fecha_desc">Más recientes primero</option>
          <option value="fecha_asc">Más antiguas primero</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-sm border border-carbon-line bg-carbon thin-scroll">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-carbon-line text-xs uppercase tracking-wide text-cream-dim/60">
              <th className="px-4 py-3">Folio</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Barbero</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Hora</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Anticipo</th>
              <th className="px-4 py-3">Pendiente</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(({ c, cliente, servicio, barbero }) => (
              <tr
                key={c.id}
                onClick={() => abrirDetalle(c)}
                className="cursor-pointer border-b border-carbon-line/60 last:border-0 hover:bg-ink"
              >
                <td className="px-4 py-3 font-mono text-xs text-cream-dim">{c.folio}</td>
                <td className="px-4 py-3 text-paper">{cliente ? `${cliente.nombre} ${cliente.apellidos}` : '—'}</td>
                <td className="px-4 py-3 text-cream-dim">{servicio?.nombre}</td>
                <td className="px-4 py-3 text-cream-dim">{barbero?.nombre}</td>
                <td className="px-4 py-3 text-cream-dim">{formatoFechaCorta(c.fecha)}</td>
                <td className="px-4 py-3 text-cream-dim">{c.hora}</td>
                <td className="px-4 py-3 text-paper">{formatoMoneda(c.pago.montoTotal)}</td>
                <td className="px-4 py-3 text-gold">{formatoMoneda(c.pago.montoAnticipo)}</td>
                <td className="px-4 py-3 text-cream-dim">{formatoMoneda(c.pago.montoPendiente)}</td>
                <td className="px-4 py-3">
                  <EstadoBadge estado={c.estado} />
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-cream-dim/60">
                  No se encontraron citas con estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal abierto={Boolean(citaAbierta)} titulo={`Cita ${citaAbierta?.folio ?? ''}`} onCerrar={() => setCitaAbierta(null)}>
        {citaAbierta && (
          <div className="space-y-5 text-sm">
            <dl className="grid grid-cols-2 gap-y-2">
              <dt className="text-cream-dim">Cliente</dt>
              <dd className="text-paper">
                {clienteDe(citaAbierta)?.nombre} {clienteDe(citaAbierta)?.apellidos}
              </dd>
              <dt className="text-cream-dim">Servicio</dt>
              <dd className="text-paper">{servicioDe(citaAbierta)?.nombre}</dd>
              <dt className="text-cream-dim">Barbero</dt>
              <dd className="text-paper">{barberoDe(citaAbierta)?.nombre}</dd>
              <dt className="text-cream-dim">Total / Anticipo</dt>
              <dd className="text-paper">
                {formatoMoneda(citaAbierta.pago.montoTotal)} / {formatoMoneda(citaAbierta.pago.montoAnticipo)}
              </dd>
              <dt className="text-cream-dim">Estado actual</dt>
              <dd>
                <EstadoBadge estado={citaAbierta.estado} />
              </dd>
            </dl>

            <div className="grid grid-cols-2 gap-3 border-t border-carbon-line pt-4">
              <div>
                <label className="mb-1 block text-xs text-cream-dim">Reprogramar fecha</label>
                <input
                  type="date"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  className="w-full rounded-sm border border-carbon-line bg-ink px-3 py-2 text-paper outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-cream-dim">Nueva hora</label>
                <input
                  type="time"
                  value={nuevaHora}
                  onChange={(e) => setNuevaHora(e.target.value)}
                  className="w-full rounded-sm border border-carbon-line bg-ink px-3 py-2 text-paper outline-none focus:border-gold"
                />
              </div>
              <button
                onClick={reprogramar}
                className="col-span-2 rounded-sm border border-gold py-2 text-sm text-gold hover:bg-gold hover:text-ink"
              >
                Guardar reprogramación
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 border-t border-carbon-line pt-4">
              <button onClick={() => cambiarEstado('confirmada')} className="rounded-sm border border-carbon-line py-2 text-xs text-paper hover:border-gold/50">
                Confirmar
              </button>
              <button onClick={() => cambiarEstado('completada')} className="rounded-sm border border-carbon-line py-2 text-xs text-paper hover:border-gold/50">
                Marcar completada
              </button>
              <button onClick={() => cambiarEstado('no_asistio')} className="rounded-sm border border-carbon-line py-2 text-xs text-paper hover:border-gold/50">
                Marcar no-show
              </button>
              <button onClick={() => cambiarEstado('cancelada')} className="rounded-sm border border-danger/50 py-2 text-xs text-danger hover:bg-danger/10">
                Cancelar cita
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

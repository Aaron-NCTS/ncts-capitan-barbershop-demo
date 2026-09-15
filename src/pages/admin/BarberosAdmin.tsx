import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { Modal } from '../../components/ui/Modal'
import { formatoMoneda } from '../../lib/utils'
import { useToast } from '../../components/ui/Toast'
import type { Barbero, HorarioDia } from '../../types'

const ETIQUETAS_DIA: Record<HorarioDia['dia'], string> = {
  lun: 'Lunes',
  mar: 'Martes',
  mie: 'Miércoles',
  jue: 'Jueves',
  vie: 'Viernes',
  sab: 'Sábado',
  dom: 'Domingo',
}

export default function BarberosAdmin() {
  const { barberos, citas, actualizarBarbero } = useAppData()
  const { mostrarToast } = useToast()
  const [editando, setEditando] = useState<Barbero | null>(null)
  const [horarioLocal, setHorarioLocal] = useState<HorarioDia[]>([])

  const abrirEdicion = (b: Barbero) => {
    setEditando(b)
    setHorarioLocal(b.horario.map((h) => ({ ...h })))
  }

  const guardarHorario = () => {
    if (!editando) return
    actualizarBarbero(editando.id, { horario: horarioLocal })
    mostrarToast(`Horario de ${editando.nombre} actualizado.`, 'exito')
    setEditando(null)
  }

  const metricas = (barberoId: string) => {
    const del = citas.filter((c) => c.barberoAsignadoId === barberoId)
    const ingresos = del.filter((c) => c.estado === 'completada').reduce((acc, c) => acc + c.pago.montoTotal, 0)
    return { total: del.length, ingresos }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {barberos.map((b) => {
        const m = metricas(b.id)
        return (
          <div key={b.id} className="rounded-sm border border-carbon-line bg-carbon p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-xl text-paper">{b.nombre}</p>
                <p className="text-xs text-cream-dim">{b.especialidad}</p>
              </div>
              <label className="flex items-center gap-2 text-xs text-cream-dim">
                <input
                  type="checkbox"
                  checked={b.activo}
                  onChange={(e) => actualizarBarbero(b.id, { activo: e.target.checked })}
                  className="accent-gold"
                />
                Activo
              </label>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-cream-dim">Citas totales</dt>
              <dd className="text-paper">{m.total}</dd>
              <dt className="text-cream-dim">Ingresos generados</dt>
              <dd className="text-gold">{formatoMoneda(m.ingresos)}</dd>
              <dt className="text-cream-dim">Rating</dt>
              <dd className="text-paper">{b.ratingDemostrativo.toFixed(1)} (demostrativo)</dd>
            </dl>

            <button
              onClick={() => abrirEdicion(b)}
              className="mt-4 w-full rounded-sm border border-carbon-line py-2 text-sm text-paper hover:border-gold/50"
            >
              Configurar horario
            </button>
          </div>
        )
      })}

      <Modal abierto={Boolean(editando)} titulo={`Horario · ${editando?.nombre ?? ''}`} onCerrar={() => setEditando(null)}>
        <div className="space-y-2.5">
          {horarioLocal.map((h, idx) => (
            <div key={h.dia} className="flex items-center gap-3 rounded-sm border border-carbon-line px-3 py-2.5">
              <label className="flex w-28 shrink-0 items-center gap-2 text-sm text-paper">
                <input
                  type="checkbox"
                  checked={h.activo}
                  onChange={(e) =>
                    setHorarioLocal((prev) => prev.map((d, i) => (i === idx ? { ...d, activo: e.target.checked } : d)))
                  }
                  className="accent-gold"
                />
                {ETIQUETAS_DIA[h.dia]}
              </label>
              <input
                type="time"
                value={h.inicio}
                disabled={!h.activo}
                onChange={(e) => setHorarioLocal((prev) => prev.map((d, i) => (i === idx ? { ...d, inicio: e.target.value } : d)))}
                className="rounded-sm border border-carbon-line bg-ink px-2 py-1.5 text-sm text-paper outline-none focus:border-gold disabled:opacity-40"
              />
              <span className="text-cream-dim/60">–</span>
              <input
                type="time"
                value={h.fin}
                disabled={!h.activo}
                onChange={(e) => setHorarioLocal((prev) => prev.map((d, i) => (i === idx ? { ...d, fin: e.target.value } : d)))}
                className="rounded-sm border border-carbon-line bg-ink px-2 py-1.5 text-sm text-paper outline-none focus:border-gold disabled:opacity-40"
              />
            </div>
          ))}
          <button onClick={guardarHorario} className="mt-2 w-full rounded-sm bg-gold py-2.5 text-sm font-medium text-ink">
            Guardar horario
          </button>
        </div>
      </Modal>
    </div>
  )
}

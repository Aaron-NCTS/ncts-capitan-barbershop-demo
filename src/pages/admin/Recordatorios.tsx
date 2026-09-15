import { Bell, BellOff } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../../components/ui/Toast'

export default function Recordatorios() {
  const { recordatorios, actualizarRecordatorio } = useAppData()
  const { mostrarToast } = useToast()

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {recordatorios.map((r) => (
        <div key={r.id} className="rounded-sm border border-carbon-line bg-carbon p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {r.activo ? <Bell size={18} className="text-gold" /> : <BellOff size={18} className="text-cream-dim/50" />}
              <p className="font-medium text-paper">{r.nombre}</p>
            </div>
            <button
              role="switch"
              aria-checked={r.activo}
              onClick={() => {
                actualizarRecordatorio(r.id, !r.activo)
                mostrarToast(`${r.nombre} ${!r.activo ? 'activado' : 'desactivado'}.`, 'info')
              }}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${r.activo ? 'bg-gold' : 'bg-carbon-line'}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-transform ${
                  r.activo ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          <p className="mt-3 text-sm text-cream-dim">{r.descripcion}</p>
          <span className={`mt-3 inline-block text-xs font-medium ${r.activo ? 'text-ok' : 'text-cream-dim/50'}`}>
            {r.activo ? 'ACTIVO' : 'INACTIVO'}
          </span>
        </div>
      ))}
    </div>
  )
}

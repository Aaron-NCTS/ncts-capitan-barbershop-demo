import { Clock } from 'lucide-react'
import type { Servicio } from '../../types'
import { formatoMoneda } from '../../lib/utils'

interface Props {
  servicios: Servicio[]
  seleccionadoId?: string
  onSeleccionar: (id: string) => void
}

export function StepService({ servicios, seleccionadoId, onSeleccionar }: Props) {
  return (
    <div>
      <h3 className="font-display text-2xl text-paper">¿Qué servicio quieres reservar?</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {servicios
          .filter((s) => s.activo)
          .map((s) => {
            const activo = seleccionadoId === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSeleccionar(s.id)}
                aria-pressed={activo}
                className={[
                  'rounded-sm border p-4 text-left transition-colors',
                  activo ? 'border-gold bg-gold/10' : 'border-carbon-line bg-ink hover:border-cream-dim/40',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium text-paper">{s.nombre}</span>
                  <span className="whitespace-nowrap font-display text-lg text-gold">{formatoMoneda(s.precio)}</span>
                </div>
                <p className="mt-1.5 text-sm text-cream-dim">{s.descripcion}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-cream-dim/70">
                  <Clock size={13} /> {s.duracionMinutos} min
                </p>
              </button>
            )
          })}
      </div>
    </div>
  )
}

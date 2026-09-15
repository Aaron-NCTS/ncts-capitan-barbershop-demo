import { Star } from 'lucide-react'
import type { Barbero } from '../../types'

interface Props {
  barberos: Barbero[]
  seleccionadoId?: string
  onSeleccionar: (id: string | 'cualquiera') => void
}

export function StepBarber({ barberos, seleccionadoId, onSeleccionar }: Props) {
  return (
    <div>
      <h3 className="font-display text-2xl text-paper">¿Con quién prefieres tu cita?</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSeleccionar('cualquiera')}
          aria-pressed={seleccionadoId === 'cualquiera'}
          className={[
            'rounded-sm border p-4 text-left transition-colors',
            seleccionadoId === 'cualquiera' ? 'border-gold bg-gold/10' : 'border-carbon-line bg-ink hover:border-cream-dim/40',
          ].join(' ')}
        >
          <span className="font-medium text-paper">Cualquier barbero disponible</span>
          <p className="mt-1.5 text-sm text-cream-dim">Te asignamos al primero libre en el horario que elijas.</p>
        </button>

        {barberos
          .filter((b) => b.activo)
          .map((b) => {
            const activo = seleccionadoId === b.id
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onSeleccionar(b.id)}
                aria-pressed={activo}
                className={[
                  'rounded-sm border p-4 text-left transition-colors',
                  activo ? 'border-gold bg-gold/10' : 'border-carbon-line bg-ink hover:border-cream-dim/40',
                ].join(' ')}
              >
                <span className="font-medium text-paper">{b.nombre}</span>
                <p className="mt-1.5 text-sm text-cream-dim">{b.especialidad}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-gold">
                  <Star size={13} fill="currentColor" /> {b.ratingDemostrativo.toFixed(1)}
                </p>
              </button>
            )
          })}
      </div>
    </div>
  )
}

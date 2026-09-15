import type { Barbero } from '../../types'
import { fechaTieneDisponibilidad } from '../../lib/booking'
import { Calendar } from './Calendar'

interface Props {
  barberos: Barbero[]
  barberoId: string | 'cualquiera'
  fechaSeleccionada?: string
  onSeleccionar: (fechaISO: string) => void
}

export function StepDate({ barberos, barberoId, fechaSeleccionada, onSeleccionar }: Props) {
  return (
    <div>
      <h3 className="font-display text-2xl text-paper">Elige una fecha</h3>
      <p className="mt-1.5 text-sm text-cream-dim">Los días sin disponibilidad aparecen bloqueados.</p>
      <div className="mt-6 max-w-sm">
        <Calendar
          fechaSeleccionada={fechaSeleccionada}
          onSeleccionar={onSeleccionar}
          fechaDisponible={(fechaISO) => fechaTieneDisponibilidad(fechaISO, barberos, barberoId)}
        />
      </div>
    </div>
  )
}

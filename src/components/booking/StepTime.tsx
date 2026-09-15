import { formatoFechaLarga } from '../../lib/utils'

interface SlotDisponible {
  hora: string
  barberoAsignadoId: string
}

interface Props {
  fecha: string
  slots: SlotDisponible[]
  horaSeleccionada?: string
  onSeleccionar: (slot: SlotDisponible) => void
}

export function StepTime({ fecha, slots, horaSeleccionada, onSeleccionar }: Props) {
  return (
    <div>
      <h3 className="font-display text-2xl text-paper">Elige un horario</h3>
      <p className="mt-1.5 text-sm capitalize text-cream-dim">{formatoFechaLarga(fecha)}</p>

      {slots.length === 0 ? (
        <div className="mt-6 rounded-sm border border-carbon-line bg-carbon p-6 text-center">
          <p className="text-cream-dim">No quedan horarios disponibles ese día. Elige otra fecha.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {slots.map((slot) => {
            const activo = horaSeleccionada === slot.hora
            return (
              <button
                key={slot.hora}
                type="button"
                onClick={() => onSeleccionar(slot)}
                aria-pressed={activo}
                className={[
                  'rounded-sm border py-2.5 text-sm transition-colors',
                  activo ? 'border-gold bg-gold text-ink font-medium' : 'border-carbon-line bg-ink text-paper hover:border-gold/50',
                ].join(' ')}
              >
                {slot.hora}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

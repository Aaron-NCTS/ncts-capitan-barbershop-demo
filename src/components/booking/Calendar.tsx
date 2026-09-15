import { useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { esFechaPasada } from '../../lib/booking'

interface Props {
  fechaSeleccionada?: string
  onSeleccionar: (fechaISO: string) => void
  fechaDisponible: (fechaISO: string) => boolean
}

export function Calendar({ fechaSeleccionada, onSeleccionar, fechaDisponible }: Props) {
  const [mesActual, setMesActual] = useState(() => startOfMonth(new Date()))

  const inicio = startOfMonth(mesActual)
  const fin = endOfMonth(mesActual)
  const dias = eachDayOfInterval({ start: inicio, end: fin })
  const relleno = getDay(inicio) // 0 = domingo

  const hoy = new Date()

  return (
    <div className="rounded-sm border border-carbon-line bg-carbon p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMesActual((m) => subMonths(m, 1))}
          aria-label="Mes anterior"
          className="rounded-sm p-1.5 text-cream-dim hover:text-gold"
        >
          <ChevronLeft size={20} />
        </button>
        <p className="font-display text-lg capitalize text-paper">{format(mesActual, 'MMMM yyyy', { locale: es })}</p>
        <button
          type="button"
          onClick={() => setMesActual((m) => addMonths(m, 1))}
          aria-label="Mes siguiente"
          className="rounded-sm p-1.5 text-cream-dim hover:text-gold"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-cream-dim/70">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {Array.from({ length: relleno }).map((_, i) => (
          <span key={`relleno-${i}`} />
        ))}
        {dias.map((dia) => {
          const fechaISO = format(dia, 'yyyy-MM-dd')
          const pasada = esFechaPasada(fechaISO)
          const disponible = !pasada && isSameMonth(dia, mesActual) && fechaDisponible(fechaISO)
          const seleccionado = fechaSeleccionada === fechaISO
          const esHoy = isSameDay(dia, hoy)

          return (
            <button
              key={fechaISO}
              type="button"
              disabled={!disponible}
              onClick={() => onSeleccionar(fechaISO)}
              aria-pressed={seleccionado}
              aria-label={format(dia, "d 'de' MMMM", { locale: es })}
              className={[
                'aspect-square rounded-sm text-sm transition-colors',
                seleccionado
                  ? 'bg-gold font-semibold text-ink'
                  : disponible
                    ? 'text-paper hover:bg-carbon-line'
                    : 'cursor-not-allowed text-cream-dim/25 line-through',
                esHoy && !seleccionado ? 'ring-1 ring-inset ring-gold/50' : '',
              ].join(' ')}
            >
              {format(dia, 'd')}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-cream-dim/70">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gold" /> Seleccionado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-cream-dim/40" /> Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-carbon-line" /> No disponible
        </span>
      </div>
    </div>
  )
}

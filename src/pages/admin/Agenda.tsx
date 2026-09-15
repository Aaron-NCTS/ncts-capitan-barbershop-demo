import { useMemo, useState } from 'react'
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { EstadoBadge } from '../../components/ui/Badge'
import { formatoMoneda } from '../../lib/utils'

type Vista = 'dia' | 'semana' | 'mes'

export default function Agenda() {
  const { citas, clientes, servicios, barberos } = useAppData()
  const [vista, setVista] = useState<Vista>('semana')
  const [fechaBase, setFechaBase] = useState(new Date())

  const citasPorFecha = useMemo(() => {
    const mapa = new Map<string, typeof citas>()
    citas.forEach((c) => {
      if (!mapa.has(c.fecha)) mapa.set(c.fecha, [])
      mapa.get(c.fecha)!.push(c)
    })
    return mapa
  }, [citas])

  const irADia = (fecha: Date) => {
    setFechaBase(fecha)
    setVista('dia')
  }

  const avanzar = (dir: 1 | -1) => {
    if (vista === 'dia') setFechaBase((f) => addDays(f, dir))
    if (vista === 'semana') setFechaBase((f) => addDays(f, dir * 7))
    if (vista === 'mes') setFechaBase((f) => addDays(f, dir * 30))
  }

  const diaISO = format(fechaBase, 'yyyy-MM-dd')
  const citasDia = (citasPorFecha.get(diaISO) ?? []).slice().sort((a, b) => a.hora.localeCompare(b.hora))

  const inicioSemana = startOfWeek(fechaBase, { weekStartsOn: 1 })
  const finSemana = endOfWeek(fechaBase, { weekStartsOn: 1 })
  const diasSemana = eachDayOfInterval({ start: inicioSemana, end: finSemana })

  const inicioMes = startOfMonth(fechaBase)
  const finMes = endOfMonth(fechaBase)
  const diasMes = eachDayOfInterval({ start: inicioMes, end: finMes })
  const relleno = (inicioMes.getDay() + 6) % 7 // lunes = 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 rounded-sm border border-carbon-line p-1">
          {(['dia', 'semana', 'mes'] as Vista[]).map((v) => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className={`rounded-sm px-3.5 py-1.5 text-sm capitalize transition-colors ${
                vista === v ? 'bg-gold text-ink' : 'text-cream-dim hover:text-paper'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => avanzar(-1)} aria-label="Anterior" className="rounded-sm border border-carbon-line p-1.5 text-cream-dim hover:text-gold">
            <ChevronLeft size={18} />
          </button>
          <p className="min-w-[10rem] text-center font-display text-lg capitalize text-paper">
            {vista === 'mes' ? format(fechaBase, 'MMMM yyyy', { locale: es }) : format(fechaBase, "d 'de' MMMM yyyy", { locale: es })}
          </p>
          <button onClick={() => avanzar(1)} aria-label="Siguiente" className="rounded-sm border border-carbon-line p-1.5 text-cream-dim hover:text-gold">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {vista === 'dia' && (
        <div className="rounded-sm border border-carbon-line bg-carbon p-5">
          {citasDia.length === 0 ? (
            <p className="py-10 text-center text-cream-dim/60">Sin citas para este día.</p>
          ) : (
            <ul className="divide-y divide-carbon-line">
              {citasDia.map((c) => {
                const cliente = clientes.find((cl) => cl.id === c.clienteId)
                const servicio = servicios.find((s) => s.id === c.servicioId)
                const barbero = barberos.find((b) => b.id === c.barberoAsignadoId)
                return (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                    <div className="flex items-center gap-4">
                      <span className="w-14 font-display text-lg text-gold">{c.hora}</span>
                      <div>
                        <p className="text-paper">{cliente ? `${cliente.nombre} ${cliente.apellidos}` : '—'}</p>
                        <p className="text-xs text-cream-dim">{servicio?.nombre} · {barbero?.nombre}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-cream-dim">{formatoMoneda(c.pago.montoTotal)}</span>
                      <EstadoBadge estado={c.estado} />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {vista === 'semana' && (
        <div className="grid gap-3 sm:grid-cols-7">
          {diasSemana.map((dia) => {
            const iso = format(dia, 'yyyy-MM-dd')
            const del = citasPorFecha.get(iso) ?? []
            return (
              <button
                key={iso}
                onClick={() => irADia(dia)}
                className={`rounded-sm border p-3 text-left transition-colors ${
                  isSameDay(dia, new Date()) ? 'border-gold/60' : 'border-carbon-line'
                } bg-carbon hover:border-gold/50`}
              >
                <p className="text-xs uppercase text-cream-dim/60">{format(dia, 'EEE', { locale: es })}</p>
                <p className="font-display text-xl text-paper">{format(dia, 'd')}</p>
                <p className="mt-2 text-xs text-gold">{del.length} cita{del.length !== 1 ? 's' : ''}</p>
              </button>
            )
          })}
        </div>
      )}

      {vista === 'mes' && (
        <div className="rounded-sm border border-carbon-line bg-carbon p-4">
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-cream-dim/60">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {Array.from({ length: relleno }).map((_, i) => (
              <span key={`r-${i}`} />
            ))}
            {diasMes.map((dia) => {
              const iso = format(dia, 'yyyy-MM-dd')
              const del = citasPorFecha.get(iso) ?? []
              return (
                <button
                  key={iso}
                  onClick={() => irADia(dia)}
                  disabled={!isSameMonth(dia, fechaBase)}
                  className="flex aspect-square flex-col items-center justify-center rounded-sm border border-carbon-line/60 text-sm text-paper hover:border-gold/50 disabled:opacity-30"
                >
                  <span>{format(dia, 'd')}</span>
                  {del.length > 0 && <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-gold" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

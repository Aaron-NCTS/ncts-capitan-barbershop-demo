import { Clock } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { formatoMoneda } from '../../lib/utils'

interface Props {
  onReservar: (servicioId: string) => void
}

export function Services({ onReservar }: Props) {
  const { servicios } = useAppData()
  const activos = servicios.filter((s) => s.activo)
  const destacado = activos.find((s) => s.id === 'srv_corte_barba_facial')
  const resto = activos.filter((s) => s.id !== 'srv_corte_barba_facial')

  return (
    <section id="servicios" className="bg-ink py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl text-paper sm:text-5xl">Servicios</h2>
          <p className="mt-4 text-cream-dim">
            Cada servicio incluye la atención de nuestro equipo de especialistas, sin prisas ni citas encimadas.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {resto.map((s) => (
            <article
              key={s.id}
              className="flex flex-col justify-between rounded-sm border border-carbon-line bg-carbon p-6 transition-colors hover:border-gold/50"
            >
              <div>
                <h3 className="font-display text-2xl text-paper">{s.nombre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim">{s.descripcion}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-cream-dim/80">
                  <Clock size={14} />
                  <span>{s.duracionMinutos} min</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-carbon-line pt-4">
                <span className="font-display text-2xl text-gold">{formatoMoneda(s.precio)}</span>
                <button
                  onClick={() => onReservar(s.id)}
                  className="text-sm font-medium text-paper underline decoration-gold decoration-2 underline-offset-4 hover:text-gold"
                >
                  Reservar
                </button>
              </div>
            </article>
          ))}

          {destacado && (
            <article className="flex flex-col justify-between rounded-sm border border-gold bg-gradient-to-b from-carbon to-ink p-6 lg:col-span-1">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gold">La experiencia completa</p>
                <h3 className="mt-2 font-display text-2xl text-paper">{destacado.nombre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim">{destacado.descripcion}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-cream-dim/80">
                  <Clock size={14} />
                  <span>{destacado.duracionMinutos} min</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-gold/30 pt-4">
                <span className="font-display text-2xl text-gold">{formatoMoneda(destacado.precio)}</span>
                <button
                  onClick={() => onReservar(destacado.id)}
                  className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ink"
                >
                  Reservar
                </button>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}

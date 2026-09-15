import { Star } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'

interface Props {
  onReservarCon: (barberoId: string) => void
}

export function Barbers({ onReservarCon }: Props) {
  const { barberos } = useAppData()

  return (
    <section id="barberos" className="bg-carbon py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl text-paper sm:text-5xl">Conoce a nuestros barberos</h2>
          <p className="mt-4 text-cream-dim">
            Especialistas en corte, barba y afeitado tradicional, listos para tu próxima visita.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {barberos
            .filter((b) => b.activo)
            .map((b) => (
              <article key={b.id} className="rounded-sm border border-carbon-line bg-ink p-6">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gold/40 bg-carbon">
                  <span className="font-display text-3xl text-gold">
                    {b.nombre
                      .split(' ')
                      .map((p) => p.charAt(0))
                      .join('')}
                  </span>
                </div>
                <h3 className="mt-5 text-center font-display text-xl text-paper">{b.nombre}</h3>
                <p className="mt-1 text-center text-sm text-cream-dim">{b.especialidad}</p>
                <p className="mt-1 text-center text-xs text-cream-dim/70">{b.experienciaAnios} años de experiencia</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-gold">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm">{b.ratingDemostrativo.toFixed(1)}</span>
                </div>
                <button
                  onClick={() => onReservarCon(b.id)}
                  className="mt-5 w-full rounded-sm border border-gold py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-ink"
                >
                  Reservar con él
                </button>
              </article>
            ))}
        </div>
      </div>
    </section>
  )
}

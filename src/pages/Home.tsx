import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Hero } from '../components/public/Hero'
import { useAppData } from '../context/AppDataContext'
import { formatoMoneda } from '../lib/utils'

export default function Home() {
  const { servicios } = useAppData()
  const destacados = servicios.filter((s) => s.activo).slice(0, 3)

  return (
    <>
      <Hero />

      <section className="bg-carbon py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-3">
            <Link
              to="/servicios"
              className="group rounded-sm border border-carbon-line bg-ink p-6 transition-colors hover:border-gold/50"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Servicios</p>
              <ul className="mt-3 space-y-1.5 text-sm text-cream-dim">
                {destacados.map((s) => (
                  <li key={s.id} className="flex justify-between">
                    <span>{s.nombre}</span>
                    <span className="text-paper">{formatoMoneda(s.precio)}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-4 flex items-center gap-1.5 text-sm text-paper group-hover:text-gold">
                Ver todos los servicios <ArrowRight size={15} />
              </span>
            </Link>

            <Link
              to="/barberos"
              className="group rounded-sm border border-carbon-line bg-ink p-6 transition-colors hover:border-gold/50"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Equipo</p>
              <p className="mt-3 text-sm text-cream-dim">
                Conoce a los especialistas que se encargan de tu corte, barba y afeitado.
              </p>
              <span className="mt-4 flex items-center gap-1.5 text-sm text-paper group-hover:text-gold">
                Conocer al equipo <ArrowRight size={15} />
              </span>
            </Link>

            <Link
              to="/ubicacion"
              className="group rounded-sm border border-carbon-line bg-ink p-6 transition-colors hover:border-gold/50"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Ubicación</p>
              <p className="mt-3 text-sm text-cream-dim">
                Magisterial Coapa, Tlalpan. Abierto los 7 días de la semana.
              </p>
              <span className="mt-4 flex items-center gap-1.5 text-sm text-paper group-hover:text-gold">
                Ver dirección y horarios <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <h2 className="font-display text-3xl text-paper sm:text-4xl">¿Listo para tu próxima cita?</h2>
          <p className="mt-3 text-cream-dim">Resérvala en menos de un minuto, sin llamadas ni esperas.</p>
          <Link
            to="/reservar"
            className="mt-7 inline-block rounded-sm bg-gold px-8 py-3.5 font-medium text-ink transition-transform hover:scale-[1.02]"
          >
            Reservar cita
          </Link>
        </div>
      </section>
    </>
  )
}

import { Link } from 'react-router-dom'
import { brand } from '../../brand/config'
import { SocialLinks } from './SocialLinks'

const ENLACES = [
  { to: '/servicios', label: 'Servicios' },
  { to: '/barberos', label: 'Barberos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/ubicacion', label: 'Ubicación' },
  { to: '/reservar', label: 'Reservar cita' },
]

export function Footer() {
  return (
    <footer className="border-t border-carbon-line bg-ink py-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-xl text-paper">{brand.nombre}</p>
            <p className="mt-2 max-w-xs text-sm text-cream-dim">{brand.claim}</p>
            <SocialLinks className="mt-4" />
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {ENLACES.map((e) => (
              <Link key={e.to} to={e.to} className="text-sm text-cream-dim transition-colors hover:text-gold">
                {e.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-carbon-line pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-cream-dim/60">{brand.desarrolladoPor}</p>
          <Link to="/admin" className="text-xs text-cream-dim/40 transition-colors hover:text-gold">
            Acceso administrativo
          </Link>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { brand } from '../../brand/config'

export function Footer() {
  return (
    <footer className="border-t border-carbon-line bg-ink py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-display text-lg text-paper">{brand.nombre}</p>
        <p className="text-xs text-cream-dim/60">{brand.desarrolladoPor}</p>
        <Link to="/admin" className="text-xs text-cream-dim/40 transition-colors hover:text-gold">
          Acceso administrativo
        </Link>
      </div>
    </footer>
  )
}

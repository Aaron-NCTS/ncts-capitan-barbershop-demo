import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { brand } from '../../brand/config'
import { SocialLinks } from './SocialLinks'

const ENLACES = [
  { to: '/servicios', label: 'Servicios' },
  { to: '/barberos', label: 'Barberos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/ubicacion', label: 'Ubicación' },
]

export function Header() {
  const [conScroll, setConScroll] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuAbierto])

  const irAReservar = () => {
    setMenuAbierto(false)
    navigate('/reservar')
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        conScroll ? 'bg-ink/90 backdrop-blur border-b border-carbon-line' : 'bg-transparent'
      }`}
    >
      {/* Franja superior: siempre visible, refuerza presencia de marca */}
      <div className="hidden border-b border-carbon-line/60 bg-ink/60 py-1.5 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-5 px-5 sm:px-8">
          <span className="text-xs text-cream-dim/70">{brand.contacto.telefono}</span>
          <SocialLinks tamano={14} />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="font-display text-xl tracking-wide text-paper sm:text-2xl">
          {brand.nombre}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {ENLACES.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              className={({ isActive }) =>
                `text-sm transition-colors hover:text-gold ${isActive ? 'text-gold' : 'text-cream-dim'}`
              }
            >
              {e.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <button
            onClick={irAReservar}
            className="rounded-sm border border-gold px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            Reservar cita
          </button>
        </div>

        <button
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú"
          className="text-paper md:hidden"
        >
          <Menu size={26} />
        </button>
      </div>

      {menuAbierto && (
        <div className="fixed inset-0 z-50 bg-ink md:hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-display text-xl text-paper">{brand.nombre}</span>
            <button onClick={() => setMenuAbierto(false)} aria-label="Cerrar menú" className="text-paper">
              <X size={26} />
            </button>
          </div>
          <nav className="mt-8 flex flex-col items-center gap-7 px-5">
            {ENLACES.map((e) => (
              <NavLink
                key={e.to}
                to={e.to}
                onClick={() => setMenuAbierto(false)}
                className="font-display text-2xl text-paper"
              >
                {e.label}
              </NavLink>
            ))}
            <button
              onClick={irAReservar}
              className="mt-4 w-full rounded-sm bg-gold py-3.5 text-center font-medium text-ink"
            >
              Reservar cita
            </button>
            <SocialLinks className="mt-2" tamano={20} />
          </nav>
        </div>
      )}
    </header>
  )
}

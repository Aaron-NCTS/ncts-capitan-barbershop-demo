import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { brand } from '../../brand/config'

const ENLACES = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#barberos', label: 'Barberos' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#ubicacion', label: 'Ubicación' },
  { href: '#contacto', label: 'Contacto' },
]

export function Header() {
  const [conScroll, setConScroll] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

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
    document.getElementById('reservar')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        conScroll ? 'bg-ink/90 backdrop-blur border-b border-carbon-line' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#inicio" className="font-display text-xl tracking-wide text-paper sm:text-2xl">
          {brand.nombre}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {ENLACES.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="text-sm text-cream-dim transition-colors hover:text-gold"
            >
              {e.label}
            </a>
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
              <a
                key={e.href}
                href={e.href}
                onClick={() => setMenuAbierto(false)}
                className="font-display text-2xl text-paper"
              >
                {e.label}
              </a>
            ))}
            <button
              onClick={irAReservar}
              className="mt-4 w-full rounded-sm bg-gold py-3.5 text-center font-medium text-ink"
            >
              Reservar cita
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardList,
  Contact,
  CreditCard,
  LayoutDashboard,
  Menu,
  RotateCcw,
  Scissors,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { brand } from '../../brand/config'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../../components/ui/Toast'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, fin: true },
  { to: '/admin/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/admin/citas', label: 'Citas', icon: ClipboardList },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/barberos', label: 'Barberos', icon: Scissors },
  { to: '/admin/servicios', label: 'Servicios', icon: Contact },
  { to: '/admin/pagos', label: 'Pagos', icon: CreditCard },
  { to: '/admin/recordatorios', label: 'Recordatorios', icon: Bell },
  { to: '/admin/analitica', label: 'Analítica', icon: BarChart3 },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

export default function AdminLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { restablecerDemo } = useAppData()
  const { mostrarToast } = useToast()
  const location = useLocation()

  const paginaActual = NAV.find((n) => (n.fin ? location.pathname === n.to : location.pathname.startsWith(n.to)))

  const manejarReset = () => {
    if (!window.confirm('Esto restablece todos los datos de demostración (citas, clientes, pagos). ¿Continuar?')) return
    restablecerDemo()
    mostrarToast('Datos de demostración restablecidos.', 'exito')
  }

  const contenidoNav = (
    <nav className="flex-1 space-y-1 px-3">
      {NAV.map(({ to, label, icon: Icon, fin }) => (
        <NavLink
          key={to}
          to={to}
          end={fin}
          onClick={() => setMenuAbierto(false)}
          className={({ isActive }) =>
            [
              'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors',
              isActive ? 'bg-gold/10 text-gold' : 'text-cream-dim hover:bg-carbon hover:text-paper',
            ].join(' ')
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="flex">
        {/* Sidebar de escritorio */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-carbon-line bg-ink-soft py-6 lg:flex">
          <div className="px-5 pb-6">
            <p className="font-display text-xl text-paper">{brand.admin.nombrePanel}</p>
            <p className="mt-0.5 text-xs text-cream-dim/60">{brand.nombre}</p>
            <span className="mt-2 inline-block rounded-full border border-carbon-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-cream-dim/50">
              Datos de demostración
            </span>
          </div>
          {contenidoNav}
          <div className="mt-auto space-y-3 px-5 pt-6">
            <button
              onClick={manejarReset}
              className="flex w-full items-center gap-2 rounded-sm border border-carbon-line px-3 py-2 text-xs text-cream-dim hover:border-gold/50 hover:text-gold"
            >
              <RotateCcw size={14} /> Restablecer datos demo
            </button>
            <p className="text-center text-[11px] text-cream-dim/40">{brand.admin.poweredBy}</p>
          </div>
        </aside>

        {/* Sidebar móvil (drawer) */}
        {menuAbierto && (
          <div className="fixed inset-0 z-[80] lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMenuAbierto(false)} />
            <aside className="relative flex h-full w-72 flex-col border-r border-carbon-line bg-ink-soft py-6">
              <div className="flex items-center justify-between px-5 pb-6">
                <div>
                  <p className="font-display text-xl text-paper">{brand.admin.nombrePanel}</p>
                  <p className="mt-0.5 text-xs text-cream-dim/60">{brand.nombre}</p>
                  <span className="mt-2 inline-block rounded-full border border-carbon-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-cream-dim/50">
                    Datos de demostración
                  </span>
                </div>
                <button onClick={() => setMenuAbierto(false)} aria-label="Cerrar menú" className="text-cream-dim">
                  <X size={22} />
                </button>
              </div>
              {contenidoNav}
              <div className="mt-auto space-y-3 px-5 pt-6">
                <button
                  onClick={manejarReset}
                  className="flex w-full items-center gap-2 rounded-sm border border-carbon-line px-3 py-2 text-xs text-cream-dim"
                >
                  <RotateCcw size={14} /> Restablecer datos demo
                </button>
                <p className="text-center text-[11px] text-cream-dim/40">{brand.admin.poweredBy}</p>
              </div>
            </aside>
          </div>
        )}

        <div className="min-h-screen flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-carbon-line bg-ink/90 px-5 py-4 backdrop-blur lg:px-8">
            <button onClick={() => setMenuAbierto(true)} aria-label="Abrir menú" className="text-paper lg:hidden">
              <Menu size={22} />
            </button>
            <h1 className="font-display text-xl text-paper">{paginaActual?.label ?? 'Panel'}</h1>
          </header>
          <main className="px-5 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'

type TipoToast = 'exito' | 'info' | 'aviso'

interface ToastItem {
  id: number
  mensaje: string
  tipo: TipoToast
}

interface ToastContextValue {
  mostrarToast: (mensaje: string, tipo?: TipoToast) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONOS: Record<TipoToast, ReactNode> = {
  exito: <CheckCircle2 size={18} className="text-ok shrink-0" />,
  info: <Info size={18} className="text-gold shrink-0" />,
  aviso: <TriangleAlert size={18} className="text-warn shrink-0" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const mostrarToast = useCallback((mensaje: string, tipo: TipoToast = 'info') => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, mensaje, tipo }])
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 4200)
  }, [])

  const cerrar = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6"
        aria-live="polite"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-lg border border-carbon-line bg-ink-soft px-4 py-3 shadow-2xl shadow-black/40"
          >
            {ICONOS[t.tipo]}
            <p className="flex-1 text-sm text-paper/90">{t.mensaje}</p>
            <button
              onClick={() => cerrar(t.id)}
              aria-label="Cerrar notificación"
              className="text-cream-dim/70 hover:text-paper"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
  anchoMax?: string
}

export function Modal({ abierto, titulo, onCerrar, children, anchoMax = 'max-w-lg' }: Props) {
  useEffect(() => {
    if (!abierto) return
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar()
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" role="presentation" onClick={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full ${anchoMax} overflow-y-auto thin-scroll rounded-t-lg border border-carbon-line bg-ink-soft p-6 sm:rounded-sm`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl text-paper">{titulo}</h3>
          <button onClick={onCerrar} aria-label="Cerrar" className="text-cream-dim hover:text-paper">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

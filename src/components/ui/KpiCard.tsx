import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

interface Props {
  etiqueta: string
  valor: string | number
  variacion?: number
  comparadoCon?: string
  icono?: ReactNode
}

export function KpiCard({ etiqueta, valor, variacion, comparadoCon, icono }: Props) {
  const positivo = (variacion ?? 0) >= 0

  return (
    <div className="rounded-sm border border-carbon-line bg-carbon p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.12em] text-cream-dim/70">{etiqueta}</p>
        {icono && <span className="text-gold/70">{icono}</span>}
      </div>
      <p className="mt-2 font-display text-3xl text-paper">{valor}</p>
      {variacion !== undefined && (
        <p className={`mt-2 flex items-center gap-1 text-xs ${positivo ? 'text-ok' : 'text-danger'}`}>
          {positivo ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(variacion)}% {comparadoCon ?? 'vs periodo anterior'}
        </p>
      )}
    </div>
  )
}

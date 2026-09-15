import { claseEstadoCita, etiquetaEstadoCita } from '../../lib/utils'

export function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${claseEstadoCita(estado)}`}>
      {etiquetaEstadoCita(estado)}
    </span>
  )
}

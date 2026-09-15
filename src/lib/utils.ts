import { addMinutes, format, isBefore, parse, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatoMoneda(valor: number): string {
  return valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
}

export function formatoFechaLarga(fechaISO: string): string {
  const d = parse(fechaISO, 'yyyy-MM-dd', new Date())
  return format(d, "EEEE d 'de' MMMM", { locale: es })
}

export function formatoFechaCorta(fechaISO: string): string {
  const d = parse(fechaISO, 'yyyy-MM-dd', new Date())
  return format(d, 'd MMM yyyy', { locale: es })
}

export function generarFolio(): string {
  const fecha = format(new Date(), 'yyMMdd')
  const sufijo = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `CB-${fecha}-${sufijo}`
}

export function generarId(prefijo = 'id'): string {
  return `${prefijo}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** Genera slots de horario cada `pasoMinutos` entre `inicio` y `fin` (formato "HH:mm"). */
export function generarSlots(inicio: string, fin: string, pasoMinutos = 30): string[] {
  const base = startOfDay(new Date())
  let cursor = parse(inicio, 'HH:mm', base)
  const limite = parse(fin, 'HH:mm', base)
  const slots: string[] = []
  while (isBefore(cursor, limite)) {
    slots.push(format(cursor, 'HH:mm'))
    cursor = addMinutes(cursor, pasoMinutos)
  }
  return slots
}

export function calcularAnticipo(total: number, porcentaje: number): number {
  return Math.round((total * porcentaje) / 100)
}

export function iniciales(nombre: string, apellidos: string): string {
  return `${nombre.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
}

export function claseEstadoCita(estado: string): string {
  switch (estado) {
    case 'confirmada':
      return 'text-gold border-gold/40 bg-gold/10'
    case 'pendiente':
      return 'text-cream-dim border-cream-dim/30 bg-cream-dim/10'
    case 'completada':
      return 'text-ok border-ok/40 bg-ok/10'
    case 'cancelada':
      return 'text-danger border-danger/40 bg-danger/10'
    case 'no_asistio':
      return 'text-warn border-warn/40 bg-warn/10'
    default:
      return 'text-cream-dim border-cream-dim/30 bg-cream-dim/10'
  }
}

export function etiquetaEstadoCita(estado: string): string {
  switch (estado) {
    case 'confirmada':
      return 'Confirmada'
    case 'pendiente':
      return 'Pendiente'
    case 'completada':
      return 'Completada'
    case 'cancelada':
      return 'Cancelada'
    case 'no_asistio':
      return 'No asistió'
    default:
      return estado
  }
}

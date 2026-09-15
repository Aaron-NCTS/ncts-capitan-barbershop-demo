import { format, isWithinInterval, subDays } from 'date-fns'
import type { Cita, Cliente, VisitaAnalitica } from '../types'

const hoyISO = () => format(new Date(), 'yyyy-MM-dd')

export function citasDe(citas: Cita[], fechaISO: string): Cita[] {
  return citas.filter((c) => c.fecha === fechaISO)
}

export function citasEnRango(citas: Cita[], desde: Date, hasta: Date): Cita[] {
  return citas.filter((c) => {
    const f = new Date(`${c.fecha}T00:00:00`)
    return isWithinInterval(f, { start: desde, end: hasta })
  })
}

export function ingresosDeCitas(citas: Cita[]): number {
  return citas.reduce((acc, c) => acc + (c.pago.estado === 'pagado' ? c.pago.montoAnticipo : 0), 0)
}

export function anticiposCobrados(citas: Cita[]): number {
  return citas.filter((c) => c.pago.estado === 'pagado').reduce((acc, c) => acc + c.pago.montoAnticipo, 0)
}

export function saldoPendiente(citas: Cita[]): number {
  return citas
    .filter((c) => c.estado !== 'cancelada' && c.estado !== 'no_asistio')
    .reduce((acc, c) => acc + c.pago.montoPendiente, 0)
}

export function variacionPorcentual(actual: number, anterior: number): number {
  if (anterior === 0) return actual === 0 ? 0 : 100
  return Math.round(((actual - anterior) / anterior) * 100)
}

export function clientesNuevosEnRango(clientes: Cliente[], desde: Date, hasta: Date): number {
  return clientes.filter((c) => isWithinInterval(new Date(c.creadoEn), { start: desde, end: hasta })).length
}

export function clientesRecurrentes(citas: Cita[]): number {
  const conteo = new Map<string, number>()
  citas.forEach((c) => conteo.set(c.clienteId, (conteo.get(c.clienteId) ?? 0) + 1))
  return Array.from(conteo.values()).filter((n) => n > 1).length
}

export function dashboardKpis(citas: Cita[], clientes: Cliente[]) {
  const hoy = hoyISO()
  const inicioSemana = subDays(new Date(), 6)
  const inicioSemanaAnterior = subDays(new Date(), 13)
  const finSemanaAnterior = subDays(new Date(), 7)
  const inicioMes = subDays(new Date(), 29)
  const inicioMesAnterior = subDays(new Date(), 59)
  const finMesAnterior = subDays(new Date(), 30)

  const citasHoy = citasDe(citas, hoy)
  const citasSemana = citasEnRango(citas, inicioSemana, new Date())
  const citasSemanaAnterior = citasEnRango(citas, inicioSemanaAnterior, finSemanaAnterior)
  const citasMes = citasEnRango(citas, inicioMes, new Date())
  const citasMesAnterior = citasEnRango(citas, inicioMesAnterior, finMesAnterior)

  const ingresosMes = ingresosDeCitas(citasMes)
  const ingresosMesAnterior = ingresosDeCitas(citasMesAnterior)

  return {
    citasHoy: citasHoy.length,
    citasSemana: citasSemana.length,
    citasMes: citasMes.length,
    ingresos: ingresosMes,
    variacionIngresos: variacionPorcentual(ingresosMes, ingresosMesAnterior),
    variacionCitasSemana: variacionPorcentual(citasSemana.length, citasSemanaAnterior.length),
    anticipos: anticiposCobrados(citasMes),
    saldoPendiente: saldoPendiente(citas),
    clientesNuevos: clientesNuevosEnRango(clientes, inicioMes, new Date()),
    clientesRecurrentes: clientesRecurrentes(citas),
    cancelaciones: citasMes.filter((c) => c.estado === 'cancelada').length,
    noShows: citasMes.filter((c) => c.estado === 'no_asistio').length,
  }
}

export function analiticaEnRango(analitica: VisitaAnalitica[], dias: number): VisitaAnalitica[] {
  return analitica.slice(-dias)
}

export function sumar(analitica: VisitaAnalitica[], campo: keyof Pick<VisitaAnalitica, 'visitantes' | 'reservas' | 'paginasVistas' | 'usuariosUnicos'>): number {
  return analitica.reduce((acc, a) => acc + a[campo], 0)
}

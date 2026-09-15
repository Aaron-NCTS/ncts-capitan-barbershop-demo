import { format } from 'date-fns'
import type { Barbero, Cita, HorarioDia } from '../types'
import { generarSlots } from './utils'

const DIAS_SEMANA: HorarioDia['dia'][] = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab']

export function diaSemanaDeFecha(fechaISO: string): HorarioDia['dia'] {
  const d = new Date(`${fechaISO}T00:00:00`)
  return DIAS_SEMANA[d.getDay()]
}

export function fechaTieneDisponibilidad(fechaISO: string, barberos: Barbero[], barberoId: string | 'cualquiera'): boolean {
  const dia = diaSemanaDeFecha(fechaISO)
  const candidatos = barberoId === 'cualquiera' ? barberos.filter((b) => b.activo) : barberos.filter((b) => b.id === barberoId)
  return candidatos.some((b) => b.horario.find((h) => h.dia === dia)?.activo)
}

/**
 * Devuelve los horarios disponibles para la fecha dada. Si `barberoId` es
 * "cualquiera", combina la disponibilidad de todos los barberos activos y,
 * al reservar, se asigna el primero que esté libre en ese horario.
 */
export function slotsDisponibles(
  fechaISO: string,
  barberos: Barbero[],
  barberoId: string | 'cualquiera',
  citasExistentes: Cita[],
  pasoMinutos: number,
): { hora: string; barberoAsignadoId: string }[] {
  const dia = diaSemanaDeFecha(fechaISO)
  const candidatos = barberoId === 'cualquiera' ? barberos.filter((b) => b.activo) : barberos.filter((b) => b.id === barberoId)

  const ocupados = new Set(
    citasExistentes
      .filter((c) => c.fecha === fechaISO && c.estado !== 'cancelada')
      .map((c) => `${c.barberoAsignadoId}__${c.hora}`),
  )

  const mapaSlots = new Map<string, string>() // hora -> barberoAsignadoId

  for (const barbero of candidatos) {
    const horarioDia = barbero.horario.find((h) => h.dia === dia)
    if (!horarioDia || !horarioDia.activo) continue
    const slots = generarSlots(horarioDia.inicio, horarioDia.fin, pasoMinutos)
    for (const hora of slots) {
      if (mapaSlots.has(hora)) continue // ya cubierto por otro barbero
      if (ocupados.has(`${barbero.id}__${hora}`)) continue
      mapaSlots.set(hora, barbero.id)
    }
  }

  return Array.from(mapaSlots.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hora, barberoAsignadoId]) => ({ hora, barberoAsignadoId }))
}

export function esFechaPasada(fechaISO: string): boolean {
  const hoy = format(new Date(), 'yyyy-MM-dd')
  return fechaISO < hoy
}

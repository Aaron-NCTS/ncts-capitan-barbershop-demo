export type EstadoCita =
  | 'confirmada'
  | 'pendiente'
  | 'completada'
  | 'cancelada'
  | 'no_asistio'

export type MetodoPago = 'tarjeta' | 'mercado_pago'

export interface Servicio {
  id: string
  nombre: string
  descripcion: string
  duracionMinutos: number
  precio: number
  activo: boolean
  barberosIds: string[]
}

export interface HorarioDia {
  dia: 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'
  activo: boolean
  inicio: string // "10:00"
  fin: string // "20:00"
}

export interface Barbero {
  id: string
  nombre: string
  especialidad: string
  experienciaAnios: number
  ratingDemostrativo: number
  horario: HorarioDia[]
  activo: boolean
}

export interface Cliente {
  id: string
  nombre: string
  apellidos: string
  telefono: string
  whatsapp: string
  correo: string
  notas?: string
  creadoEn: string
}

export interface Pago {
  metodo: MetodoPago
  montoAnticipo: number
  montoTotal: number
  montoPendiente: number
  estado: 'pagado' | 'pendiente' | 'reembolsado'
  fechaPago: string
}

export interface Cita {
  id: string
  folio: string
  clienteId: string
  servicioId: string
  barberoId: string | 'cualquiera'
  barberoAsignadoId: string
  fecha: string // "2026-09-20"
  hora: string // "10:30"
  estado: EstadoCita
  pago: Pago
  notas?: string
  creadaEn: string
  esDemo?: boolean
}

export interface Recordatorio {
  id: string
  nombre: string
  descripcion: string
  activo: boolean
}

export interface VisitaAnalitica {
  fecha: string
  visitantes: number
  usuariosUnicos: number
  paginasVistas: number
  reservas: number
  dispositivo: { movil: number; desktop: number; tablet: number }
  fuente: { google: number; instagram: number; facebook: number; directo: number; whatsapp: number }
}

export interface Configuracion {
  porcentajeAnticipo: number
  politicaCancelacion: string
  metodosPago: MetodoPago[]
}

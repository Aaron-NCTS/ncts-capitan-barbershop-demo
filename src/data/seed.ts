import { format, subDays } from 'date-fns'
import type {
  Barbero,
  Cita,
  Cliente,
  Recordatorio,
  Servicio,
  VisitaAnalitica,
} from '../types'
import { calcularAnticipo, generarFolio, generarId } from '../lib/utils'
import { brand } from '../brand/config'

const HORARIO_ESTANDAR = [
  { dia: 'lun', activo: true, inicio: '10:00', fin: '20:00' },
  { dia: 'mar', activo: true, inicio: '10:00', fin: '20:00' },
  { dia: 'mie', activo: true, inicio: '10:00', fin: '20:00' },
  { dia: 'jue', activo: true, inicio: '10:00', fin: '20:00' },
  { dia: 'vie', activo: true, inicio: '10:00', fin: '20:00' },
  { dia: 'sab', activo: true, inicio: '10:00', fin: '17:00' },
  { dia: 'dom', activo: true, inicio: '10:00', fin: '17:00' },
] as Barbero['horario']

export const SERVICIOS_SEED: Servicio[] = [
  {
    id: 'srv_corte',
    nombre: 'Corte',
    descripcion: 'Corte a tijera y máquina, con acabado a navaja en contornos.',
    duracionMinutos: 30,
    precio: 150,
    activo: true,
    barberosIds: [],
  },
  {
    id: 'srv_corte_barba',
    nombre: 'Corte y barba',
    descripcion: 'Corte de precisión acompañado de perfilado completo de barba.',
    duracionMinutos: 45,
    precio: 270,
    activo: true,
    barberosIds: [],
  },
  {
    id: 'srv_corte_barba_facial',
    nombre: 'Corte, barba y facial',
    descripcion: 'La experiencia completa: corte, barba y tratamiento facial exprés.',
    duracionMinutos: 60,
    precio: 370,
    activo: true,
    barberosIds: [],
  },
  {
    id: 'srv_afeitado',
    nombre: 'Afeitado tradicional',
    descripcion: 'Afeitado a navaja con toalla caliente y aceites pre y post afeitado.',
    duracionMinutos: 40,
    precio: 280,
    activo: true,
    barberosIds: [],
  },
  {
    id: 'srv_arreglo_barba',
    nombre: 'Arreglo de barba',
    descripcion: 'Perfilado, definición de línea y tratamiento con aceite para barba.',
    duracionMinutos: 25,
    precio: 180,
    activo: true,
    barberosIds: [],
  },
  {
    id: 'srv_perfilado',
    nombre: 'Perfilado',
    descripcion: 'Definición de contornos de cabello y barba entre cortes.',
    duracionMinutos: 20,
    precio: 120,
    activo: true,
    barberosIds: [],
  },
]

export const BARBEROS_SEED: Barbero[] = [
  {
    id: 'brb_uno',
    nombre: 'Barbero 1',
    especialidad: 'Cortes clásicos y degradados',
    experienciaAnios: 8,
    ratingDemostrativo: 4.9,
    horario: HORARIO_ESTANDAR,
    activo: true,
  },
  {
    id: 'brb_dos',
    nombre: 'Barbero 2',
    especialidad: 'Barba y afeitado tradicional',
    experienciaAnios: 6,
    ratingDemostrativo: 4.8,
    horario: HORARIO_ESTANDAR,
    activo: true,
  },
  {
    id: 'brb_tres',
    nombre: 'Barbero 3',
    especialidad: 'Diseño y estilos premium',
    experienciaAnios: 5,
    ratingDemostrativo: 4.7,
    horario: HORARIO_ESTANDAR,
    activo: true,
  },
]

SERVICIOS_SEED.forEach((s) => {
  s.barberosIds = BARBEROS_SEED.map((b) => b.id)
})

const NOMBRES_CLIENTES = [
  ['Emilio', 'Cortés'],
  ['Renata', 'Salazar'],
  ['Damián', 'Ferreyra'],
  ['Ximena', 'Bravo'],
  ['Tadeo', 'Rangel'],
  ['Valeria', 'Ochoa'],
  ['Mateo', 'Villaseñor'],
  ['Camila', 'Duarte'],
]

export const CLIENTES_SEED: Cliente[] = NOMBRES_CLIENTES.map(([nombre, apellidos], i) => ({
  id: `cli_seed_${i}`,
  nombre,
  apellidos,
  telefono: `55 0000 00${(10 + i).toString().padStart(2, '0')}`,
  whatsapp: `55 0000 00${(10 + i).toString().padStart(2, '0')}`,
  correo: `${nombre.toLowerCase()}.${apellidos.toLowerCase()}@correo.demo`,
  notas: '',
  creadoEn: subDays(new Date(), 60 - i * 5).toISOString(),
}))

function citaDemo(
  diasOffset: number,
  hora: string,
  servicioId: string,
  barberoId: string,
  clienteId: string,
  estado: Cita['estado'],
): Cita {
  const servicio = SERVICIOS_SEED.find((s) => s.id === servicioId)!
  const anticipo = calcularAnticipo(servicio.precio, brand.reglasNegocio.porcentajeAnticipo)
  const pagado = estado !== 'pendiente'
  return {
    id: generarId('cita'),
    folio: generarFolio(),
    clienteId,
    servicioId,
    barberoId,
    barberoAsignadoId: barberoId,
    fecha: format(new Date(Date.now() + diasOffset * 86400000), 'yyyy-MM-dd'),
    hora,
    estado,
    pago: {
      metodo: 'tarjeta',
      montoAnticipo: anticipo,
      montoTotal: servicio.precio,
      montoPendiente: servicio.precio - anticipo,
      estado: pagado ? 'pagado' : 'pendiente',
      fechaPago: new Date().toISOString(),
    },
    creadaEn: subDays(new Date(), Math.abs(diasOffset) + 1).toISOString(),
    esDemo: true,
  }
}

export const CITAS_SEED: Cita[] = [
  citaDemo(0, '10:30', 'srv_corte', 'brb_uno', 'cli_seed_0', 'confirmada'),
  citaDemo(0, '11:30', 'srv_corte_barba', 'brb_dos', 'cli_seed_1', 'confirmada'),
  citaDemo(0, '13:00', 'srv_afeitado', 'brb_dos', 'cli_seed_2', 'pendiente'),
  citaDemo(0, '16:00', 'srv_corte_barba_facial', 'brb_tres', 'cli_seed_3', 'confirmada'),
  citaDemo(1, '10:00', 'srv_corte', 'brb_uno', 'cli_seed_4', 'confirmada'),
  citaDemo(1, '12:30', 'srv_perfilado', 'brb_tres', 'cli_seed_5', 'confirmada'),
  citaDemo(2, '17:30', 'srv_arreglo_barba', 'brb_dos', 'cli_seed_6', 'pendiente'),
  citaDemo(-1, '11:00', 'srv_corte', 'brb_uno', 'cli_seed_7', 'completada'),
  citaDemo(-2, '15:00', 'srv_corte_barba', 'brb_tres', 'cli_seed_1', 'completada'),
  citaDemo(-3, '10:30', 'srv_afeitado', 'brb_dos', 'cli_seed_2', 'no_asistio'),
  citaDemo(-4, '13:30', 'srv_corte_barba_facial', 'brb_uno', 'cli_seed_3', 'completada'),
  citaDemo(-6, '16:30', 'srv_perfilado', 'brb_tres', 'cli_seed_4', 'cancelada'),
]

export const RECORDATORIOS_SEED: Recordatorio[] = [
  { id: 'rec_confirmacion', nombre: 'Confirmación de cita', descripcion: 'Se envía al instante cuando el cliente reserva y paga el anticipo.', activo: true },
  { id: 'rec_24h', nombre: '24 horas antes', descripcion: 'Recordatorio automático un día antes de la cita agendada.', activo: true },
  { id: 'rec_3h', nombre: '3 horas antes', descripcion: 'Aviso corto pocas horas antes, para reducir inasistencias.', activo: true },
  { id: 'rec_seguimiento', nombre: 'Seguimiento post-cita', descripcion: 'Mensaje de agradecimiento y tips de cuidado tras el servicio.', activo: true },
  { id: 'rec_resena', nombre: 'Solicitud de reseña', descripcion: 'Invita al cliente a dejar una reseña 24 horas después de su visita.', activo: true },
  { id: 'rec_reactivacion', nombre: 'Reactivación de clientes', descripcion: 'Contacta a clientes con más de 45 días sin agendar.', activo: false },
]

export const ANALITICA_SEED: VisitaAnalitica[] = Array.from({ length: 30 }).map((_, i) => {
  const base = 60 + Math.round(Math.sin(i / 3) * 15) + Math.round(Math.random() * 20)
  const visitantes = Math.max(10, base)
  const reservas = Math.max(1, Math.round(visitantes * (0.05 + Math.random() * 0.04)))
  return {
    fecha: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
    visitantes,
    usuariosUnicos: Math.round(visitantes * 0.82),
    paginasVistas: Math.round(visitantes * 2.6),
    reservas,
    dispositivo: { movil: 62, desktop: 29, tablet: 9 },
    fuente: { google: 34, instagram: 29, facebook: 14, directo: 15, whatsapp: 8 },
  }
})

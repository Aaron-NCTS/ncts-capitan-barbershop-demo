import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../ui/Toast'
import { slotsDisponibles } from '../../lib/booking'
import { brand } from '../../brand/config'
import { calcularAnticipo, generarFolio } from '../../lib/utils'
import type { Cita, MetodoPago } from '../../types'
import { StepIndicator } from './StepIndicator'
import { StepService } from './StepService'
import { StepBarber } from './StepBarber'
import { StepDate } from './StepDate'
import { StepTime } from './StepTime'
import { StepClientInfo, type DatosClienteForm } from './StepClientInfo'
import { StepSummaryPayment } from './StepSummaryPayment'
import { StepConfirmation } from './StepConfirmation'

interface Props {
  servicioPreseleccionado?: string
  barberoPreseleccionado?: string
  onRestablecer: () => void
}

const CLIENTE_VACIO: DatosClienteForm = { nombre: '', apellidos: '', telefono: '', whatsapp: '', correo: '', notas: '' }

export function BookingWizard({ servicioPreseleccionado, barberoPreseleccionado, onRestablecer }: Props) {
  const { servicios, barberos, citas, crearCita, obtenerOCrearCliente } = useAppData()
  const { mostrarToast } = useToast()

  const [paso, setPaso] = useState(1)
  const [servicioId, setServicioId] = useState<string | undefined>(servicioPreseleccionado)
  const [barberoId, setBarberoId] = useState<string | 'cualquiera' | undefined>(barberoPreseleccionado)
  const [fecha, setFecha] = useState<string | undefined>()
  const [slotElegido, setSlotElegido] = useState<{ hora: string; barberoAsignadoId: string } | undefined>()
  const [datosCliente, setDatosCliente] = useState<DatosClienteForm>(CLIENTE_VACIO)
  const [citaCreada, setCitaCreada] = useState<Cita | undefined>()

  useEffect(() => {
    if (servicioPreseleccionado) {
      setServicioId(servicioPreseleccionado)
      setPaso((p) => (p < 2 ? 2 : p))
    }
  }, [servicioPreseleccionado])

  useEffect(() => {
    if (barberoPreseleccionado) {
      setBarberoId(barberoPreseleccionado)
      setPaso((p) => (p < 3 ? 3 : p))
    }
  }, [barberoPreseleccionado])

  const servicio = servicios.find((s) => s.id === servicioId)

  const slots = useMemo(() => {
    if (!fecha || !barberoId) return []
    return slotsDisponibles(fecha, barberos, barberoId, citas, brand.reglasNegocio.duracionSlotMinutos)
  }, [fecha, barberoId, barberos, citas])

  const barberoAsignadoFinal = slotElegido ? barberos.find((b) => b.id === slotElegido.barberoAsignadoId) : undefined

  const irAPaso = (n: number) => setPaso(n)

  const confirmarPago = (metodo: MetodoPago) => {
    if (!servicio || !slotElegido || !fecha) return
    const cliente = obtenerOCrearCliente({
      nombre: datosCliente.nombre,
      apellidos: datosCliente.apellidos,
      telefono: datosCliente.telefono,
      whatsapp: datosCliente.whatsapp,
      correo: datosCliente.correo,
      notas: datosCliente.notas,
    })
    const anticipo = calcularAnticipo(servicio.precio, brand.reglasNegocio.porcentajeAnticipo)
    const nueva = crearCita({
      folio: generarFolio(),
      clienteId: cliente.id,
      servicioId: servicio.id,
      barberoId: barberoId!,
      barberoAsignadoId: slotElegido.barberoAsignadoId,
      fecha,
      hora: slotElegido.hora,
      estado: 'confirmada',
      pago: {
        metodo,
        montoAnticipo: anticipo,
        montoTotal: servicio.precio,
        montoPendiente: servicio.precio - anticipo,
        estado: 'pagado',
        fechaPago: new Date().toISOString(),
      },
      notas: datosCliente.notas,
    })
    setCitaCreada(nueva)
    setPaso(7)
    mostrarToast('Cita creada y visible en el panel administrativo.', 'exito')
  }

  const reiniciar = () => {
    setPaso(1)
    setServicioId(undefined)
    setBarberoId(undefined)
    setFecha(undefined)
    setSlotElegido(undefined)
    setDatosCliente(CLIENTE_VACIO)
    setCitaCreada(undefined)
    onRestablecer()
  }

  return (
    <section id="reservar" className="bg-ink py-24">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl text-paper sm:text-5xl">Reserva tu cita</h2>
          <p className="mt-3 text-cream-dim">En menos de un minuto, sin llamadas ni esperas.</p>
        </div>

        <div className="mt-12 rounded-sm border border-carbon-line bg-ink-soft p-6 sm:p-8">
          {paso <= 6 && <StepIndicator pasoActual={paso} />}

          {paso === 1 && (
            <StepService
              servicios={servicios}
              seleccionadoId={servicioId}
              onSeleccionar={(id) => {
                setServicioId(id)
                setPaso(2)
              }}
            />
          )}

          {paso === 2 && servicio && (
            <StepBarber
              barberos={barberos}
              seleccionadoId={barberoId}
              onSeleccionar={(id) => {
                setBarberoId(id)
                setFecha(undefined)
                setSlotElegido(undefined)
                setPaso(3)
              }}
            />
          )}

          {paso === 3 && barberoId && (
            <StepDate
              barberos={barberos}
              barberoId={barberoId}
              fechaSeleccionada={fecha}
              onSeleccionar={(f) => {
                setFecha(f)
                setSlotElegido(undefined)
                setPaso(4)
              }}
            />
          )}

          {paso === 4 && fecha && (
            <StepTime
              fecha={fecha}
              slots={slots}
              horaSeleccionada={slotElegido?.hora}
              onSeleccionar={(slot) => {
                setSlotElegido(slot)
                setPaso(5)
              }}
            />
          )}

          {paso === 5 && (
            <StepClientInfo
              valorInicial={datosCliente}
              onContinuar={(datos) => {
                setDatosCliente(datos)
                setPaso(6)
              }}
            />
          )}

          {paso === 6 && servicio && barberoAsignadoFinal && fecha && slotElegido && (
            <StepSummaryPayment
              servicio={servicio}
              barbero={barberoAsignadoFinal}
              fecha={fecha}
              hora={slotElegido.hora}
              onConfirmar={confirmarPago}
            />
          )}

          {paso === 7 && citaCreada && servicio && barberoAsignadoFinal && (
            <StepConfirmation cita={citaCreada} servicio={servicio} barbero={barberoAsignadoFinal} onNuevaReserva={reiniciar} />
          )}

          {paso > 1 && paso <= 6 && (
            <button
              onClick={() => irAPaso(paso - 1)}
              className="mt-8 flex items-center gap-1.5 text-sm text-cream-dim hover:text-gold"
            >
              <ChevronLeft size={16} /> Regresar
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

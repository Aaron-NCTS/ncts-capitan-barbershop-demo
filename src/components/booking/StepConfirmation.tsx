import { CalendarCheck, MessageCircle, PartyPopper } from 'lucide-react'
import type { Barbero, Cita, Servicio } from '../../types'
import { formatoFechaLarga, formatoMoneda } from '../../lib/utils'
import { useToast } from '../ui/Toast'

interface Props {
  cita: Cita
  servicio: Servicio
  barbero: Barbero
  onNuevaReserva: () => void
}

export function StepConfirmation({ cita, servicio, barbero, onNuevaReserva }: Props) {
  const { mostrarToast } = useToast()

  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-gold/10">
        <PartyPopper className="text-gold" size={28} />
      </div>
      <h3 className="mt-5 font-display text-3xl text-paper">Tu cita está confirmada</h3>
      <p className="mt-2 text-cream-dim">Folio {cita.folio}</p>

      <div className="mx-auto mt-6 max-w-sm rounded-sm border border-carbon-line bg-carbon p-5 text-left text-sm">
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-cream-dim">Servicio</dt>
            <dd className="text-paper">{servicio.nombre}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-cream-dim">Barbero</dt>
            <dd className="text-paper">{barbero.nombre}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-cream-dim">Fecha</dt>
            <dd className="capitalize text-paper">{formatoFechaLarga(cita.fecha)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-cream-dim">Hora</dt>
            <dd className="text-paper">{cita.hora}</dd>
          </div>
          <div className="flex justify-between border-t border-carbon-line pt-2">
            <dt className="text-cream-dim">Anticipo pagado</dt>
            <dd className="font-medium text-gold">{formatoMoneda(cita.pago.montoAnticipo)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-cream-dim">Saldo pendiente</dt>
            <dd className="text-paper">{formatoMoneda(cita.pago.montoPendiente)}</dd>
          </div>
        </dl>
      </div>

      <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row">
        <button
          onClick={() => mostrarToast('Cita agregada a tu calendario.', 'exito')}
          className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-carbon-line py-3 text-sm text-paper hover:border-gold/50"
        >
          <CalendarCheck size={16} /> Agregar al calendario
        </button>
        <button
          onClick={() => mostrarToast('Confirmación enviada por WhatsApp.', 'exito')}
          className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-carbon-line py-3 text-sm text-paper hover:border-gold/50"
        >
          <MessageCircle size={16} /> Enviar por WhatsApp
        </button>
      </div>

      <button onClick={onNuevaReserva} className="mt-8 text-sm text-cream-dim underline underline-offset-4 hover:text-gold">
        Hacer otra reserva
      </button>
    </div>
  )
}

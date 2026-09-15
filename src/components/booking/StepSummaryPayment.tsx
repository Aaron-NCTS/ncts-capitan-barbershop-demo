import { useState } from 'react'
import { CreditCard, Landmark, Loader2 } from 'lucide-react'
import type { Barbero, MetodoPago, Servicio } from '../../types'
import { calcularAnticipo, formatoFechaLarga, formatoMoneda } from '../../lib/utils'
import { brand } from '../../brand/config'

interface Props {
  servicio: Servicio
  barbero: Barbero
  fecha: string
  hora: string
  onConfirmar: (metodo: MetodoPago) => void
}

export function StepSummaryPayment({ servicio, barbero, fecha, hora, onConfirmar }: Props) {
  const [metodo, setMetodo] = useState<MetodoPago>('tarjeta')
  const [procesando, setProcesando] = useState(false)

  const anticipo = calcularAnticipo(servicio.precio, brand.reglasNegocio.porcentajeAnticipo)
  const saldo = servicio.precio - anticipo

  const manejarPago = () => {
    setProcesando(true)
    // Simulación de pasarela de pago — no se procesa dinero real en esta demo.
    setTimeout(() => {
      onConfirmar(metodo)
    }, 1200)
  }

  return (
    <div>
      <h3 className="font-display text-2xl text-paper">Resumen y anticipo</h3>

      <div className="mt-6 rounded-sm border border-carbon-line bg-carbon p-5">
        <dl className="space-y-2.5 text-sm">
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
            <dd className="capitalize text-paper">{formatoFechaLarga(fecha)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-cream-dim">Hora</dt>
            <dd className="text-paper">{hora}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-cream-dim">Duración</dt>
            <dd className="text-paper">{servicio.duracionMinutos} min</dd>
          </div>
        </dl>

        <div className="mt-4 border-t border-carbon-line pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-cream-dim">Precio del servicio</span>
            <span className="text-paper">{formatoMoneda(servicio.precio)}</span>
          </div>
          <div className="mt-1.5 flex justify-between">
            <span className="font-medium text-paper">Anticipo a pagar ({brand.reglasNegocio.porcentajeAnticipo}%)</span>
            <span className="font-display text-xl text-gold">{formatoMoneda(anticipo)}</span>
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-cream-dim/70">
            <span>Saldo a pagar en el establecimiento</span>
            <span>{formatoMoneda(saldo)}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-cream-dim/70">El anticipo se descontará del total de tu servicio.</p>
      </div>

      <div className="mt-6">
        <p className="mb-2.5 text-sm text-cream-dim">Método de pago del anticipo</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMetodo('tarjeta')}
            aria-pressed={metodo === 'tarjeta'}
            className={[
              'flex items-center justify-center gap-2 rounded-sm border py-3 text-sm transition-colors',
              metodo === 'tarjeta' ? 'border-gold bg-gold/10 text-gold' : 'border-carbon-line text-cream-dim',
            ].join(' ')}
          >
            <CreditCard size={16} /> Tarjeta
          </button>
          <button
            type="button"
            onClick={() => setMetodo('mercado_pago')}
            aria-pressed={metodo === 'mercado_pago'}
            className={[
              'flex items-center justify-center gap-2 rounded-sm border py-3 text-sm transition-colors',
              metodo === 'mercado_pago' ? 'border-gold bg-gold/10 text-gold' : 'border-carbon-line text-cream-dim',
            ].join(' ')}
          >
            <Landmark size={16} /> Mercado Pago
          </button>
        </div>

        {metodo === 'tarjeta' && (
          <div className="mt-4 grid gap-3 rounded-sm border border-carbon-line bg-ink p-4 sm:grid-cols-2">
            <input
              disabled
              placeholder="4242 4242 4242 4242 (demo)"
              className="sm:col-span-2 rounded-sm border border-carbon-line bg-carbon px-3 py-2.5 text-sm text-cream-dim/60"
            />
            <input disabled placeholder="MM/AA" className="rounded-sm border border-carbon-line bg-carbon px-3 py-2.5 text-sm text-cream-dim/60" />
            <input disabled placeholder="CVC" className="rounded-sm border border-carbon-line bg-carbon px-3 py-2.5 text-sm text-cream-dim/60" />
          </div>
        )}
        {metodo === 'mercado_pago' && (
          <div className="mt-4 rounded-sm border border-carbon-line bg-ink p-4 text-sm text-cream-dim/70">
            En la versión final, este paso redirige a la pasarela de Mercado Pago para completar el cobro del anticipo.
          </div>
        )}

        <p className="mt-3 text-xs text-cream-dim/50">
          Espacio preparado para integrar Mercado Pago o Stripe — ningún cargo real se procesa en esta demo.
        </p>

        <button
          type="button"
          onClick={manejarPago}
          disabled={procesando}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-gold py-3.5 font-medium text-ink transition-transform hover:scale-[1.01] disabled:opacity-70"
        >
          {procesando ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Procesando pago…
            </>
          ) : (
            `Pagar anticipo y confirmar cita`
          )}
        </button>
      </div>
    </div>
  )
}

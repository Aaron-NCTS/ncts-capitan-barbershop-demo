import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../../components/ui/Toast'
import { brand } from '../../brand/config'
import type { MetodoPago } from '../../types'

export default function Configuracion() {
  const { configuracion, actualizarConfiguracion } = useAppData()
  const { mostrarToast } = useToast()
  const [porcentaje, setPorcentaje] = useState(configuracion.porcentajeAnticipo)
  const [politica, setPolitica] = useState(configuracion.politicaCancelacion)
  const [metodos, setMetodos] = useState<MetodoPago[]>(configuracion.metodosPago)

  const toggleMetodo = (m: MetodoPago) => {
    setMetodos((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))
  }

  const guardar = () => {
    actualizarConfiguracion({ porcentajeAnticipo: porcentaje, politicaCancelacion: politica, metodosPago: metodos })
    mostrarToast('Configuración guardada.', 'exito')
  }

  return (
    <div className="max-w-2xl space-y-8">
      <section className="rounded-sm border border-carbon-line bg-carbon p-5">
        <h2 className="font-display text-xl text-paper">Datos del negocio</h2>
        <dl className="mt-4 grid grid-cols-1 gap-y-2.5 text-sm sm:grid-cols-2">
          <dt className="text-cream-dim">Nombre</dt>
          <dd className="text-paper">{brand.nombre}</dd>
          <dt className="text-cream-dim">Teléfono</dt>
          <dd className="text-paper">{brand.contacto.telefono}</dd>
          <dt className="text-cream-dim">WhatsApp</dt>
          <dd className="text-paper">{brand.contacto.whatsapp}</dd>
          <dt className="text-cream-dim">Dirección</dt>
          <dd className="text-paper">{brand.ubicacion.direccion}</dd>
          {brand.contacto.correo && (
            <>
              <dt className="text-cream-dim">Correo</dt>
              <dd className="text-paper">{brand.contacto.correo}</dd>
            </>
          )}
          {brand.contacto.instagram && (
            <>
              <dt className="text-cream-dim">Instagram</dt>
              <dd className="text-paper">{brand.contacto.instagram}</dd>
            </>
          )}
        </dl>
        <p className="mt-3 text-xs text-cream-dim/50">
          Estos campos se editan en <code className="text-cream-dim/70">src/brand/config.ts</code> para mantener la marca centralizada.
        </p>
      </section>

      <section className="rounded-sm border border-carbon-line bg-carbon p-5">
        <h2 className="font-display text-xl text-paper">Reglas de reservación</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-cream-dim">Porcentaje de anticipo</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={porcentaje}
                onChange={(e) => setPorcentaje(Number(e.target.value))}
                className="flex-1 accent-gold"
              />
              <span className="w-14 text-right font-display text-xl text-gold">{porcentaje}%</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-cream-dim">Política de cancelación</label>
            <textarea
              rows={3}
              value={politica}
              onChange={(e) => setPolitica(e.target.value)}
              className="w-full resize-none rounded-sm border border-carbon-line bg-ink px-3.5 py-2.5 text-paper outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-cream-dim">Métodos de pago aceptados</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggleMetodo('tarjeta')}
                className={`rounded-full border px-3 py-1 text-xs ${metodos.includes('tarjeta') ? 'border-gold bg-gold/10 text-gold' : 'border-carbon-line text-cream-dim'}`}
              >
                Tarjeta
              </button>
              <button
                type="button"
                onClick={() => toggleMetodo('mercado_pago')}
                className={`rounded-full border px-3 py-1 text-xs ${metodos.includes('mercado_pago') ? 'border-gold bg-gold/10 text-gold' : 'border-carbon-line text-cream-dim'}`}
              >
                Mercado Pago
              </button>
            </div>
          </div>

          <button onClick={guardar} className="rounded-sm bg-gold px-5 py-2.5 text-sm font-medium text-ink">
            Guardar configuración
          </button>
        </div>
      </section>
    </div>
  )
}

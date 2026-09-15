import { Clock, MapPin, Phone } from 'lucide-react'
import { brand } from '../../brand/config'

const URL_GOOGLE_MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  brand.ubicacion.direccionCompleta,
)}`

export function Location() {
  return (
    <section id="ubicacion" className="bg-carbon py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="font-display text-4xl text-paper sm:text-5xl">Ubicación y contacto</h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col justify-between gap-6 rounded-sm border border-carbon-line bg-ink p-6">
            <div
              className="flex aspect-[16/10] items-center justify-center rounded-sm border border-carbon-line bg-[radial-gradient(circle_at_center,var(--color-carbon)_0%,var(--color-ink)_70%)]"
              role="img"
              aria-label={`Ubicación: ${brand.ubicacion.direccionCompleta}`}
            >
              <MapPin className="text-gold" size={32} />
            </div>
            <a
              href={URL_GOOGLE_MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-sm border border-gold py-3 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              <MapPin size={16} /> Ver en Google Maps
            </a>
          </div>

          <div id="contacto" className="flex flex-col gap-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gold">Dirección</h3>
              <p className="mt-2 flex items-start gap-2 text-cream-dim">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                <span>
                  {brand.ubicacion.direccion}, {brand.ubicacion.ciudad}, {brand.ubicacion.codigoPostal}
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gold">Horarios</h3>
              <dl className="mt-2 space-y-1.5">
                {brand.horarios.map((h) => (
                  <div key={h.dia} className="flex items-center gap-2 text-cream-dim">
                    <Clock size={16} className="shrink-0 text-gold" />
                    <dt className="w-36 shrink-0">{h.dia}</dt>
                    <dd>{h.horario}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gold">Contacto directo</h3>
              <div className="mt-2 space-y-1.5 text-cream-dim">
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-gold" /> {brand.contacto.telefono}
                </p>
                <p className="text-xs text-cream-dim/60">Teléfono y WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

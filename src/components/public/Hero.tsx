import { brand } from '../../brand/config'

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-ink pb-20 sm:pb-28">
      {/* Textura de fondo: retícula sutil, sin gradientes llamativos */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-5 text-sm tracking-[0.2em] text-gold">Barbería premium · {brand.ubicacion.ciudad}</p>
          <h1 className="font-display text-5xl leading-[1.05] text-paper sm:text-6xl lg:text-7xl">
            {brand.nombre}
          </h1>
          <p className="mt-6 max-w-md text-lg text-cream-dim">
            {brand.claim} {brand.descripcion}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#reservar"
              className="rounded-sm bg-gold px-7 py-3.5 text-center font-medium text-ink transition-transform hover:scale-[1.02]"
            >
              Reservar cita
            </a>
            <a
              href="#servicios"
              className="rounded-sm border border-carbon-line px-7 py-3.5 text-center font-medium text-paper transition-colors hover:border-gold hover:text-gold"
            >
              Ver servicios
            </a>
          </div>

          <div className="mt-12 hairline max-w-xs" />
          <dl className="mt-6 grid max-w-md grid-cols-3 gap-4 text-left">
            <div>
              <dt className="font-display text-3xl text-gold">12+</dt>
              <dd className="mt-1 text-xs text-cream-dim">Años de oficio</dd>
            </div>
            <div>
              <dt className="font-display text-3xl text-gold">3</dt>
              <dd className="mt-1 text-xs text-cream-dim">Barberos especialistas</dd>
            </div>
            <div>
              <dt className="font-display text-3xl text-gold">6</dt>
              <dd className="mt-1 text-xs text-cream-dim">Servicios a la carta</dd>
            </div>
          </dl>
        </div>

        <div className="relative aspect-[4/5] w-full max-w-md justify-self-center overflow-hidden rounded-sm border border-carbon-line bg-carbon lg:justify-self-end">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
            <span className="font-display text-7xl text-gold/70">C</span>
          </div>
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
      </div>
    </section>
  )
}

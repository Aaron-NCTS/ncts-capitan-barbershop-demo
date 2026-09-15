export function About() {
  return (
    <section id="nosotros" className="bg-ink py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div className="order-2 aspect-[5/4] rounded-sm border border-carbon-line bg-carbon lg:order-1">
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <span className="font-display text-5xl text-gold/60">✂</span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-sm tracking-[0.2em] text-gold">Nuestra historia</p>
          <h2 className="mt-4 font-display text-4xl text-paper sm:text-5xl">Oficio antes que tendencia</h2>
          <p className="mt-6 text-cream-dim">
            En Capitán Barber Shop cuidamos cada detalle del ritual de barbería: desde la primera consulta hasta el
            último toque de navaja. Nuestro equipo combina técnica clásica con un espacio pensado para que cada
            visita se sienta como una pausa necesaria, no como un trámite.
          </p>
        </div>
      </div>
    </section>
  )
}

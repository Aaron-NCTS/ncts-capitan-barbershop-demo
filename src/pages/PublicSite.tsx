import { useState } from 'react'
import { Header } from '../components/public/Header'
import { Hero } from '../components/public/Hero'
import { Services } from '../components/public/Services'
import { Barbers } from '../components/public/Barbers'
import { About } from '../components/public/About'
import { Location } from '../components/public/Location'
import { Footer } from '../components/public/Footer'
import { BookingWizard } from '../components/booking/BookingWizard'

export default function PublicSite() {
  const [servicioPreseleccionado, setServicioPreseleccionado] = useState<string | undefined>()
  const [barberoPreseleccionado, setBarberoPreseleccionado] = useState<string | undefined>()
  const [claveWizard, setClaveWizard] = useState(0)

  const reservarServicio = (servicioId: string) => {
    setServicioPreseleccionado(servicioId)
    setBarberoPreseleccionado(undefined)
    setClaveWizard((k) => k + 1)
    requestAnimationFrame(() => document.getElementById('reservar')?.scrollIntoView({ behavior: 'smooth' }))
  }

  const reservarConBarbero = (barberoId: string) => {
    setBarberoPreseleccionado(barberoId)
    setServicioPreseleccionado(undefined)
    setClaveWizard((k) => k + 1)
    requestAnimationFrame(() => document.getElementById('reservar')?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main>
        <Hero />
        <Services onReservar={reservarServicio} />
        <Barbers onReservarCon={reservarConBarbero} />
        <About />
        <BookingWizard
          key={claveWizard}
          servicioPreseleccionado={servicioPreseleccionado}
          barberoPreseleccionado={barberoPreseleccionado}
          onRestablecer={() => {
            setServicioPreseleccionado(undefined)
            setBarberoPreseleccionado(undefined)
          }}
        />
        <Location />
      </main>
      <Footer />
    </div>
  )
}

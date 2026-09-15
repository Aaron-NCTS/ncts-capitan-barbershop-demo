import { useLocation } from 'react-router-dom'
import { BookingWizard } from '../components/booking/BookingWizard'

interface EstadoNavegacion {
  servicioId?: string
  barberoId?: string
}

export default function Reservar() {
  const location = useLocation()
  const estado = (location.state as EstadoNavegacion | null) ?? {}

  return (
    <BookingWizard
      servicioPreseleccionado={estado.servicioId}
      barberoPreseleccionado={estado.barberoId}
      onRestablecer={() => {}}
    />
  )
}

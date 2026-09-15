import { useNavigate } from 'react-router-dom'
import { Services } from '../components/public/Services'

export default function Servicios() {
  const navigate = useNavigate()
  return <Services onReservar={(servicioId) => navigate('/reservar', { state: { servicioId } })} />
}

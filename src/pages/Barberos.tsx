import { useNavigate } from 'react-router-dom'
import { Barbers } from '../components/public/Barbers'

export default function Barberos() {
  const navigate = useNavigate()
  return <Barbers onReservarCon={(barberoId) => navigate('/reservar', { state: { barberoId } })} />
}

import { Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/public/PublicLayout'
import Home from './pages/Home'
import Servicios from './pages/Servicios'
import Barberos from './pages/Barberos'
import Nosotros from './pages/Nosotros'
import Ubicacion from './pages/Ubicacion'
import Reservar from './pages/Reservar'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Agenda from './pages/admin/Agenda'
import Citas from './pages/admin/Citas'
import Clientes from './pages/admin/Clientes'
import BarberosAdmin from './pages/admin/BarberosAdmin'
import ServiciosAdmin from './pages/admin/ServiciosAdmin'
import Pagos from './pages/admin/Pagos'
import Recordatorios from './pages/admin/Recordatorios'
import Analitica from './pages/admin/Analitica'
import Configuracion from './pages/admin/Configuracion'
import { ToastProvider } from './components/ui/Toast'

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="barberos" element={<Barberos />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="ubicacion" element={<Ubicacion />} />
          <Route path="reservar" element={<Reservar />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="citas" element={<Citas />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="barberos" element={<BarberosAdmin />} />
          <Route path="servicios" element={<ServiciosAdmin />} />
          <Route path="pagos" element={<Pagos />} />
          <Route path="recordatorios" element={<Recordatorios />} />
          <Route path="analitica" element={<Analitica />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}

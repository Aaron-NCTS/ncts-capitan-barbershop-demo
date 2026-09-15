import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Barbero, Cita, Cliente, Configuracion, Recordatorio, Servicio, VisitaAnalitica } from '../types'
import { LLAVES, escribir, inicializarSiHaceFalta, leer, restablecerDatosDemo } from '../lib/storage'
import { generarId } from '../lib/utils'

interface AppDataContextValue {
  cargando: boolean
  servicios: Servicio[]
  barberos: Barbero[]
  clientes: Cliente[]
  citas: Cita[]
  recordatorios: Recordatorio[]
  analitica: VisitaAnalitica[]
  configuracion: Configuracion

  crearCita: (datos: Omit<Cita, 'id' | 'creadaEn'>) => Cita
  actualizarCita: (id: string, cambios: Partial<Cita>) => void
  obtenerOCrearCliente: (datos: Omit<Cliente, 'id' | 'creadoEn'>) => Cliente
  actualizarServicio: (id: string, cambios: Partial<Servicio>) => void
  crearServicio: (datos: Omit<Servicio, 'id'>) => void
  actualizarBarbero: (id: string, cambios: Partial<Barbero>) => void
  actualizarRecordatorio: (id: string, activo: boolean) => void
  actualizarConfiguracion: (cambios: Partial<Configuracion>) => void
  restablecerDemo: () => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [cargando, setCargando] = useState(true)
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([])
  const [analitica, setAnalitica] = useState<VisitaAnalitica[]>([])
  const [configuracion, setConfiguracion] = useState<Configuracion>({
    porcentajeAnticipo: 20,
    politicaCancelacion: '',
    metodosPago: ['tarjeta', 'mercado_pago'],
  })

  const cargarTodo = useCallback(() => {
    setServicios(leer(LLAVES.servicios, []))
    setBarberos(leer(LLAVES.barberos, []))
    setClientes(leer(LLAVES.clientes, []))
    setCitas(leer(LLAVES.citas, []))
    setRecordatorios(leer(LLAVES.recordatorios, []))
    setAnalitica(leer(LLAVES.analitica, []))
    setConfiguracion(
      leer(LLAVES.configuracion, {
        porcentajeAnticipo: 20,
        politicaCancelacion: '',
        metodosPago: ['tarjeta', 'mercado_pago'],
      }),
    )
    setCargando(false)
  }, [])

  useEffect(() => {
    inicializarSiHaceFalta()
    cargarTodo()
    const onListo = () => cargarTodo()
    const onStorage = () => cargarTodo()
    window.addEventListener('capitan:datos-listos', onListo)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('capitan:datos-listos', onListo)
      window.removeEventListener('storage', onStorage)
    }
  }, [cargarTodo])

  const crearCita = useCallback((datos: Omit<Cita, 'id' | 'creadaEn'>): Cita => {
    const nueva: Cita = { ...datos, id: generarId('cita'), creadaEn: new Date().toISOString() }
    setCitas((prev) => {
      const actualizado = [...prev, nueva]
      escribir(LLAVES.citas, actualizado)
      return actualizado
    })
    return nueva
  }, [])

  const actualizarCita = useCallback((id: string, cambios: Partial<Cita>) => {
    setCitas((prev) => {
      const actualizado = prev.map((c) => (c.id === id ? { ...c, ...cambios } : c))
      escribir(LLAVES.citas, actualizado)
      return actualizado
    })
  }, [])

  const obtenerOCrearCliente = useCallback(
    (datos: Omit<Cliente, 'id' | 'creadoEn'>): Cliente => {
      let resultado: Cliente | undefined
      setClientes((prev) => {
        const existente = prev.find(
          (c) => c.correo.toLowerCase() === datos.correo.toLowerCase() || c.telefono === datos.telefono,
        )
        if (existente) {
          resultado = existente
          return prev
        }
        const nuevo: Cliente = { ...datos, id: generarId('cli'), creadoEn: new Date().toISOString() }
        resultado = nuevo
        const actualizado = [...prev, nuevo]
        escribir(LLAVES.clientes, actualizado)
        return actualizado
      })
      // resultado se asigna sincrónicamente dentro del setter de React (batch), es seguro leerlo aquí
      return resultado as Cliente
    },
    [],
  )

  const actualizarServicio = useCallback((id: string, cambios: Partial<Servicio>) => {
    setServicios((prev) => {
      const actualizado = prev.map((s) => (s.id === id ? { ...s, ...cambios } : s))
      escribir(LLAVES.servicios, actualizado)
      return actualizado
    })
  }, [])

  const crearServicio = useCallback((datos: Omit<Servicio, 'id'>) => {
    setServicios((prev) => {
      const nuevo: Servicio = { ...datos, id: generarId('srv') }
      const actualizado = [...prev, nuevo]
      escribir(LLAVES.servicios, actualizado)
      return actualizado
    })
  }, [])

  const actualizarBarbero = useCallback((id: string, cambios: Partial<Barbero>) => {
    setBarberos((prev) => {
      const actualizado = prev.map((b) => (b.id === id ? { ...b, ...cambios } : b))
      escribir(LLAVES.barberos, actualizado)
      return actualizado
    })
  }, [])

  const actualizarRecordatorio = useCallback((id: string, activo: boolean) => {
    setRecordatorios((prev) => {
      const actualizado = prev.map((r) => (r.id === id ? { ...r, activo } : r))
      escribir(LLAVES.recordatorios, actualizado)
      return actualizado
    })
  }, [])

  const actualizarConfiguracion = useCallback((cambios: Partial<Configuracion>) => {
    setConfiguracion((prev) => {
      const actualizado = { ...prev, ...cambios }
      escribir(LLAVES.configuracion, actualizado)
      return actualizado
    })
  }, [])

  const restablecerDemo = useCallback(() => {
    restablecerDatosDemo()
    setTimeout(cargarTodo, 50)
  }, [cargarTodo])

  const value = useMemo<AppDataContextValue>(
    () => ({
      cargando,
      servicios,
      barberos,
      clientes,
      citas,
      recordatorios,
      analitica,
      configuracion,
      crearCita,
      actualizarCita,
      obtenerOCrearCliente,
      actualizarServicio,
      crearServicio,
      actualizarBarbero,
      actualizarRecordatorio,
      actualizarConfiguracion,
      restablecerDemo,
    }),
    [
      cargando,
      servicios,
      barberos,
      clientes,
      citas,
      recordatorios,
      analitica,
      configuracion,
      crearCita,
      actualizarCita,
      obtenerOCrearCliente,
      actualizarServicio,
      crearServicio,
      actualizarBarbero,
      actualizarRecordatorio,
      actualizarConfiguracion,
      restablecerDemo,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData debe usarse dentro de <AppDataProvider>')
  return ctx
}

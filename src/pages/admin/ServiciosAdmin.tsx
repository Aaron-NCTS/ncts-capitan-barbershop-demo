import { useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { Modal } from '../../components/ui/Modal'
import { formatoMoneda } from '../../lib/utils'
import { useToast } from '../../components/ui/Toast'
import type { Servicio } from '../../types'

const SERVICIO_VACIO: Omit<Servicio, 'id'> = {
  nombre: '',
  descripcion: '',
  duracionMinutos: 30,
  precio: 0,
  activo: true,
  barberosIds: [],
}

export default function ServiciosAdmin() {
  const { servicios, barberos, actualizarServicio, crearServicio } = useAppData()
  const { mostrarToast } = useToast()
  const [editando, setEditando] = useState<Servicio | null>(null)
  const [borrador, setBorrador] = useState<Omit<Servicio, 'id'>>(SERVICIO_VACIO)
  const [creando, setCreando] = useState(false)

  const abrirEdicion = (s: Servicio) => {
    setEditando(s)
    setBorrador(s)
  }

  const abrirCreacion = () => {
    setBorrador(SERVICIO_VACIO)
    setCreando(true)
  }

  const guardar = () => {
    if (!borrador.nombre.trim()) {
      mostrarToast('El servicio necesita un nombre.', 'aviso')
      return
    }
    if (editando) {
      actualizarServicio(editando.id, borrador)
      mostrarToast('Servicio actualizado.', 'exito')
      setEditando(null)
    } else {
      crearServicio(borrador)
      mostrarToast('Servicio creado.', 'exito')
      setCreando(false)
    }
  }

  const abierto = Boolean(editando) || creando
  const cerrar = () => {
    setEditando(null)
    setCreando(false)
  }

  const toggleBarbero = (id: string) => {
    setBorrador((prev) => ({
      ...prev,
      barberosIds: prev.barberosIds.includes(id) ? prev.barberosIds.filter((b) => b !== id) : [...prev.barberosIds, id],
    }))
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={abrirCreacion} className="flex items-center gap-2 rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ink">
          <Plus size={16} /> Nuevo servicio
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {servicios.map((s) => (
          <div key={s.id} className="rounded-sm border border-carbon-line bg-carbon p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-lg text-paper">{s.nombre}</p>
              <button onClick={() => abrirEdicion(s)} aria-label={`Editar ${s.nombre}`} className="text-cream-dim hover:text-gold">
                <Pencil size={15} />
              </button>
            </div>
            <p className="mt-1.5 text-sm text-cream-dim">{s.descripcion}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gold">{formatoMoneda(s.precio)}</span>
              <span className="text-cream-dim">{s.duracionMinutos} min</span>
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-cream-dim">
              <input type="checkbox" checked={s.activo} onChange={(e) => actualizarServicio(s.id, { activo: e.target.checked })} className="accent-gold" />
              Activo en el sitio público
            </label>
          </div>
        ))}
      </div>

      <Modal abierto={abierto} titulo={editando ? `Editar ${editando.nombre}` : 'Nuevo servicio'} onCerrar={cerrar}>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-cream-dim">Nombre</label>
            <input
              value={borrador.nombre}
              onChange={(e) => setBorrador((p) => ({ ...p, nombre: e.target.value }))}
              className="w-full rounded-sm border border-carbon-line bg-ink px-3 py-2 text-paper outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-cream-dim">Descripción</label>
            <textarea
              rows={2}
              value={borrador.descripcion}
              onChange={(e) => setBorrador((p) => ({ ...p, descripcion: e.target.value }))}
              className="w-full resize-none rounded-sm border border-carbon-line bg-ink px-3 py-2 text-paper outline-none focus:border-gold"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-cream-dim">Precio (MXN)</label>
              <input
                type="number"
                min={0}
                value={borrador.precio}
                onChange={(e) => setBorrador((p) => ({ ...p, precio: Number(e.target.value) }))}
                className="w-full rounded-sm border border-carbon-line bg-ink px-3 py-2 text-paper outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-cream-dim">Duración (min)</label>
              <input
                type="number"
                min={5}
                step={5}
                value={borrador.duracionMinutos}
                onChange={(e) => setBorrador((p) => ({ ...p, duracionMinutos: Number(e.target.value) }))}
                className="w-full rounded-sm border border-carbon-line bg-ink px-3 py-2 text-paper outline-none focus:border-gold"
              />
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs text-cream-dim">Barberos que ofrecen este servicio</p>
            <div className="flex flex-wrap gap-2">
              {barberos.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => toggleBarbero(b.id)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    borrador.barberosIds.includes(b.id) ? 'border-gold bg-gold/10 text-gold' : 'border-carbon-line text-cream-dim'
                  }`}
                >
                  {b.nombre}
                </button>
              ))}
            </div>
          </div>
          <button onClick={guardar} className="mt-2 w-full rounded-sm bg-gold py-2.5 text-sm font-medium text-ink">
            Guardar servicio
          </button>
        </div>
      </Modal>
    </div>
  )
}

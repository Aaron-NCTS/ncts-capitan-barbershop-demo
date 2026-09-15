import { useState } from 'react'
import type { FormEvent } from 'react'

export interface DatosClienteForm {
  nombre: string
  apellidos: string
  telefono: string
  whatsapp: string
  correo: string
  notas: string
}

interface Props {
  valorInicial: DatosClienteForm
  onContinuar: (datos: DatosClienteForm) => void
}

type Errores = Partial<Record<keyof DatosClienteForm, string>>

function validar(datos: DatosClienteForm): Errores {
  const errores: Errores = {}
  if (!datos.nombre.trim()) errores.nombre = 'Ingresa tu nombre.'
  if (!datos.apellidos.trim()) errores.apellidos = 'Ingresa tus apellidos.'
  if (!/^[\d\s+()-]{10,}$/.test(datos.telefono.trim())) errores.telefono = 'Ingresa un teléfono válido (mínimo 10 dígitos).'
  if (!/^[\d\s+()-]{10,}$/.test(datos.whatsapp.trim())) errores.whatsapp = 'Ingresa un WhatsApp válido (mínimo 10 dígitos).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) errores.correo = 'Ingresa un correo válido.'
  return errores
}

export function StepClientInfo({ valorInicial, onContinuar }: Props) {
  const [datos, setDatos] = useState<DatosClienteForm>(valorInicial)
  const [errores, setErrores] = useState<Errores>({})

  const actualizar = (campo: keyof DatosClienteForm, valor: string) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
  }

  const manejarSubmit = (e: FormEvent) => {
    e.preventDefault()
    const erroresValidacion = validar(datos)
    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length === 0) onContinuar(datos)
  }

  const campos: { campo: keyof DatosClienteForm; label: string; tipo?: string; requerido?: boolean }[] = [
    { campo: 'nombre', label: 'Nombre', requerido: true },
    { campo: 'apellidos', label: 'Apellidos', requerido: true },
    { campo: 'telefono', label: 'Teléfono', tipo: 'tel', requerido: true },
    { campo: 'whatsapp', label: 'WhatsApp', tipo: 'tel', requerido: true },
    { campo: 'correo', label: 'Correo electrónico', tipo: 'email', requerido: true },
  ]

  return (
    <div>
      <h3 className="font-display text-2xl text-paper">Tus datos</h3>
      <form onSubmit={manejarSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
        {campos.map(({ campo, label, tipo, requerido }) => (
          <div key={campo} className={campo === 'correo' ? 'sm:col-span-2' : ''}>
            <label htmlFor={campo} className="mb-1.5 block text-sm text-cream-dim">
              {label} {requerido && <span className="text-gold">*</span>}
            </label>
            <input
              id={campo}
              type={tipo ?? 'text'}
              value={datos[campo]}
              onChange={(e) => actualizar(campo, e.target.value)}
              aria-invalid={Boolean(errores[campo])}
              aria-describedby={errores[campo] ? `${campo}-error` : undefined}
              className={[
                'w-full rounded-sm border bg-ink px-3.5 py-2.5 text-paper outline-none transition-colors focus:border-gold',
                errores[campo] ? 'border-danger' : 'border-carbon-line',
              ].join(' ')}
            />
            {errores[campo] && (
              <p id={`${campo}-error`} className="mt-1 text-xs text-danger">
                {errores[campo]}
              </p>
            )}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label htmlFor="notas" className="mb-1.5 block text-sm text-cream-dim">
            Notas (opcional)
          </label>
          <textarea
            id="notas"
            rows={3}
            value={datos.notas}
            onChange={(e) => actualizar('notas', e.target.value)}
            placeholder="Alguna preferencia o detalle que debamos saber"
            className="w-full resize-none rounded-sm border border-carbon-line bg-ink px-3.5 py-2.5 text-paper outline-none transition-colors focus:border-gold"
          />
        </div>

        <button
          type="submit"
          className="sm:col-span-2 mt-2 rounded-sm bg-gold py-3 font-medium text-ink transition-transform hover:scale-[1.01]"
        >
          Continuar
        </button>
      </form>
    </div>
  )
}

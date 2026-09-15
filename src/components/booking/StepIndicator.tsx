const PASOS = ['Servicio', 'Barbero', 'Fecha', 'Horario', 'Tus datos', 'Confirmar']

export function StepIndicator({ pasoActual }: { pasoActual: number }) {
  return (
    <ol className="mb-10 flex items-center justify-between gap-1">
      {PASOS.map((label, i) => {
        const numero = i + 1
        const activo = numero === pasoActual
        const completado = numero < pasoActual
        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={[
                'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium sm:h-8 sm:w-8',
                completado
                  ? 'border-gold bg-gold text-ink'
                  : activo
                    ? 'border-gold text-gold'
                    : 'border-carbon-line text-cream-dim/50',
              ].join(' ')}
            >
              {numero}
            </div>
            <span
              className={[
                'hidden text-center text-[11px] sm:block',
                activo ? 'text-gold' : completado ? 'text-cream-dim' : 'text-cream-dim/40',
              ].join(' ')}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Capa de persistencia de la demo.
 *
 * En producción esto sería un backend real (API + base de datos). Para esta
 * demo comercial, usamos localStorage para que una reserva creada en el sitio
 * público aparezca de inmediato en el panel administrativo, sin necesidad de
 * levantar un servidor. Todas las llaves usan el prefijo `capitan_demo_`.
 */

const PREFIJO = 'capitan_demo_'

const LLAVES = {
  servicios: `${PREFIJO}servicios`,
  barberos: `${PREFIJO}barberos`,
  clientes: `${PREFIJO}clientes`,
  citas: `${PREFIJO}citas`,
  recordatorios: `${PREFIJO}recordatorios`,
  analitica: `${PREFIJO}analitica`,
  configuracion: `${PREFIJO}configuracion`,
  version: `${PREFIJO}version`,
} as const

// Incrementar cuando cambie la forma de los datos semilla para forzar reset.
const VERSION_DATOS = '4'

export function leer<T>(llave: string, valorDefecto: T): T {
  try {
    const crudo = window.localStorage.getItem(llave)
    if (!crudo) return valorDefecto
    return JSON.parse(crudo) as T
  } catch {
    return valorDefecto
  }
}

export function escribir<T>(llave: string, valor: T): void {
  try {
    window.localStorage.setItem(llave, JSON.stringify(valor))
  } catch {
    // Almacenamiento no disponible (modo privado, cuota excedida, etc.)
    // La demo continúa funcionando en memoria durante la sesión.
  }
}

export function inicializarSiHaceFalta(): void {
  const versionGuardada = window.localStorage.getItem(LLAVES.version)
  if (versionGuardada === VERSION_DATOS) return

  // Import diferido para evitar ciclo de dependencias con seed -> utils -> storage
  import('../data/seed').then((seed) => {
    escribir(LLAVES.servicios, seed.SERVICIOS_SEED)
    escribir(LLAVES.barberos, seed.BARBEROS_SEED)
    escribir(LLAVES.clientes, seed.CLIENTES_SEED)
    escribir(LLAVES.citas, seed.CITAS_SEED)
    escribir(LLAVES.recordatorios, seed.RECORDATORIOS_SEED)
    escribir(LLAVES.analitica, seed.ANALITICA_SEED)
    escribir(LLAVES.configuracion, {
      porcentajeAnticipo: 20,
      politicaCancelacion:
        'Las citas pueden reprogramarse hasta 12 horas antes sin costo. El anticipo no es reembolsable en cancelaciones con menos de 4 horas de anticipación.',
      metodosPago: ['tarjeta', 'mercado_pago'],
    })
    window.localStorage.setItem(LLAVES.version, VERSION_DATOS)
    window.dispatchEvent(new CustomEvent('capitan:datos-listos'))
  })
}

export function restablecerDatosDemo(): void {
  Object.values(LLAVES).forEach((llave) => window.localStorage.removeItem(llave))
  inicializarSiHaceFalta()
}

export { LLAVES }

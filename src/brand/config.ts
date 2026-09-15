/**
 * Configuración central de marca.
 *
 * Este archivo concentra todo lo que identifica al negocio dentro de la demo:
 * nombre, textos de marca, contacto, ubicación y reglas de negocio (como el
 * porcentaje de anticipo). Cambiar SOLO este archivo permite re-etiquetar la
 * demo completa para otro cliente sin tocar componentes.
 *
 * Datos de contacto y ubicación confirmados por el cliente. Instagram,
 * Facebook y correo se dejan vacíos a propósito: no están confirmados, así
 * que no se muestran en el sitio público hasta tenerlos.
 */

export const brand = {
  nombre: 'Capitán Barber Shop',
  nombreCorto: 'Capitán',
  claim: 'Más que un corte, una experiencia.',
  descripcion:
    'Cortes clásicos, afeitado tradicional y cuidado de barba, con la precisión de quien no improvisa.',

  admin: {
    nombrePanel: 'Capitán Control',
    poweredBy: 'Powered by NCTS',
  },

  desarrolladoPor: 'Demo desarrollada por NCTS',

  contacto: {
    telefono: '+52 55 3940 3837',
    whatsapp: '+52 55 3940 3837',
    correo: '',
    instagram: '',
    facebook: '',
  },

  ubicacion: {
    direccion: 'Primera Cerrada Cañaverales #3, Magisterial Coapa, Tlalpan',
    ciudad: 'Ciudad de México',
    codigoPostal: 'CDMX 14360',
    direccionCompleta:
      'Primera Cerrada Cañaverales #3, Magisterial Coapa, Tlalpan, Ciudad de México, CDMX 14360',
  },

  horarios: [
    { dia: 'Lunes a viernes', horario: '10:00 – 20:00' },
    { dia: 'Sábado', horario: '10:00 – 17:00' },
    { dia: 'Domingo', horario: '10:00 – 17:00' },
  ],

  reglasNegocio: {
    porcentajeAnticipo: 20,
    politicaCancelacion:
      'Las citas pueden reprogramarse hasta 12 horas antes sin costo. El anticipo no es reembolsable en cancelaciones con menos de 4 horas de anticipación.',
    duracionSlotMinutos: 30,
    horaAperturaDefault: '10:00',
    horaCierreDefault: '20:00',
  },
} as const

export type Brand = typeof brand

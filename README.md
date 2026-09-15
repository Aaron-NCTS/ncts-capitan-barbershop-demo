# Capitán Barber Shop — Demo comercial (NCTS)

Demo funcional de sitio web + panel administrativo para barbería, desarrollada
por **NCTS** como propuesta para Capitán Barber Shop. Sustituye una solución
basada en WordPress/Elementor/Bookly por una plataforma a la medida.

Incluye:

- **Sitio público**: hero, servicios, barberos, nosotros, ubicación/contacto
  y un asistente de reservación paso a paso con cálculo automático de
  anticipo (20%) y simulación de pago.
- **Panel administrativo "Capitán Control"**: dashboard con KPIs y
  gráficas, agenda (día/semana/mes), gestión de citas, mini CRM de clientes,
  administración de barberos y servicios, módulo de pagos, automatizaciones
  de recordatorios, analítica del sitio y configuración general.
- Una reserva creada en el sitio público aparece de inmediato en el panel
  administrativo — la demo simula el backend con `localStorage`.

## Cómo ejecutar la demo

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

Para generar una build de producción:

```bash
npm run build
npm run preview
```

Los archivos listos para publicar quedan en `dist/`.

## Acceso al panel administrativo

Desde el sitio público, el enlace **"Acceso administrativo"** en el pie de
página lleva a `/admin`. En esta demo no hay autenticación (se agrega en la
versión final); todo el panel es visible directamente en esa ruta.

## Estructura del proyecto

```
src/
  brand/config.ts        Marca, contacto, horarios y reglas de negocio (punto único de edición)
  types/                 Tipos de datos compartidos (citas, clientes, servicios...)
  data/seed.ts            Datos iniciales de demostración
  lib/                    Utilidades: storage (localStorage), disponibilidad de horarios, métricas
  context/                Estado global de la app (AppDataContext)
  components/
    public/               Secciones del sitio público (Header, Hero, Services...)
    booking/               Asistente de reservación paso a paso
    ui/                    Componentes reutilizables (Toast, Modal, Badge, KpiCard)
  pages/
    PublicSite.tsx         Página pública completa
    admin/                 Páginas del panel administrativo
```

## Dónde cambiar cada cosa

| Qué quieres cambiar                          | Dónde                                  |
| --------------------------------------------- | --------------------------------------- |
| Nombre, contacto, ubicación, horarios         | `src/brand/config.ts`                   |
| Porcentaje de anticipo por defecto            | `src/brand/config.ts` (`reglasNegocio`) y luego editable en Configuración |
| Servicios y precios de arranque               | `src/data/seed.ts` (`SERVICIOS_SEED`)   |
| Barberos y horarios de arranque               | `src/data/seed.ts` (`BARBEROS_SEED`)    |
| Fotografías (hero, nosotros, barberos)        | Sustituir los bloques placeholder marcados en `Hero.tsx`, `About.tsx` y `Barbers.tsx` por `<img>` reales |
| Paleta de colores y tipografías               | `src/index.css` (bloque `@theme`)       |

Todos los datos de contacto y ubicación (dirección, teléfono/WhatsApp,
horarios) son los reales, confirmados por el cliente. Los servicios
**Corte ($150)**, **Corte y barba ($270)** y **Corte, barba y facial
($370)** son la carta real; el resto de servicios (afeitado, arreglo de
barba, perfilado) se mantienen como variedad adicional para mostrar el
sistema de reservas. Instagram, Facebook y correo del negocio no están
confirmados todavía, así que no aparecen en el sitio público.

Las métricas del dashboard, los clientes, el historial de citas, los
barberos y la analítica siguen siendo datos ficticios pensados para
demostrar el funcionamiento del sistema — dentro del panel administrativo
se señalan con la etiqueta "Datos de demostración".

## Restablecer los datos de la demo

En el panel administrativo, la sidebar tiene un botón **"Restablecer datos
demo"** que borra todo lo capturado durante la sesión (citas, clientes
nuevos, cambios de configuración) y vuelve a cargar los datos de arranque.

## Próximos pasos hacia producción

- Reemplazar `localStorage` por un backend real (API + base de datos).
- Integrar pasarela de pago real (Mercado Pago o Stripe) en el paso de
  anticipo.
- Conectar analítica real (Google Analytics / Meta Pixel) en lugar de las
  métricas ilustrativas.
- Agregar autenticación al panel administrativo.
- Sustituir fotografías, textos y datos de contacto por la información
  verificada del negocio.

---

Demo desarrollada por NCTS.

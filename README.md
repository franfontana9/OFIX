# OFIX Connect

Aplicación web del MVP de **OFIX**: marketplace de doble lado que conecta **usuarios**
(hogares y PyMEs gastronómicas) con **trabajadores de oficios verificados** —
plomería, electricidad, gas, cerrajería, pintura y más — para urgencias y
servicios del hogar en CABA/GBA.

> «Tu solución confiable, a un clic»

Desarrollado como parte del Trabajo Final de Graduación (TFG).

## Pilares del producto

1. **Verificación / KYC** — identidad, antecedentes y matrícula desde el onboarding.
2. **Geolocalización** — profesionales cercanos, distancia y mapa real.
3. **Pago protegido (escrow)** — los fondos se retienen y se liberan al profesional
   recién cuando el cliente valida el trabajo.
4. **Seguro por servicio** — cobertura opcional por trabajo; OFIX intermedia.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **React Router v6** (SPA)
- **Tailwind CSS** + **shadcn/ui** (Radix) · íconos `lucide-react` · toasts `sonner`
- **zustand** para autenticación
- **Leaflet + OpenStreetMap** para el mapa (sin API key)
- **Sin backend**: todo el estado vive en `localStorage` a través del singleton
  `src/lib/store.ts`. Los métodos son síncronos y simulan pagos, escrow, KYC y
  notificaciones.

## Cómo correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # sirve el build de producción
```

## Usuarios de prueba

Se cargan solos en el primer arranque. Contraseña para todos: `password123`.

| Email | Rol |
| --- | --- |
| `maria@example.com` | Cliente (hogar) |
| `bodegon@example.com` | Cliente (PyME gastronómica) |
| `carlos@example.com` | Cliente (hogar) |
| `juan@example.com` | Trabajador — Plomería / Gas (nivel Gold) |
| `ana@example.com` | Trabajadora — Electricidad / Aire |
| `diego@example.com` | Trabajador — Cerrajería |
| `lucia@example.com` | Trabajadora — Pintura |

> Para volver al estado inicial: borrar las claves `ofix-data` y `ofix-token` de
> localStorage y recargar. Al cambiar el esquema de datos hay que subir
> `DATA_VERSION` en `src/lib/store.ts` para forzar el re-seed.

## Estructura

```
src/
├── lib/
│   ├── types.ts      Modelo de dominio (User, Offer, Proposal, Job, Payment, Receipt…)
│   ├── store.ts      Capa de datos: CRUD, seed, escrow, KYC, wallet, estadísticas
│   ├── auth.ts       Store de autenticación (zustand)
│   ├── image.ts      Redimensiona adjuntos antes de persistirlos
│   ├── theme.ts      Modo oscuro
│   └── trust.ts      Cálculo del trust score
├── components/
│   ├── AppLayout.tsx Shell responsive (sidebar colapsable + bottom nav mobile)
│   ├── ofix/         Librería de la app (PageHeader, WorkerCard, Calendar, RealMap…)
│   └── ui/           Primitivos shadcn/ui
└── pages/
    ├── u/            Recorrido del cliente
    └── w/            Recorrido del trabajador
```

## Funcionalidades

Registro/login con KYC · perfiles con foto, oficio y zona · búsqueda y filtros ·
solicitudes con fotos y urgencia (inmediata / en el día / programada) · propuestas
y comparación de ofertas · reputación mutua con reseñas · pago digital con **escrow**
y comprobante imprimible · seguro por servicio · chat interno con adjuntos ·
agenda con calendario (reprogramar y cancelar) · notificaciones · favoritos ·
botón de **emergencia (SOS)** · panel PyME con facturación mensual · cobros y
wallet del trabajador · estadísticas e insights · niveles Bronze/Silver/Gold ·
suscripción premium · explorar sin registro · modo oscuro.

## Documentación del proyecto

- [`OFIX-SPEC.md`](OFIX-SPEC.md) — especificación funcional y MoSCoW (fuente de la verdad).
- [`memory/`](memory/) — progreso, pendientes, reglas de trabajo y bitácora.
- [`_reference/`](_reference/) — material de referencia del port original.

## Deploy

Preparado para Vercel con preset **Vite** (build `npm run build`, output `dist`).
El `vercel.json` incluye el rewrite necesario para que las rutas del cliente
funcionen al recargar o entrar directo por URL.

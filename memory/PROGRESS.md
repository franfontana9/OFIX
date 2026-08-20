# OFIX Connect — Progreso y estado del proyecto

> Última actualización: 2026-08-20

## Qué es
Réplica + evolución de **OFIX**: marketplace argentino de **oficios verificados** (plomería,
electricidad, gas, cerrajería, pintura, etc.) que conecta **usuarios/PyMEs** con **trabajadores**
para urgencias y servicios del hogar. Doble lado. Pilares: **verificación/KYC, geolocalización,
pago protegido (escrow), seguro por servicio**. Eslogan: «Tu solución confiable, a un clic».

## Stack
- Vite + React 18 + TypeScript + React Router v6 + Tailwind + shadcn/ui + zustand + sonner.
- **Sin backend**: todo el estado en `localStorage` vía el singleton `src/lib/store.ts`.
- Mapa real: **Leaflet + OpenStreetMap** (`react-leaflet`). Sin API key.
- Fotos demo: avatares de `randomuser.me`, fotos temáticas de `loremflickr.com` (fallback a placeholder).
- Correr: `npm run dev` (http://localhost:5173) · `npm run build` (tsc -b && vite build).
- Usuarios demo (pass `password123`): maria@example.com (cliente hogar), bodegon@example.com (PyME),
  juan@example.com (trabajador Gold), ana@example.com (trabajadora).
- **DATA_VERSION** en store.ts: al subirla se re-seedea el localStorage (limpia datos viejos).

## Arquitectura
- `src/lib/types.ts` — modelo de dominio (User, Offer, Proposal, Service, Job, Payment, Review,
  Favorite, Notification, Chat, Message, Payout; enums + labels; CATEGORIES, INSURANCE_PLANS).
- `src/lib/store.ts` — data layer singleton (CRUD sync + seed rico + escrow, KYC, emergencia,
  favoritos, notificaciones, wallet, stats, getChatContext).
- `src/lib/auth.ts` — zustand `useAuth`. `src/lib/theme.ts` — dark mode. `src/lib/trust.ts` — trust score.
- `src/lib/image.ts` — redimensiona/comprime adjuntos antes de guardarlos en localStorage (≤220 KB).
- `src/App.tsx` — rutas con `React.lazy` + `Suspense` (**code-splitting por ruta**);
  fallback en `src/components/PageFallback.tsx`.
- `src/components/AppLayout.tsx` — shell responsive (sidebar colapsable desktop + bottom nav mobile).
- `src/components/ofix/*` — librería: PageHeader, WorkerCard, StarRating, badges, CategoryIcon,
  UserAvatar, StatCard, PriceBreakdown, Stepper, ImageUploader, AvatarUploader, EmptyState,
  Skeleton, ServiceThumb, RealMap, Calendar, RescheduleDialog, EmergencyButton.
- `src/index.css` — tokens EXACTOS del original (azul primary, naranja accent, verde success) +
  animaciones (page-in, shimmer, pop, ofixping) + accesibilidad (focus-visible, reduced-motion)
  + `@media print` para comprobantes (`.print-sheet` imprime, `.print-hide` se oculta).
- `OFIX-SPEC.md` — fuente de la verdad funcional (MoSCoW, modelo, reglas de negocio).

## Pantallas (~48)
- **Públicas**: Landing, Explorar (sin registro), Perfil público de trabajador (`/p/:id`), 404.
- **Auth**: Login (Google/Apple simulados), Registro (wizard por rol + KYC), Recuperar, Onboarding.
- **Cliente `/u/*`**: Home, Buscar (filtros + mapa real), Perfil trabajador, Nueva solicitud (fotos+urgencia),
  Mis solicitudes, Detalle+ofertas (comparación), Contratar, Pago/escrow, Mis trabajos, Detalle/seguimiento,
  Reseña, Favoritos, Emergencia (SOS + mapa), Panel PyME, Agenda (calendario), Chat, Notificaciones, Perfil, Config.
- **Trabajador `/w/*`**: Dashboard, Buscar trabajos, Detalle+enviar oferta, Publicar servicios, Nuevo/Editar
  servicio, Mis propuestas, Mis acuerdos, Detalle acuerdo, Calificar cliente, Cobros/wallet, Estadísticas
  (gráfico + insights), Perfil del cliente, Agenda, Chat, Notificaciones, Perfil (verificación/nivel), Verificación, Premium, Config.

## Funcionalidades implementadas (MoSCoW MUST+SHOULD + varias COULD)
Registro/login + KYC, perfiles con foto, búsqueda/filtros, solicitudes con fotos y urgencia
(Inmediata/En el día/Programada), ofertas/propuestas + comparación, reputación mutua (estrellas+reseñas,
contextuales), pago digital + **escrow**, seguro por servicio, onboarding, **geolocalización con mapa real**,
chat interno (typing/leído/contexto + **adjuntar foto real**), agenda con **calendario** y **reprogramar/cancelar**,
historial de trabajos, notificaciones agrupadas + badges, favoritos, botón de **emergencia (SOS)**,
panel PyME B2B con **facturación mensual**, **comprobante imprimible** (tipo A/B) por trabajo pagado,
cobros/wallet, estadísticas + insights, niveles Bronze/Silver/Gold, suscripción premium,
**explorar sin registro**, **dark mode**, skeletons, empty states, trust score, accesibilidad WCAG básica.

## Pantallas nuevas / cambios recientes (2026-08-20)
- `/u/jobs/:id/receipt` — **comprobante** imprimible (`window.print()` → PDF del navegador).
- Panel PyME (`/u/business`) — facturación agrupada por mes con acceso a cada comprobante.
- Agendas (`/u/agenda`, `/w/agenda`) — reprogramar (ambos lados) y cancelar (cliente).

## UX/UI
- Tipografía Plus Jakarta Sans. Sidebar colapsable. Animaciones sutiles + glows en activo/CTA.
- Documento de propuestas UX/UI (artifact): ver RECOMMENDATIONS.md.

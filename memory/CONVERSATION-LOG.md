# OFIX Connect — Bitácora de conversación

> Resumen cronológico de lo que fuimos haciendo (para continuidad).

## Sesión 2026-07-12
1. **Fidelidad base**: se auditó el prototipo (19 pantallas) contra el bundle original; 2 íconos
   corregidos (Cobros: Wallet→DollarSign; Perfil worker: Briefcase→Wrench). Build limpio.
2. **Investigación OFIX**: se leyó la tesis (TFG) + wireframes + MoSCoW + tabla competitiva.
   Se creó `OFIX-SPEC.md`. Decisión clave: urgencia no es 1-5 → enum Inmediata/En el día/Programada.
3. **Rebuild completo**: modelo de datos nuevo, `store` ampliado, `AppLayout` responsive, ~40 pantallas
   nuevas construidas (auth wizard+KYC, flujo cliente end-to-end con escrow, flujo trabajador, chat,
   notificaciones, agenda, favoritos, emergencia SOS, panel PyME, cobros, stats, niveles, premium).
4. **Fix pantalla en blanco**: versionado de datos (re-seed) + ErrorBoundary + guardas en badges.
5. **Correcciones del usuario**: fotos en servicios; historial de trabajos en perfiles; unificación del
   botón de emergencia; tipografía Plus Jakarta + animación de página.
6. **15 propuestas UX/UI** (artifact con research) → se implementaron TODAS: mapa real (Leaflet/OSM),
   trust score + reseñas contextuales, explorar sin registro, escrow claro, filtros avanzados, skeletons,
   microinteracciones, notificaciones agrupadas + badge, comparación de propuestas, insights de trabajador,
   accesibilidad, avatar upload, dark mode con toggle, chat enriquecido, sistema de diseño.
7. **Batch de detalles**: fotos reales (randomuser + loremflickr), popup del mapa con card, foto de perfil
   para todos, calendario en Agenda, contexto en mensajes (sobre qué trabajo), sidebar colapsable, carpeta memory/.
8. **Pedido abierto**: hacer una pantalla "más estética/profesional con glow" (screenshot no cargó → confirmar cuál).

## Sesión 2026-08-20
**Pedido:** «leé todo el proyecto y sigamos con el MVP».
Se leyó todo (memory/, OFIX-SPEC.md, HANDOFF.md, store/types/App y las pantallas afectadas) y se
cerraron 4 huecos concretos del MVP que no dependen de servicios externos:

1. **Comprobante / facturación** (cerraba el gap de SPEC §7 «PyME: panel, factura/SLA», que hasta
   ahora era sólo texto de marketing). `store.getReceipt/getReceipts/getBillingPeriods` + tipos
   `Receipt`/`BillingPeriod` (documentos **derivados**, no se persisten). Página `/u/jobs/:id/receipt`
   imprimible (`window.print()`) con reglas `@media print` en `index.css` (`.print-sheet` / `.print-hide`).
   Tipo **A** para PyME, **B** para consumidor final; numeración correlativa `OFIX-0001-XXXXXXXX`.
   Enlazado desde el detalle del trabajo y desde el Panel PyME (facturación agrupada por mes).
2. **Agenda editable**: `store.rescheduleJob(id, fecha)` (valida partes, estado y fecha; notifica a la
   contraparte) + `RescheduleDialog` reusado en las agendas de cliente y trabajador. Se le agregó
   **autorización a `cancelJob`** (antes cualquiera podía cancelar cualquier trabajo) y se expuso
   "Cancelar" en la agenda del cliente. Ambas agendas ahora separan Próximos / Pasados.
3. **Chat con imagen real** (antes mandaba el string "📷 Foto adjunta"): `Message.image`,
   `createMessage(chatId, text, image?)`, y `src/lib/image.ts` que redimensiona a 900 px / JPEG con
   calidad decreciente hasta entrar en 220 KB. `saveToStorage()` ahora devuelve boolean y el envío
   con foto **revierte** el mensaje si el navegador rechaza la escritura por cuota.
4. **Code-splitting** por ruta (`React.lazy` + `Suspense` con `PageFallback`): bundle inicial
   **780 kB → 297 kB** (gzip 220 → 93 kB); Leaflet quedó en un chunk propio de 157 kB que sólo baja
   al entrar al mapa. Desapareció el warning de >500 kB.

**DATA_VERSION 4 → 5** (por `Message.image`): el localStorage viejo se re-seedea solo.
**Verificación:** `npm run build` limpio (1790 módulos) + smoke test del store con `localStorage`
stubeado — 25 asserts en verde (comprobantes A/B, totales, agrupación mensual, reprogramar,
autorizaciones, mensajes con imagen y persistencia).

**Pendiente de decisión del usuario:** el «pase estético premium» sigue esperando que confirme
QUÉ pantalla priorizar (el screenshot de la sesión anterior no se pudo cargar).

## Convención de esta bitácora
Agregar una entrada por sesión/hito con: qué se pidió, qué se hizo, y qué quedó pendiente.

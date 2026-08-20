# OFIX Connect — Tareas pendientes

> Actualizar a medida que se completan/agregan.
> **La fuente de la verdad del backlog es [`TESIS-GAP.md`](TESIS-GAP.md)**: matriz de cumplimiento
> tesis → app, con la sección del TFG que exige cada ítem. Este archivo es el resumen operativo.

## Prioridad según la tesis (ver TESIS-GAP.md)
- [ ] **Bloque A — Legal**: T&C, Política de Privacidad (Ley 25.326), contrato del trabajador
      (sin relación laboral), aceptación en el registro, disclaimer del seguro, flujo de reclamos.
      *La sección 6 de la tesis no tiene NINGÚN reflejo en el producto.* ← empezar por acá
- [ ] **Bloque B — Fidelidad al prototipo (2.12)**: subtítulo de la landing, «Ofrece servicios»,
      buscador central, «Ofertas recibidas» en el home, 4ª métrica del dashboard del trabajador.
- [ ] **Bloque C — Deuda de usabilidad (2.12.7)**: la tesis detectó que «historial y gestión de
      propuestas» tiene demasiados pasos. Sin atender.
- [ ] **Bloque E1 — Tests**: no hay suite.
- [ ] **Bloque D — Integraciones reales**: documentar como simuladas, no construir (necesitan
      backend, credenciales o convenios).

## En curso / próximo
- [ ] **Pase estético "premium"**: glows, gradientes y microanimaciones más marcadas (pedido del usuario).
      Confirmar con el usuario QUÉ pantalla priorizar (mandó screenshot que no se pudo cargar).

## Faltantes conocidos (de la lista de propuestas UX/UI)
- [ ] **Google Maps real** (hoy Leaflet/OSM). Requiere API key + facturación Google Cloud.
- [x] **Factura / comprobante** para PyMEs — hecho 2026-08-20 (tipo A/B, imprimible, facturación mensual).
- [x] **Agenda editable** — hecho 2026-08-20 (reprogramar en ambos lados + cancelar del cliente).
- [ ] **Login social real** Google/Apple (hoy simulado con toast) + recuperación real de contraseña.
      *Bloqueado sin backend: requiere OAuth server-side.*
- [ ] **Notificaciones push reales** (hoy in-app/mock). *Requiere service worker + backend.*
- [x] **Chat: adjuntar imagen real** — hecho 2026-08-20 (redimensiona a ≤220 KB y persiste).
- [ ] **Chat**: estados de leído reales (hoy inferidos del último mensaje del otro).
- [ ] **Pase responsive/mobile** fino pantalla por pantalla (bottom nav ok; revisar cada view chica).
- [ ] **Backend real** (persistencia server, auth JWT real, base de datos) — hoy todo en localStorage.
- [ ] **Tests** (unit/e2e) — no hay suite en el repo. Hay un smoke test manual del store
      (ver CONVERSATION-LOG 2026-08-20); formalizarlo con Vitest sería el próximo paso.
- [x] **Code-splitting** del bundle — hecho 2026-08-20 (780 kB → 297 kB; Leaflet en chunk aparte).

## Ideas / mejoras futuras
- [ ] Matching recomendado (curado, no IA) más visible.
- [ ] Filtros guardados / búsquedas recientes.
- [ ] Reprogramar / cancelar trabajos con políticas.
- [ ] Panel de métricas del marketplace (time-to-match, fill rate) para admin.

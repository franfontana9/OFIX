# OFIX Connect — Recomendaciones (para siempre)

## Documento de propuestas UX/UI (research aplicado)
Artifact con 15 propuestas priorizadas (P0/P1/P2) y research 2025-2026:
https://claude.ai/code/artifact/a8c9326f-97d8-4a55-aa79-3b5810340894
(La mayoría ya implementadas; ver PROGRESS.md. Quedan las de PENDING.md.)

## Principios de diseño OFIX
1. **La confianza es la conversión** — verificación visible, reseñas, seguro, pago protegido primero.
2. **Autonomía del usuario** — el cliente elige (perfil/precio/cuándo). Match manual = ventaja del MVP.
3. **Mobile-first, thumb-zone** — bottom nav 3-5 tabs, targets ≥44px.
4. **Velocidad percibida** — skeletons, respuestas optimistas, transiciones suaves.
5. **Estética profesional** — tipografía cuidada, jerarquía, gradientes/glows sutiles, consistencia total.

## Recomendaciones técnicas a futuro
- Migrar a **backend real** (auth JWT, DB) manteniendo la interfaz del `store` para no romper la UI.
- **Code-splitting** por ruta (lazy) para bajar el bundle (Leaflet pesa).
- **Tests** e2e de los flujos núcleo (solicitud→oferta→pago→reseña; emergencia; cobros).
- **Accesibilidad**: auditar contraste en dark mode y estados de foco en todos los interactivos.
- **Analytics del marketplace**: instrumentar time-to-match, fill rate, cancel rate, disputas.

## Cómo retomar trabajo (para próximas sesiones)
1. Leer `memory/PROGRESS.md`, `PENDING.md`, `RULES.md`, este archivo y `CONVERSATION-LOG.md`.
2. Leer `OFIX-SPEC.md` (spec funcional) si hay dudas de producto.
3. `npm run dev`, loguear con usuarios demo, y trabajar sobre lo que marque el usuario.
4. Para tareas grandes: usar el contrato en `scratchpad/PAGE-CONTRACT.md` y paralelizar con subagentes
   en archivos disjuntos; nunca dejar que dos toquen `store.ts`/`types.ts`/`App.tsx`/componentes compartidos a la vez.

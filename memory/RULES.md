# OFIX Connect — Reglas, decisiones y preferencias

## Reglas de trabajo (cómo construir en este proyecto)
- **Fidelidad y coherencia**: mantener los tokens de diseño de `src/index.css` (azul primary, naranja
  accent, verde success). No cambiarlos sin pedido explícito.
- **Sin backend**: toda la data en `src/lib/store.ts` (localStorage). Métodos síncronos. Al cambiar el
  esquema, subir `DATA_VERSION` para re-seedear.
- **TS-clean**: el build corre `tsc -b`. Evitar `any` donde haya tipo; `as` permitido.
- **Componentes**: cada pantalla es default export dentro de `AppLayout` (usa `PageHeader`, no wrappers
  `min-h-screen`). Reusar la librería en `src/components/ofix/*` antes de crear algo nuevo.
- **Español (Argentina)** en toda la UI. Money: `$${n.toLocaleString()}`. Fechas: `es-AR`.
- **Contrato de autoría** para tareas grandes: `scratchpad/PAGE-CONTRACT.md` (API de store/tipos/componentes).
- Verificar con `npm run build` (limpio) después de cada bloque de cambios.

## Decisiones de producto tomadas
- **Urgencia** = enum `Inmediata / En el día / Programada` (la tesis no define escala 1-5).
- **Diseño**: responsive **desktop-first**, luego mobile. Sidebar colapsable en desktop, bottom nav (5) en mobile.
- **Alcance**: construir TODO el MUST+SHOULD del MoSCoW + varias COULD.
- **Emergencia (SOS)**: un solo botón (Home cliente / PyME), no duplicado en sidebar.
- **Comisión OFIX**: 15% al cliente (escrow). Trabajador recibe el neto en su wallet al validarse el trabajo.
- **Mapa**: Leaflet + OpenStreetMap (real, gratis). Google Maps queda para producción.
- **Fotos demo**: randomuser.me (avatares) + loremflickr.com (temáticas), con fallback a placeholder.

## Preferencias del usuario (observadas)
- Quiere la app **completa** y al **estándar OFIX** de la tesis, no un prototipo básico.
- Le importa el **detalle visual**: fotos reales, estética profesional, **glows/animaciones**, buen uso del espacio.
- Trabaja iterando con screenshots y feedback puntual; espera que se arreglen los detalles que marca.
- Pide continuidad: mantener esta carpeta `memory/` (progreso, pendientes, reglas, recomendaciones).
- Da luz verde a construir en bloque ("hacé todo") y a paralelizar.

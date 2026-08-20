# OFIX — Matriz de cumplimiento tesis → app

> Fuente: `TFG-OFIX-Final-Unificado.docx` leído completo el 2026-08-20 (secciones 2.3, 2.5, 2.6,
> 2.12, 3.5, 6.1–6.4, 7.2). Cada ítem cita la sección de la tesis que lo exige.
> Estado verificado contra el código, no contra `OFIX-SPEC.md` (que es un resumen derivado).

## Hallazgo de contexto: el alcance del MVP ya está cumplido

El **MoSCoW de la tesis (2.5)** pide en *Must Have*: registro/login, perfiles, búsqueda y filtrado,
solicitud de trabajo, reputación básica, pagos digitales in-app, onboarding e integración básica
con aseguradoras. **Todo eso está.**

Más aún: el **roadmap (2.6.2)** ubica chat interno, calendario, módulo de presupuestos, panel B2B
y notificaciones en la **v2.0 — 2027**, y la app ya los tiene. El panel de estadísticas del
trabajador (2.6.3, v3.0 2028) también está.

**Conclusión:** lo que falta no es funcionalidad del MVP. Es (A) el capítulo legal, que no tiene
ningún reflejo en el producto, (B) fidelidad literal al prototipo documentado, y (C) la deuda de
usabilidad que la propia tesis detectó. Las integraciones reales las diferí a su propio roadmap.

---

## A. Capítulo legal — el hueco más grande (tesis 6.1–6.4)

La sección 6 dedica cuatro subcapítulos al marco legal. **La app no tiene nada de esto.** Es lo más
barato de construir y lo más visible en una defensa.

| # | Qué pide la tesis | Sección | Estado |
|---|---|---|---|
| A1 | **Términos y Condiciones** (responsabilidades, rol de intermediación, alcances, tarifas, reclamos) | 6.1 | ❌ No existe |
| A2 | **Política de Privacidad** + manejo de datos bajo **Ley 25.326** | 6.1 | ❌ No existe |
| A3 | **Contrato de uso para trabajadores**: explícito que *no existe relación laboral* | 6.1 | ❌ No existe |
| A4 | OFIX es **intermediario**, no asume responsabilidad civil directa | 6.1 | ⚠️ Solo como frase en Landing y en el comprobante; no hay documento |
| A5 | **Contrato marco B2B + SLA** para PyMEs gastronómicas | 6.1 / 6.3 | ⚠️ El panel PyME dice "SLA" pero no hay documento ni tiempos definidos |
| A6 | Aceptación de T&C y privacidad **en el registro** (consentimiento de datos) | 6.2 | ❌ El wizard no lo pide |
| A7 | Seguro: el usuario paga, OFIX **no toma riesgo indemnizatorio**, solo facilita el canal | 6.3 | ⚠️ El flujo existe; falta el disclaimer legal en el punto de compra |
| A8 | **Protocolo de reclamos / disputas** y prevención de fraude | 6.2 / 6.3 | ❌ No hay flujo de reclamo ni disputa |

## B. Fidelidad al prototipo documentado (tesis 2.12)

La tesis describe el prototipo pantalla por pantalla con copy textual. Estas diferencias son
verificables por un jurado que lea el documento con la app al lado.

| # | Qué pide la tesis | Sección | Estado |
|---|---|---|---|
| B1 | Subtítulo «Conectamos usuarios con trabajadores verificados de oficios. Rápido, seguro y confiable.» | 2.12.2 | ❌ No está en ninguna pantalla |
| B2 | Los dos caminos de entrada: «Encontrá profesional» / **«Ofrece servicios»** | 2.12.2 | ⚠️ El primero está; el segundo usa otro texto |
| B3 | **Buscador central en la landing**: tipo de servicio + ubicación | 2.12.2 | ❌ La landing no tiene buscador |
| B4 | Tercer acceso directo en el home del usuario: **«Ofertas recibidas»** | 2.12.4 | ❌ Están los otros dos (Nueva solicitud, Buscar profesionales) |
| B5 | Dashboard del trabajador con **4** métricas: propuestas enviadas, trabajos activos, calificación promedio, ingresos del mes | 2.12.5 | ⚠️ Faltan "Propuestas enviadas" |
| B6 | Cuentas demo que entran **con cualquier contraseña** | 2.12.3 | ❌ Exige `password123` |
| B7 | Cobros con historial que distinga **transferencia bancaria vs Mercado Pago** | 2.12.5 | ⚠️ El wallet no discrimina el medio de retiro |

> ⚠️ **Erratas de la tesis a corregir en el `.docx`**, no en el código:
> - 2.12.4 dice «Bienvenido a **OFFICE**» — debe ser OFIX.
> - 2.12.3 dice que las cuentas demo entran con cualquier contraseña; si dejamos `password123`,
>   hay que corregir el documento. Una de las dos cosas tiene que ceder.

## C. Deuda de usabilidad que la tesis misma detectó (2.12.7)

| # | Hallazgo textual de la tesis | Estado |
|---|---|---|
| C1 | «Existen oportunidades de mejora en tareas específicas relacionadas con el **historial y la gestión de propuestas**, principalmente en términos de eficiencia» | ❌ Sin atender |
| C2 | «priorizando ajustes sobre los flujos con **mayor cantidad de pasos**» | ❌ Sin medir ni optimizar |
| C3 | «mejorando la **visibilidad de secciones sensibles** como solicitudes y cobros» | ❌ Sin atender |

Esto es deuda explícita: la tesis documenta el testeo, saca la conclusión y la deja escrita. Un
jurado puede preguntar «¿y qué hicieron con este hallazgo?».

## D. Integraciones reales — requieren plata, backend o credenciales

La tesis las nombra, pero su propio roadmap las ubica más adelante. **No son bloqueantes del MVP**;
lo honesto es documentarlas como simuladas y explicar por qué.

| # | Qué pide | Sección | Hoy | Qué haría falta |
|---|---|---|---|---|
| D1 | **Google Maps** para geolocalización | 7.2.1 | Leaflet + OpenStreetMap | API key + facturación Google Cloud |
| D2 | **Mercado Pago** real con *split* de fondos | 7.2.2 | Simulado (escrow en localStorage) | Credenciales de producción + backend |
| D3 | **Modo** y **Ualá** como medios de pago | 2.3 | Solo MP, efectivo, transferencia | Integraciones + backend |
| D4 | **RENAPER / KYC** real | 2.3 | Checkboxes simulados | Convenio + API |
| D5 | **APIs de aseguradoras** | 2.3 | 2 planes hardcodeados | Acuerdo marco (la tesis lo pone en 6.1) |
| D6 | **Backend en la nube (AWS/GCP) + API REST** | 2.3 | Todo en localStorage | Infraestructura |
| D7 | **App móvil (Flutter / React Native)** | 2.3 | Web responsive | Proyecto aparte |
| D8 | **Notificaciones push** | 7.2.3 | In-app | Service worker + backend |

## E. Calidad de entrega

| # | Ítem | Estado |
|---|---|---|
| E1 | Tests (unit / e2e de los flujos núcleo) | ❌ No hay suite |
| E2 | Pase responsive fino pantalla por pantalla | ⚠️ Base ok, sin revisar una por una |
| E3 | Pase estético «premium» (glows, gradientes, microanimaciones) | ⏸ Esperando que el usuario diga qué pantalla priorizar |
| E4 | Accesibilidad: contraste en dark mode, foco en todos los interactivos | ⚠️ Base WCAG, sin auditar |

---

## Orden recomendado

1. **Bloque A (legal)** — es un capítulo entero de la tesis con cero reflejo en el producto, y es
   todo contenido + páginas estáticas + un checkbox en el registro. Máximo impacto por esfuerzo.
2. **Bloque B (fidelidad)** — diferencias chicas y verificables contra el documento. Barato.
3. **Bloque C (usabilidad)** — responde a un hallazgo que la tesis dejó escrito.
4. **Bloque E1 (tests)** — respaldo de rigor metodológico.
5. **Bloque D** — documentar como simulado con su justificación; no construir.

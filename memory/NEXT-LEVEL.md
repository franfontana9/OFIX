# OFIX — Backlog de producto para el "next level"

> Derivado de leer el TFG completo el 2026-08-20: investigación de usuarios (1.2–1.9),
> user personas (1.5), insights de las 8 entrevistas (1.8), deseabilidad (2.2), benchmark (2.10),
> **matriz de posicionamiento (2.11)**, KPIs (3.5) y métricas de salud del marketplace (3.6.3).
> Cada ítem cita la evidencia de la tesis que lo justifica. Estado verificado contra el código.
>
> Complemento de [`TESIS-GAP.md`](TESIS-GAP.md), que mira lo mismo desde el cumplimiento formal.
> Este archivo mira **qué le falta al producto para ser lo que la tesis dice que es**.

---

## 🔴 Hallazgo principal: el diferencial declarado no está construido

La tesis posiciona a OFIX en el **cuadrante superior derecho** de la matriz (2.11), y el eje X
—«integración tecnológica con geolocalización»— se define textualmente como:

> «Uso de API de Google Maps… **Geolocalización en tiempo real** de técnicos y usuarios…
> **Asignación automática por cercanía**… **Seguimiento del desplazamiento y tiempos estimados**…
> Interfaz con mapa interactivo y **trazabilidad visual del servicio**.»

Y en 2.10.12: «Su diferencial clave reside en la geolocalización integrada… que optimiza la
respuesta ante urgencias», y «el **seguimiento en tiempo real** y la garantía de respaldo la
posicionan en el cuadrante de alta calidad».

**Nada de eso existe en la app.** Hoy hay un mapa estático con pines: eso es exactamente el nivel
que la tesis le asigna a Zolvers (1 sobre 5 en el eje X). Sin seguimiento, ETA ni trazabilidad,
la app es «Reeparando digitalizado», no el producto que el documento describe.

**Es lo primero que hay que construir.** Aunque sea simulado, tiene que ser visible.

| # | Qué falta | Evidencia |
|---|---|---|
| 1.1 | Estado **«en camino»** en la máquina de estados del trabajo (hoy: agendado → en_progreso → completado) | 2.11 eje X |
| 1.2 | **ETA / tiempo estimado de llegada** visible al cliente | 2.11 «tiempos estimados» |
| 1.3 | **Seguimiento del desplazamiento** en el mapa (posición del profesional acercándose) | 2.11 «seguimiento del desplazamiento» |
| 1.4 | **Trazabilidad visual**: línea de tiempo del servicio con horarios reales (aceptó → salió → llegó → empezó → terminó) | 2.11 «trazabilidad visual del servicio» |
| 1.5 | **Asignación automática por cercanía** como opción para urgencias (hoy el match es 100% manual) | 2.11 «asignación automática por cercanía» |
| 1.6 | **Check-in / check-out** del profesional en el domicilio | derivado de 1.4 |

---

## 🟠 Tier 1 — El dolor #1 de la investigación: disponibilidad inmediata

Lo nombran **4 de las 8 entrevistas** como el problema principal. No es un nice-to-have.

> «El mayor problema que enfrentan es conseguir **disponibilidad inmediata**, porque cuesta
> encontrar alguien que pueda ir en el momento» (E1, La Birra Bar)
> «la imposibilidad de conseguir disponibilidad inmediata cuando surge una urgencia» (E6)
> «la dificultad de **coordinar horarios** en situaciones de urgencia» (E7)
> «los **fines de semana o feriados** directamente no consigo personal» (E8)
> «me dicen que vienen y **no vienen**» (cita textual, 1.2.2)

| # | Qué falta | Evidencia |
|---|---|---|
| 2.1 | Estados de disponibilidad reales: **disponible ahora / ocupado / fuera de horario** (hoy es un booleano suelto) | E1, E6, E8 |
| 2.2 | **Ventana de respuesta con countdown**: el trabajador tiene N minutos para aceptar una urgencia | E1, E7 |
| 2.3 | **Escalado automático**: si nadie responde en N minutos, se amplía el radio o se notifica al siguiente | E1, E6 |
| 2.4 | **«X profesionales disponibles ahora en tu zona»** en el home y en la búsqueda | E1, E6 |
| 2.5 | **Guardia de fin de semana / feriados** (marcar disponibilidad 24/7 y cobrar diferencial) | E8 |
| 2.6 | **Confirmación de asistencia** + manejo de **no-show** (penalización / recontratación automática) | cita 1.2.2, E2 |
| 2.7 | **Horarios de atención** por trabajador que la búsqueda respete | E8 |

## 🟠 Tier 1 — Confianza en la puerta de casa

Miedo explícito y repetido. Hoy la app no hace nada en este momento crítico.

> «sus principales miedos: **dejar entrar a desconocidos** a su casa» (E3)
> «situaciones que la hicieron sentir **incómoda en su propia casa**» (E2)
> «Lo que más me preocupa es que sea inexperimentado y **arruine algo más** allá de lo que está roto» (1.2.2)

| # | Qué falta | Evidencia |
|---|---|---|
| 3.1 | Ficha **«quién va a ir»**: foto, identidad verificada, matrícula, vehículo, antes de que toque el timbre | E2, E3 |
| 3.2 | **Código de llegada** que el cliente valida en la puerta (confirma que es quien dice ser) | E3 |
| 3.3 | **Compartir seguimiento** con un contacto de confianza durante el servicio | E3 |
| 3.4 | Botón de **pánico / soporte** activo *durante* el servicio (hoy el SOS es para pedir, no para protegerse) | E2, E3 |

---

## 🟡 Tier 2 — Cierres de confianza (baratos, alto impacto)

| # | Qué falta | Evidencia |
|---|---|---|
| 4.1 | **Transparencia del split**: mostrarle al cliente cuánto recibe el profesional. Hoy `PriceBreakdown` muestra la comisión pero no el neto del trabajador | E1 textual: «se pregunta **qué porcentaje del dinero le llega realmente al trabajador**» |
| 4.2 | **Flujo de reclamo / disputa** sobre un trabajo, que **congele el escrow** hasta resolverse. Hoy `completeJob` libera fondos sin ruta de disputa posible | E7: «ausencia de **mecanismos de reclamo** cuando un trabajo sale mal»; E8: «incumplimientos aun cuando hay facturas»; y 3.6.3 mide «Disputas por servicio» — la métrica existe, el flujo no |
| 4.3 | **Garantía / retrabajo**: período de garantía por servicio y botón «reclamar garantía» que reabre el trabajo sin volver a pagar | 1.3: PyMEs «priorizan… **garantía** en los trabajos»; E1/E6: «arreglos mal hechos que se rompen enseguida»; cita 1.2.2: «nos arregló **3 veces lo mismo**» |
| 4.4 | **Reseña verificada** («de un trabajo pagado en OFIX») + **derecho a réplica** del trabajador + reportar reseña | E2: «le preocupa que las reseñas sean **falsas**»; E4: miedo a «quedar expuesto a críticas negativas»; E5: «**reseñas injustas**» |
| 4.5 | **Portfolio de trabajos realizados** (galería antes/después por trabajador, no solo fotos del servicio) | E2: «la seguridad proviene de **ver trabajos previos**»; E5: «usaría una plataforma para **mostrar sus trabajos**» |
| 4.6 | **Filtros por matrícula y nivel de complejidad** en la búsqueda (hoy no existe el filtro de matrícula) | E3: «filtros de calidad y **matrícula**»; E4: «filtros detallados por tipo de trabajo, **nivel de complejidad y matrícula**» |
| 4.7 | **Precios de referencia por categoría y zona** + señal cuando una oferta se va muy por encima del rango | E1: «**precios abusivos** en emergencia», «falta de transparencia en los costos»; E6: «precios poco claros, **sobrecargos**»; E3: miedo a «ser **estafada** con los precios» |

---

## 🟢 Tier 3 — Superficie nueva de producto

| # | Qué falta | Evidencia |
|---|---|---|
| 5.1 | **Segmento «administrador de consorcios»** como tercer `ClientType` (hoy solo `hogar` y `pyme_gastronomica`): multi-propiedad, mantenimiento recurrente, facturación consolidada, respaldo legal | **E8 lo pidió textualmente**: «reclamó además una **versión adaptada para administradores de edificios**». Es el usuario de **mayor frecuencia** de toda la investigación: «contrata oficios **todos los días**» |
| 5.2 | **Servicios recurrentes / mantenimiento programado** (hoy el panel PyME dice «Próximamente») | 2.2: «opción de **programar servicios recurrentes**»; modelo de negocio 2.4: «contratos de mantenimiento recurrente» |
| 5.3 | **Suscripción del lado del cliente** (hoy premium es solo para trabajadores) | E3: «sugirió un **modelo de suscripción** que asegure el acceso a profesionales serios» |
| 5.4 | **Insights de estacionalidad y demanda por zona** para el trabajador (hoy las stats son retrospectivas) | E4 y E5: «**estacionalidad** de la demanda», «inestabilidad en los ingresos» |
| 5.5 | Decidir: los microseguros son **«incluidos en cada contratación»** (2.2) pero hoy son un opcional pago. Hay que alinear producto y documento | 2.2 vs implementación |

---

## 🔵 Tier 4 — Instrumentación: medir lo que la tesis promete medir

La tesis define **9 KPIs (3.5)** y **5 métricas de salud del marketplace (3.6.3)**.
**Ninguna está instrumentada** y no hay panel interno.

| # | Métrica | Fuente |
|---|---|---|
| 6.1 | **Time-to-match** (solicitud → primera oferta aceptada) | 3.6.3 |
| 6.2 | **Fill rate** (solicitudes que reciben al menos una oferta) | 3.6.3 |
| 6.3 | **Cancel rate** | 3.6.3 |
| 6.4 | **Disputas por servicio** | 3.6.3 (depende de 4.2) |
| 6.5 | **Liquidez de oferta por zona** (trabajadores activos por barrio) | 3.6.3 |
| 6.6 | **Tasa de respuesta de trabajadores** (respondidas / recibidas) | 3.5 |
| 6.7 | **Tasa de éxito de matching** (completados / iniciadas) | 3.5 |
| 6.8 | Conversión de clientes, retención de usuarios y de trabajadores, ticket promedio | 3.5 |
| 6.9 | **NPS**: encuesta in-app post-servicio | 3.5 |
| 6.10 | **Panel de métricas del marketplace** (admin) que muestre todo lo anterior | derivado |

> Para una defensa esto vale mucho: demuestra que el producto puede medir lo que el plan promete.

---

## Orden recomendado

1. **Diferencial (bloque 1)** — sin esto la app no es lo que la tesis dice. Máxima prioridad.
2. **Disponibilidad inmediata (bloque 2)** — el dolor #1 de la investigación, 4/8 entrevistas.
3. **Confianza en la puerta (bloque 3)** — miedo explícito, y hoy no hay nada.
4. **Tier 2 completo** — son cierres baratos; 4.1 son 10 minutos y responde una pregunta textual.
5. **Consorcios (5.1)** — el usuario de mayor frecuencia de la investigación, hoy inexistente.
6. **Instrumentación (Tier 4)** — rigor metodológico.

*(La evaluación de calidad visual y UX/UI se hace aparte, después de esto.)*

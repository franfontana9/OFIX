# OFIX — Especificación de producto (base para el rebuild)

> Fuente: TFG-OFIX-Final-Unificado.docx + mockups `imagenes/p35_*` (usuario) y `p36_*` (trabajador)
> + MoSCoW (`p23_img01`) + tabla competitiva (`p42_img01`).
> Objetivo: llevar la app del prototipo actual (19 pantallas base) al **estándar OFIX completo**.
> Esto es la fuente de la verdad funcional; los tokens de diseño exactos siguen en `src/index.css`.

## 1. Concepto
Marketplace de doble lado (web app responsive + mobile) que conecta **usuarios** (hogares y
pymes gastronómicas) con **trabajadores de oficios verificados** para resolver urgencias/servicios
del hogar en Argentina (CABA/GBA inicial). Eslogan: **«Tu solución confiable, a un clic»**.
Onboarding: **«Encontrá el profesional que necesitás»** / «Conectamos usuarios con trabajadores
verificados de oficios. Rápido, seguro y confiable.» Campaña de marca: **«OFIX te cuida»**.

**4 pilares diferenciales** (vs. competencia local):
1. Verificación de identidad y reputación interna (KYC desde el onboarding).
2. Geolocalización con Google Maps (cercanía + trazabilidad).
3. Pago digital protegido vía Mercado Pago (escrow: fondos liberados tras validación del cliente).
4. Cobertura asegurada por servicio (microseguro opcional; OFIX = intermediario).

## 2. Roles
Dos recorridos desde el inicio: **«Encontrá profesional»** (cliente) / **«Ofrece servicios»** (trabajador).

## 3. Alcance por prioridad (MoSCoW de la tesis)
> Estado al 2026-08-20. `[~]` = implementado con una limitación anotada.

### MUST HAVE (MVP — construir primero)
- [~] Registro y login (email/pass + KYC en el wizard) — *Google/Apple y recuperar contraseña quedan
      **simulados**: el OAuth real y el reset por email necesitan backend.*
- [x] Creación/edición de perfiles con **foto, oficio y zona de trabajo**
- [x] **Búsqueda y filtrado** de trabajadores por especialidad, zona y disponibilidad
- [x] **Nueva solicitud**: tipo de servicio, título, descripción, **subir imágenes**, ubicación, urgencia
- [x] **Sistema de ofertas/cotizaciones**: trabajador envía presupuesto+comentarios+disponibilidad; cliente compara y acepta/rechaza
- [x] **Reputación**: estrellas + reseñas, **calificación mutua** (cliente↔trabajador), pública
- [x] **Pagos digitales in-app** (Mercado Pago simulado; escrow; también efectivo/transferencia)
      + **comprobante** imprimible por trabajo pagado (tipo A/B)
- [x] **Onboarding** asistido paso a paso
- [x] **Seguro por servicio** (opcional; pólizas; lo paga el usuario)
- [x] **Geolocalización** (distancia + profesionales cercanos)

### SHOULD HAVE
- [~] **Chat interno** cliente–trabajador (contexto del trabajo, typing, **adjuntar foto real**)
      — *los estados de "leído" se infieren del último mensaje del otro, no son reales.*
- [x] **Agenda / calendario** de trabajos — con **reprogramar** (ambas partes) y **cancelar** (cliente)
- [x] **Historial de trabajos** (realizados/pendientes)
- [x] **Notificaciones** (mensajes, pagos, reservas) — *in-app; push reales requieren backend.*
- [x] **Favoritos** (trabajadores preferidos)

### COULD HAVE
- [~] **Mapa interactivo** de cercanos — *hecho con Leaflet + OpenStreetMap; Google Maps
      queda para producción (necesita API key + facturación).*
- [x] **Landing page** pública
- [x] **Panel de estadísticas** para trabajadores (ingresos, calificaciones)
- [x] **Facturación mensual** para PyMEs (panel B2B con comprobantes agrupados por mes)

### WON'T (fuera de MVP): matching IA, precios dinámicos, cotización automática, diagnóstico por imagen, multimoneda, alianzas a gran escala.

## 4. Pantallas objetivo (de los wireframes)
**Usuario (p35):** Home (URGENCIA + categorías + trabajadores recomendados) · Tu Urgencia (descripción,
urgencia, presupuesto, datos y ubicación) · Perfil de trabajador (resumen de acuerdos, acuerdos vigentes, SOLICITAR)
· Solicitud (datos del trabajador, datos de la operación, urgencia, aceptar condiciones) · Datos del trabajador
(nombre, contacto, rating e historial, **seguro y vigencia**) · Método de pago (datos del pago, cancelar/confirmar).
**Trabajador (p36):** Método de pago · **Acuerdo exitoso!** (seguimiento del acuerdo, contacto) · Publicar servicios
(ofertas con/sin urgencia) · Tu servicio (descripción, trabajos realizados y rating, horarios, datos y ubicación)
· Perfil (resumen de acuerdos, acuerdos vigentes, historial de trabajos) · Datos del usuario (nombre, datos, rating e historial).
Todas: **mobile-first con bottom nav de 5 íconos** (`+` nueva, 🔍 buscar, 🏠 home, 👥 contactos/acuerdos, 👤 perfil) y responsive.

## 5. Modelo de datos (extensión de `src/lib/store.ts`)
- **User (base):** id, nombre, email, hash, **foto**, teléfono, rol (cliente|trabajador), tipoCliente (hogar|pyme_gastronomica), dirección, geo{lat,lng}, authProvider, fechaAlta.
- **PerfilTrabajador (extiende User):** oficios[], zonaCobertura, tarifaHora, descripción, **verificación**{identidad,antecedentes,matricula}, **nivel** (Bronze|Silver|Gold), ratingProm, cantReseñas, premium.
- **Servicio (oficio ofrecido):** id, trabajadorId, título, descripción, precio, **duraciónEstimada (rango)**, categoría, activo.
- **Categoría:** id, nombre, ícono (tabla editable, no hardcode).
- **Solicitud/Pedido:** id, clienteId, categoría, título, descripción, **imágenes[]**, ubicación/geo, **urgencia**, estado (pendiente|aceptado|rechazado), fecha.
- **Oferta/Propuesta:** id, solicitudId, trabajadorId, monto, comentarios, disponibilidad, estado (pendiente|aceptada|rechazada|finalizada).
- **Trabajo (oferta aceptada):** id, solicitudId, ofertaId, cliente, trabajador, fecha/hora, estado (activo|completado|cancelado), monto, seguro(bool).
- **Pago:** id, trabajoId, montoBruto, comisiónOFIX (10–15% al cliente), montoNeto (~80% GMV al trabajador), método (MP|efectivo|transferencia), estado (pendiente|retenido|liberado|retirado).
- **Cobro/Wallet trabajador:** totalGanado, disponible, pendientes, historial.
- **Reseña:** id, trabajoId, autor, destinatario, **estrellas 1–5**, comentario, fecha (**bidireccional**).
- **Seguro/Póliza:** id, trabajoId, aseguradora, cobertura, costo, pagadoPorUsuario, estado.
- **Chat/Mensaje, Favorito, AgendaEntry, Notificación, Verificación/KYC, Suscripción, Plan B2B.**

## 6. Categorías de oficios (iniciales)
Plomería · Electricidad · Gas (matrícula ENARGAS) · Cerrajería · Pintura · Mantenimiento ·
Técnico de aire · Limpieza · Jardinería · Carpintería. (Modelar como tabla editable.)

## 7. Reglas de negocio
- **Comisión 10–15% cobrada al CLIENTE**; trabajador recibe ~80% del GMV.
- **Escrow:** fondos retenidos → liberados tras validación del cliente. Split vía MP.
- **KYC trabajadores:** identidad + antecedentes + matrícula/título en onboarding.
- **Reputación:** reseñas verificadas, calificación mutua, precios/reseñas públicos.
- **Seguro:** opcional (u obligatorio por rubro), lo paga el usuario, OFIX intermedia.
- **Niveles Bronze/Silver/Gold** → comisión decreciente.
- **PyME B2B:** urgencias express, mantenimiento recurrente, panel, factura/SLA.
- Legal: OFIX = **intermediario, NO empleador**; Ley 25.326 datos.

## 8. Decisiones de producto ABIERTAS (no están en la tesis)
1. **Escala de urgencia**: la tesis NO define 1–5. Opciones: enum `Inmediata/En el día/Programada`,
   o flag `express`+fecha, o escala 1–5 (nueva decisión de producto). *(El wireframe muestra 5 puntos.)*
2. Enum cerrado vs. tabla de categorías (recomendado: editable).
3. Matching: en MVP es **manual** (cliente elige entre ofertas); "recomendado" = curado, no IA.
4. Máquina de estados del "Trabajo" (inferida).

## 9. Notas de UX/técnicas
- UI limpia, moderna, **tonos azules** (ya en `index.css`), onboarding asistido (parte de la demanda
  tiene baja alfabetización digital → simplicidad).
- Punto débil detectado en testeos: **historial y gestión de propuestas** (muchos pasos) → optimizar.
- Stack sugerido tesis: Flutter/RN + web responsive; acá: Vite+React responsive (sin backend, mock en store.ts).

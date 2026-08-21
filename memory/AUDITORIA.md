# OFIX Connect — Auditoría técnica y de producto

> 2026-08-21. Todo lo que sigue está **medido sobre el código**, no estimado.
> Criterio: qué le falta a la app como *producto*. No se propone nada solo porque
> esté en la tesis.

## Estado medido

| | |
|---|---|
| Pantallas | 57 · 56 rutas |
| Código | 19.034 LOC (TS/TSX) |
| Componentes propios | 26 en `ofix/` + 12 primitivos `ui/` |
| Bundle | 350 KB inicial · 1.031 KB total JS · 67 KB CSS |
| TypeScript | 0 errores (`tsc -b` estricto) |
| Tests | **0** |
| Dependencias | 18 runtime · 10 dev |

**Veredicto corto:** la cobertura funcional es alta y el modelo de dominio es
sólido. Lo que falta no es *más features*: son **fundaciones** que hoy están
ausentes y que van a doler cada vez más (refresco manual, cero tests, un store
monolítico) más un puñado de riesgos concretos que pueden arruinar una demo en vivo.

---

## A. El store es un god object — el problema estructural principal

| Métrica | Valor |
|---|---|
| LOC | 2.196 |
| Métodos públicos | **113** |
| Archivos que lo importan directo | **58** |
| LOC del seed adentro del data layer | 209 |

Las 58 pantallas conocen la clase entera. Cambiar la firma de un método obliga a
revisar todo, y el seed (datos de demo) vive mezclado con la lógica de negocio.

**Propuesta:** partir por dominio (`store/jobs.ts`, `store/payments.ts`,
`store/workers.ts`…) con el seed en `store/seed.ts`, y sumar una capa fina de
hooks (`useJobs()`, `useWorkers()`) para que las pantallas dejen de tocar el
store directo. **Esto es exactamente lo que permite migrar a Supabase sin
reescribir 58 archivos**: los hooks pasan de síncronos a asíncronos y las
pantallas casi no cambian.

## B. El refresco es manual y silenciosamente frágil

**16 archivos** repiten `useReducer((x) => x + 1, 0)` para forzar re-render
después de mutar. El store muta en el lugar y no notifica a nadie: si una
pantalla se olvida el `refresh()`, muestra datos viejos y **no falla** — el bug
es invisible.

**Propuesta:** hacer el store observable (un `subscribe()` simple, o moverlo a
zustand como ya está `auth`). Elimina 16 boilerplates y una clase entera de bugs.

## C. Inconsistencia de formato

- **16 archivos** usan `toLocaleString()` sin `es-AR`: el separador de miles
  queda a merced del navegador del que mire la demo.
- **16 definiciones locales** distintas de `const money = ...`.
- Las fechas se formatean a mano en cada pantalla, con combinaciones distintas.

**Propuesta:** `src/lib/format.ts` con `money()`, `fecha()`, `hora()`,
`fechaHora()` y usarlo en todos lados. Es media hora y cierra el tema para siempre.

## D. Accesibilidad — el hueco real está en el teclado

| Chequeo | Resultado |
|---|---|
| Imágenes sin `alt` | 0 ✅ |
| Botones de ícono sin etiqueta | 0 ✅ |
| **`onClick` en `div`/`Card`** | **11** ❌ |

Esos 11 son cards clickeables (trabajador, propiedad, plan, trabajo) que **no se
pueden usar con teclado**: no reciben foco, no responden a Enter y un lector de
pantalla no las anuncia como accionables. Es la falla de accesibilidad más común
y acá afecta a los elementos principales de navegación.

**Propuesta:** un componente `ClickableCard` con `role="button"`, `tabIndex={0}`
y `onKeyDown` para Enter/Espacio. Se reemplaza en los 11 lugares.

## E. Errores no manejados → pantalla de error por un fallo recuperable

**10 archivos** llaman métodos que tiran `Error` sin `try/catch`:

`EmergencyButton` · `WorkerCard` (favoritos) · `u/Emergency` · `u/Notifications` ·
`u/WorkerProfile` · `w/UserProfile` · `w/Verification` · `w/Services` ·
`w/Notifications` · `w/Premium`

Sin catch, el error sube al `ErrorBoundary` y se come **toda la pantalla** por
algo que debería ser un toast. Ejemplo: tocar el corazón de favoritos sin sesión
válida rompe la página entera.

**Propuesta:** un helper `run(fn, okMsg)` que envuelva try/catch + toast, y
usarlo en los 10.

## F. Responsive: 17 pantallas nunca se diseñaron para desktop

Sin un solo breakpoint `sm:`/`md:`/`lg:`:

`u/Pay` · `u/Hire` · `u/Review` · `u/Agenda` · `u/Chat` · `u/ChatDetail` ·
`u/Emergency` · `u/Notifications` · `w/Agenda` · `w/Chat` · `w/ChatDetail` ·
`w/Notifications` · `w/AgreementReview` · `Onboarding` · `NotFound` ·
`auth/Forgot` · `_Placeholder`

No están *rotas* (Tailwind es mobile-first y varias son de una columna), pero en
una pantalla ancha quedan estiradas y vacías. **`u/Pay` es la más grave**: es el
momento de pagar, el de mayor fricción del flujo.

## G. Cero tests, con reglas de negocio reales en juego

El store tiene autorización, escrow, disputas que congelan fondos, garantías y
máquina de estados. **Encontré 4 bugs ahí con smoke tests improvisados** — dos de
ellos serios (un link público filtraba el código de la puerta; una disputa
resuelta borraba la garantía del cliente). Sin tests, el próximo cambio los
reintroduce.

**Propuesta:** Vitest + ~30 tests **del store, no de la UI**. Es donde está el
riesgo y donde el retorno por test es máximo.

## H. Riesgo de demo: las fotos dependen de servicios externos en vivo

Todos los avatares y fotos salen de `randomuser.me` y `loremflickr.com`. Si esos
servicios están lentos, caídos, o la sala de defensa tiene wifi malo, **la app se
ve vacía y rota**. Es el riesgo más alto en relación a lo fácil que es de evitar.

**Propuesta:** bajar las imágenes a `public/demo/` y servirlas del propio deploy.
Carga instantánea, sin dependencia de red, funciona offline.

## I. Cuota de localStorage sin tope en un camino

`src/lib/image.ts` limita los adjuntos de chat a 220 KB, pero **`ImageUploader`
(fotos de solicitudes y servicios) guarda base64 sin redimensionar**. Tres fotos
de celular llenan los ~5 MB de cuota y a partir de ahí las escrituras fallan.

**Propuesta:** usar `fileToResizedDataUrl` también en `ImageUploader`. Es un
cambio de tres líneas.

## J. Dependencias ausentes que van a hacer falta

| Falta | Consecuencia hoy |
|---|---|
| `zod` o similar | Los formularios validan a mano, inconsistente entre pantallas |
| `react-hook-form` | Estado de formulario manual con `useState` por campo |
| Librería de gráficos | `w/Stats` dibuja el gráfico a mano con divs |
| `react-query`/`swr` | No hace falta hoy (sin backend), **sí al migrar a Supabase** |

---

## Plan priorizado

### Tier 0 — Riesgo de demo. Antes de mostrar la app a nadie.
1. **Fotos locales** en vez de servicios externos (H)
2. **Los 10 archivos sin try/catch** (E) — un favorito no puede tumbar la pantalla
3. **Las 11 cards accesibles por teclado** (D)
4. **Topear `ImageUploader`** (I)

### Tier 1 — Fundaciones. Habilitan todo lo que viene después.
5. **`format.ts`** y erradicar los 16 `money` y los `toLocaleString()` sueltos (C)
6. **Store observable** → mueren los 16 `useReducer` de refresco (B)
7. **Vitest + tests del store** (G)

### Tier 2 — Arquitectura para el backend real.
8. **Partir el store por dominio** + seed aparte (A)
9. **Capa de hooks** — el paso que hace la migración a Supabase barata (A)

### Tier 3 — Pulido de producto.
10. **Pase responsive de las 17**, arrancando por `u/Pay` (F)
11. **`zod` + `react-hook-form`** en los formularios largos (Register, NewRequest, NewService) (J)
12. **Librería de gráficos** para Stats (J)

---

## Sobre Supabase

Vale la pena, pero **después del Tier 1 y 2**. Hoy migrar significa tocar 58
archivos que llaman al store en forma síncrona. Con los hooks en el medio, el
cambio queda contenido en la capa de datos y las pantallas casi no se enteran.
Lo que desbloquea: persistencia entre dispositivos, login social real, storage de
fotos (mata el problema de la cuota) y notificaciones push — todo lo que hoy está
anotado como bloqueado.

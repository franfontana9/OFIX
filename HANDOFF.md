# OFIX Connect — Handoff / contexto completo

## Qué es esto
Réplica **1:1** de la app **OFIX** (marketplace que conecta *usuarios* con *trabajadores*
profesionales para resolver urgencias — plomería, electricidad, etc.). El original está
hecho en **Lovable** y publicado en: **https://ofix-connect-app.lovable.app**
(proyecto Lovable: `452dd3a1-0345-4ed5-9d68-1a854583bc1d`).

Este repo NO usa Lovable: es el mismo stack reconstruido a mano, portado fielmente
desde el sitio en vivo (bundle + CSS reales, no inventado).

**Objetivo:** primero dejarlo **exactamente igual** al original; después, iterar mejoras.

## Stack
- **Vite + React 18 + TypeScript**
- **React Router v6** (SPA, rutas cliente)
- **Tailwind + shadcn/ui** (Radix) — íconos **lucide-react**, toasts **sonner**
- **zustand** para auth
- **Sin backend**: todo el estado vive en `localStorage` (data mock). El "backend" es
  una clase singleton (`src/lib/store.ts`) que persiste a las claves `ofix-data` y `ofix-token`.

## Cómo correr
```bash
npm install       # si hiciera falta (ya viene con node_modules)
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build  (compila limpio: 1687 módulos, 0 errores)
```

## Usuarios de prueba (seed automático en el primer arranque)
- Usuario: `maria@example.com` / `carlos@example.com`
- Trabajador: `juan@example.com` (Plomería) / `ana@example.com` (Electricidad)
- Password para todos: `password123`
> Para re-seedear: borrar las claves `ofix-data` y `ofix-token` de localStorage y recargar.

## Arquitectura / dónde está cada cosa
- `src/lib/store.ts` — **data layer** (singleton `store`, minificado `K` en el original):
  seed + CRUD de users/offers/proposals/services/chats/messages/payouts, auth (fake JWT
  via btoa), persistencia a localStorage. Portado método por método del original.
- `src/lib/auth.ts` — store **zustand** `useAuth` (user/token/login/register/logout/updateUser/initialize).
- `src/lib/types.ts` — tipos del dominio + `CATEGORIES` (8 oficios).
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge).
- `src/components/ProtectedRoute.tsx` — guard por rol (user→`/u/*`, worker→`/w/*`; sin auth→`/auth/login`).
- `src/components/BackButton.tsx` — botón "Volver al inicio" (export **nombrado**).
- `src/components/ui/*` — primitivos shadcn (button, card, input, textarea, label, badge,
  select, avatar, tabs, dialog, table, sonner).
- `src/index.css` — **tokens de diseño exactos** del original (light + dark, HSL): primary azul
  `221 83% 53%`, accent naranja `25 95% 53%`, success verde `142 76% 36%`, `--radius .5rem`,
  gradients (`--gradient-primary/accent`), shadows, tokens sidebar. NO cambiar sin querer.
- `src/App.tsx` — router con las 19 rutas.

## Rutas (19 pantallas, todas portadas)
Público: `/` (landing dual), `/auth/login`, `/auth/register`, `*` (404).
Usuario `/u/`: `home`, `requests`, `requests/new`, `requests/:id`, `chat`, `chat/:id`, `profile`.
Trabajador `/w/`: `home`, `jobs`, `services`, `services/new`, `proposals`, `cobros`, `chat`, `chat/:id`, `profile`.

## Fuente de la verdad para fidelidad (carpeta `_reference/`)
- `_reference/ofix.original-bundle.pretty.js` — el **bundle JS del original**, prettificado
  (~25k líneas). Es React compilado (`i.jsx(Tag,{className,children})`). Si algo hay que
  comparar contra el original, buscar acá el componente. Mapa nombre→ruta (minificado):
  `xE`=`/`, `bE`=login, `NE`=register, `CE`=`/u/home`, `kE`=`/u/requests`, `ek`=`/u/requests/new`,
  `vk`=`/u/requests/:id`, `xk`=`/u/chat`, `wk`=`/u/chat/:id`, `yk`=`/u/profile`,
  `Sk`=`/w/home`, `Dk`=`/w/jobs`, `Lk`=`/w/services`, `zk`=`/w/services/new`, `$k`=`/w/proposals`,
  `Vk`=`/w/cobros`, `Wk`=`/w/profile`, `Hk`=`/w/chat`, `Kk`=`/w/chat/:id`, `wE`=404, `mt`=BackButton.
  Alias UI: `Y`=Card, `re`=Button, `ye`=Input, `fe`=Label, `ze`=useNavigate, `K`=store, `Re`=useAuth, `be`=toast.
- `_reference/ofix.original.css` — CSS compilado del original (los tokens salieron de acá).
- `_reference/PORTING-CONVENTIONS.md` — convenciones usadas al portar (imports, cheatsheet, reglas).

## Caveats conocidos (dónde puede diferir del original)
1. **Íconos**: en el bundle están minificados; se infirieron los `lucide-react` por contexto.
   Alguno puede no ser idéntico → verificar contra el sitio en vivo y ajustar el import.
2. **Estados**: `Offer.status` usa `"asignada"` (además de `abierta`/`cerrada`);
   `Payout.status` usa `"pendiente"`/`"liquidado"`. Así está en el original.
3. Verificar **pixel-perfect** abriendo el vivo al lado (`ofix-connect-app.lovable.app`) y
   comparando cada pantalla (sobre todo detalles de chat, propuestas y cobros).

## Próximos pasos sugeridos
1. `npm run dev`, loguearse con los usuarios de prueba y recorrer las 19 pantallas contra el vivo.
2. Ajustar cualquier diferencia fina (íconos, spacing, textos) usando `_reference/`.
3. Recién ahí, arrancar con las **mejoras** que se quieran sumar.

# OFIX clone — conventions for porting screens

You are porting screens of a React+Vite+shadcn app from a minified-but-prettified
bundle at:
`/private/tmp/claude-501/-Users-fran-Desktop-Laburo-SWL-Intern-App/630c0d97-71e8-447d-9ac1-dd4e8f1d726a/scratchpad/ofix.pretty.js`

The bundle is compiled React (`i.jsx(Tag,{className,children,...})`). Read your
component's line range, understand the exact JSX tree (classNames, text, layout,
handlers), and reproduce it as a clean `.tsx` file. Keep classNames, Spanish text,
and structure EXACTLY. This must look pixel-identical to the original.

## Project root
`/Users/fran/Desktop/Laburo/SWL-Intern-App/ofix-connect`

## Imports & APIs available (use these, they already exist)
- UI (shadcn): `@/components/ui/button` (Button, buttonVariants), `.../card`
  (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter),
  `.../input` (Input), `.../textarea` (Textarea), `.../label` (Label),
  `.../badge` (Badge — variants: default|secondary|destructive|outline|success|accent),
  `.../select` (Select, SelectTrigger, SelectValue, SelectContent, SelectItem),
  `.../avatar` (Avatar, AvatarImage, AvatarFallback), `.../tabs` (Tabs, TabsList,
  TabsTrigger, TabsContent), `.../dialog` (Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogTrigger, DialogFooter).
- `@/components/BackButton` → `<BackButton />` (the "Volver al inicio" ghost button, minified `mt`).
- Auth store (zustand): `import { useAuth } from "@/lib/auth"` → `const { user, logout } = useAuth()`.
  `useAuth.getState().user` also works. `user` shape: {id,name,email,role,phone?,trade?,verified?,rating?}.
- Data store: `import { store } from "@/lib/store"` (minified as `K`). Methods (all sync):
  getOffers({status?,category?,q?}), getOffer(id), createOffer(data), updateOffer(id,patch),
  getProposals({workerId?,offerId?}), createProposal(data), updateProposal(id,status),
  getServices({workerId?}), createService(data), updateService(id,patch),
  getChats(userId), createChat(a,b), getMessages(chatId), createMessage(chatId,text),
  getPayouts(workerId), createPayout(amount), getUser(id).
- Types: `import type { Offer, Service, Proposal, Chat, Message, Payout } from "@/lib/types"`.
  `import { CATEGORIES } from "@/lib/types"` (array of 8 oficios).
- Toasts: `import { toast } from "sonner"` (minified `be`) → toast.success(...) / toast.error(...).
- Router: `import { useNavigate, useParams, Link } from "react-router-dom"`.
  minified: `ze()` = useNavigate, `Yr()`/`useParams`, `Ty` = Link.

## Minified → real name cheatsheet (bundle → your code)
- `i.jsx`/`i.jsxs` → JSX. `Y`=Card, `ie`=CardHeader, `ae`=CardTitle, `ge`=CardDescription,
  `ue`=CardContent, `yE`=CardFooter, `re`=Button, `ye`=Input, `fe`=Label, `Nt`/`Se`=Badge,
  `Xe`=Textarea. `ze`=useNavigate, `K`=store, `Re`=useAuth, `be`=toast, `mt`=BackButton, `Ty`=Link.
- Icons are minified (e.g. `Cv`, `Wo`, `Oa`). Infer the right **lucide-react** icon from
  context/nearby text and import from "lucide-react". Common ones in this app:
  Plus, FileText, ClipboardList, MessageCircle, User, LogOut, ArrowLeft, MapPin, DollarSign,
  Clock, Star, Send, Wrench, Briefcase, CheckCircle2, Loader2, Eye, TrendingUp, Wallet,
  Calendar, Phone, Mail, Search, AlertCircle, Package. Pick the closest match.

## Rules
- Every screen is a default-exported function component.
- Reproduce the outer wrappers exactly. Most authed screens use:
  `<div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light">`
  then `<div className="container mx-auto px-4 py-8">`. Sub-pages start with `<BackButton />`.
- Keep money as `$${n.toLocaleString()}`, keep all Spanish strings verbatim.
- Urgency/status badges: reproduce colors/labels exactly as in the bundle.
- Use `store.getState`-free direct calls (store is a singleton instance).
- Do NOT invent features not in the bundle. Match it.
- After writing, keep it TypeScript-clean (this project runs `tsc -b`; avoid `any` where a type exists, but `as` casts are fine).

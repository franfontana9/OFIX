import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Umbrella,
  MapPin,
  Search,
  MessageSquare,
  CreditCard,
  Star,
  ArrowRight,
  Wrench,
  Zap,
  Flame,
  KeyRound,
  PaintRoller,
  Sparkles,
  Hammer,
  Leaf,
  CheckCircle2,
  Clock,
  Wallet,
  Users,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "+500", label: "profesionales verificados" },
  { value: "4.8★", label: "calificación promedio" },
  { value: "24 hs", label: "tiempo de respuesta" },
  { value: "100%", label: "pago protegido" },
];

const CATEGORIES = [
  { icon: Wrench, label: "Plomería" },
  { icon: Zap, label: "Electricidad" },
  { icon: Flame, label: "Gas" },
  { icon: KeyRound, label: "Cerrajería" },
  { icon: PaintRoller, label: "Pintura" },
  { icon: Hammer, label: "Albañilería" },
  { icon: Leaf, label: "Jardinería" },
  { icon: Sparkles, label: "Limpieza" },
];

const STEPS = [
  {
    icon: Search,
    title: "Publicá tu urgencia",
    text: "Contanos qué necesitás, con fotos y detalles. En minutos lo ven los profesionales de tu zona.",
  },
  {
    icon: MessageSquare,
    title: "Recibí propuestas",
    text: "Trabajadores verificados te envían presupuestos y disponibilidad para que compares.",
  },
  {
    icon: CreditCard,
    title: "Elegí y pagá protegido",
    text: "Contratás al que más te convence y el pago queda retenido en escrow hasta terminar.",
  },
  {
    icon: Star,
    title: "Calificá",
    text: "Al finalizar, calificás el servicio y ayudás a que la comunidad siga siendo confiable.",
  },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Verificación de identidad",
    text: "Validamos DNI, matrícula y antecedentes de cada trabajador antes de habilitarlo.",
  },
  {
    icon: Lock,
    title: "Pago protegido (escrow)",
    text: "Tu dinero queda retenido de forma segura y se libera recién cuando confirmás el trabajo.",
  },
  {
    icon: Umbrella,
    title: "Seguro por servicio",
    text: "Cada trabajo puede sumar cobertura ante daños, para que contrates con total tranquilidad.",
  },
  {
    icon: MapPin,
    title: "Geolocalización",
    text: "Encontrá profesionales cerca tuyo y seguí su llegada en tiempo real desde la app.",
  },
];

const CLIENT_PERKS = [
  "Profesionales verificados y calificados por la comunidad",
  "Presupuestos claros, sin sorpresas ni intermediarios",
  "Pago protegido: solo se libera con el trabajo hecho",
  "Soporte y seguro OFIX en cada servicio",
];

const WORKER_PERKS = [
  "Recibí solicitudes de clientes reales de tu zona",
  "Cobros garantizados y liberados al finalizar",
  "Construí tu reputación con reseñas verificadas",
  "Gestioná tu agenda y trabajos desde un solo lugar",
];

export default function Landing() {
  const navigate = useNavigate();

  // El buscador manda a la exploración pública (sin registro) con los filtros.
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = String(form.get("q") || "").trim();
    const zone = String(form.get("zone") || "").trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (zone) params.set("zone", zone);
    navigate(`/explorar${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="animate-page min-h-screen overflow-x-hidden bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary">
            OFIX
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#como-funciona"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Cómo funciona
            </a>
            <a
              href="#beneficios"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Beneficios
            </a>
            <a
              href="#categorias"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Oficios
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/auth/login">Ingresar</Link>
            </Button>
            <Button asChild className="shadow-sm">
              <Link to="/auth/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient + blobs */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-light via-background to-accent-light" />
        <div className="absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-16 top-32 -z-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Oficios verificados en toda Argentina
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
                Encontrá el profesional{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">que necesitás</span>
              </h1>
              <p className="mx-auto max-w-md text-lg text-muted-foreground md:mx-0">
                Conectamos usuarios con trabajadores verificados de oficios. Rápido, seguro y confiable.
              </p>

              {/* Buscador central: tipo de servicio + ubicación (tesis 2.12.2) */}
              <form onSubmit={handleSearch} className="mx-auto max-w-lg md:mx-0">
                <div className="flex flex-col gap-2 rounded-2xl border border-border bg-background/80 p-2 shadow-lg backdrop-blur sm:flex-row">
                  <div className="relative flex-1">
                    <Wrench className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      name="q"
                      aria-label="Qué servicio necesitás"
                      placeholder="¿Qué necesitás? Electricista, plomero…"
                      className="h-11 w-full rounded-xl bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="relative flex-1 sm:max-w-[42%]">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      name="zone"
                      aria-label="Ubicación"
                      placeholder="Tu zona o barrio"
                      className="h-11 w-full rounded-xl bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-11 gap-2 shadow-sm">
                    <Search className="h-4 w-4" />
                    Buscar
                  </Button>
                </div>
              </form>

              <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <Button asChild size="lg" className="gap-2 shadow-lg transition-shadow hover:shadow-xl">
                  <Link to="/auth/register?role=user">
                    <Search className="h-5 w-5" />
                    Encontrá profesional
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="gap-2 border-accent text-accent transition-colors hover:bg-accent-light hover:text-accent"
                >
                  <Link to="/auth/register?role=worker">
                    <Wrench className="h-5 w-5" />
                    Ofrecé servicios
                  </Link>
                </Button>
              </div>
              <div className="flex flex-col items-center gap-2 md:items-start">
                <Link to="/explorar" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  o explorá profesionales sin registrarte →
                </Link>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground md:justify-start">
                  <BadgeCheck className="h-4 w-4 text-success" />
                  Campaña <span className="font-semibold text-foreground">OFIX te cuida</span> · gratis para empezar
                </div>
              </div>
            </div>

            {/* Visual — app mock */}
            <div className="relative hidden md:block">
              <div className="rounded-[2rem] bg-gradient-primary p-8 shadow-xl">
                <div className="space-y-4 rounded-3xl bg-background/95 p-6 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-lg font-bold text-primary-foreground shadow-md">
                      MG
                    </div>
                    <div>
                      <p className="font-semibold leading-tight">Martín G.</p>
                      <p className="text-sm text-muted-foreground">Plomero matriculado · Palermo</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verificado
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <Star key={n} className="h-4 w-4 fill-current" />
                    ))}
                    <span className="ml-1 text-sm font-medium text-foreground">4.9</span>
                    <span className="text-sm text-muted-foreground">(128 reseñas)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-muted p-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Presupuesto · pago protegido</p>
                      <p className="text-lg font-bold text-foreground">$8.500</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary">
                      <Lock className="h-3.5 w-3.5" />
                      En escrow
                    </span>
                  </div>
                  <Button className="w-full gap-2">
                    Contratar ahora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Floating chip */}
              <div className="absolute -left-6 bottom-8 flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 shadow-xl">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success-light text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold leading-tight">Trabajo completado</p>
                  <p className="text-xs text-muted-foreground">Pago liberado con éxito</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar / stats */}
      <section className="border-y border-border/60 bg-background/60">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="bg-gradient-primary bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section id="categorias" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Oficios para cada necesidad</h2>
            <p className="mt-2 text-muted-foreground">
              Encontrá al profesional indicado, sea una urgencia o un proyecto.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.label}
                  to="/auth/register?role=user"
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-semibold">{c.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="bg-background/60 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Simple y seguro
            </div>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">Cómo funciona</h2>
            <p className="mt-2 text-muted-foreground">Contratar un profesional nunca fue tan fácil.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <span className="absolute -right-2 -top-3 text-7xl font-extrabold text-primary/5">
                    {i + 1}
                  </span>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Beneficios — OFIX te cuida */}
      <section id="beneficios" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-light px-4 py-1.5 text-sm font-medium text-accent">
              <Umbrella className="h-4 w-4" />
              OFIX te cuida
            </div>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">Seguridad en cada servicio</h2>
            <p className="mt-2 text-muted-foreground">
              Protegemos a clientes y trabajadores en cada paso de la operación.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="group rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-1 font-semibold">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sección doble — clientes / trabajadores */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Clientes */}
            <div className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-sm md:p-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">Para clientes</h3>
              <p className="mt-1 text-muted-foreground">
                Resolvé cualquier urgencia del hogar con total confianza.
              </p>
              <ul className="mt-6 space-y-3">
                {CLIENT_PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{perk}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-8 w-full gap-2 sm:w-auto">
                <Link to="/auth/register?role=user">
                  <Search className="h-5 w-5" />
                  Encontrá profesional
                </Link>
              </Button>
            </div>

            {/* Trabajadores */}
            <div className="flex flex-col rounded-3xl border border-accent/20 bg-accent-light/40 p-8 shadow-sm md:p-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light text-accent">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">Para trabajadores</h3>
              <p className="mt-1 text-muted-foreground">
                Hacé crecer tu negocio y cobrá siempre a tiempo.
              </p>
              <ul className="mt-6 space-y-3">
                {WORKER_PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm">{perk}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="mt-8 w-full gap-2 border-accent bg-background text-accent transition-colors hover:bg-accent hover:text-accent-foreground sm:w-auto"
              >
                <Link to="/auth/register?role=worker">
                  <Wrench className="h-5 w-5" />
                  Ofrecé servicios
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-10 text-center text-primary-foreground shadow-xl md:p-16">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-10 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Tu solución confiable, a un clic
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Sumate hoy a la red de oficios más confiable de Argentina. Empezar es gratis.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="gap-2 shadow-lg">
                <Link to="/auth/register">
                  Crear cuenta gratis
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <Link to="/auth/login">Ya tengo cuenta</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-primary-foreground/80">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Verificados
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="h-4 w-4" /> Pago protegido
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Respuesta en 24 hs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <span className="text-2xl font-extrabold tracking-tight text-primary">OFIX</span>
              <p className="max-w-xs text-sm text-muted-foreground">
                Tu solución confiable, a un clic. El marketplace de oficios verificados de Argentina.
              </p>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold">Producto</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#como-funciona" className="transition-colors hover:text-foreground">
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a href="#beneficios" className="transition-colors hover:text-foreground">
                    Beneficios
                  </a>
                </li>
                <li>
                  <a href="#categorias" className="transition-colors hover:text-foreground">
                    Oficios
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold">Cuenta</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/auth/login" className="transition-colors hover:text-foreground">
                    Ingresar
                  </Link>
                </li>
                <li>
                  <Link to="/auth/register?role=user" className="transition-colors hover:text-foreground">
                    Soy cliente
                  </Link>
                </li>
                <li>
                  <Link to="/auth/register?role=worker" className="transition-colors hover:text-foreground">
                    Soy trabajador
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold">OFIX te cuida</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-success" /> Verificación KYC
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-primary" /> Pago protegido
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Umbrella className="h-4 w-4 text-accent" /> Seguro por servicio
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 text-sm text-muted-foreground md:flex-row">
            <p>© 2026 OFIX. Hecho en Argentina.</p>
            <p>Tu solución confiable, a un clic.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

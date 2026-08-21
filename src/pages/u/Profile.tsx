import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Building2,
  ClipboardList,
  Briefcase,
  Wallet,
  Heart,
  Star,
  Settings,
  ArrowRight,
  CheckCircle2,
  Crown,
  CalendarDays,
  Repeat,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClickableCard } from "@/components/ofix/ClickableCard";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { StatCard } from "@/components/ofix/StatCard";
import { ReviewList } from "@/components/ofix/ReviewList";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { CLIENT_TYPE_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [, refresh] = useReducer((x: number) => x + 1, 0);

  if (!user) return null;

  const offers = store.getOffers({ authorId: user.id });
  const jobs = store.getJobs({ clientId: user.id });
  const completed = jobs.filter((j) => j.status === "completado");
  const favorites = store.getFavorites(user.id);
  const periods = store.getBillingPeriods(user.id);
  const totalSpent = periods.reduce((s, p) => s + p.total, 0);
  const isAdmin = user.clientType === "administrador_consorcio";
  const isPyme = user.clientType === "pyme_gastronomica";
  const properties = isAdmin ? store.getProperties(user.id) : [];
  const recurring = store.getRecurringPlans(user.id).filter((p) => p.active);
  const isPlus = user.clientPlan === "plus";

  // Profesionales que más contrató: el activo real de confianza del cliente.
  const byWorker = new Map<string, number>();
  completed.forEach((j) => byWorker.set(j.workerId, (byWorker.get(j.workerId) || 0) + 1));
  const trusted = [...byWorker.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, count]) => ({ worker: store.getWorker(id), count }))
    .filter((x) => x.worker);

  // Completitud del perfil: un perfil completo genera confianza en el profesional
  // que va a entrar a tu casa, así que vale empujarlo.
  const checks = [
    { key: "photo", label: "Foto de perfil", done: !!user.photo },
    { key: "phone", label: "Teléfono de contacto", done: !!user.phone },
    { key: "address", label: "Dirección", done: !!user.address },
    { key: "zone", label: "Zona", done: !!user.zone },
  ];
  const doneCount = checks.filter((c) => c.done).length;
  const completeness = Math.round((doneCount / checks.length) * 100);

  const memberSince = new Date(user.createdAt).toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Va por auth y no por store.setClientPlan: así la escritura es una sola y
  // el usuario del store de zustand queda sincronizado en el mismo paso.
  const togglePlan = async () => {
    try {
      await updateUser({ clientPlan: isPlus ? "free" : "plus" });
      toast.success(isPlus ? "Volviste al plan gratuito" : "¡Bienvenido a OFIX Plus!");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo cambiar el plan");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mi perfil"
        action={
          <>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/u/settings")}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </>
        }
      />

      {/* Encabezado del perfil */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-primary" />
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <UserAvatar
              name={user.name}
              photo={user.photo}
              className="-mt-12 h-24 w-24 shrink-0 border-4 border-card shadow-lg"
            />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
                {isPlus && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-semibold text-accent">
                    <Crown className="h-3.5 w-3.5" />
                    Plus
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  {user.clientType ? CLIENT_TYPE_LABELS[user.clientType] : "Cliente"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <span className="capitalize">Miembro desde {memberSince}</span>
                </span>
              </div>
              {(user.reviewCount || 0) > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating value={user.rating || 0} showValue count={user.reviewCount} />
                  <span className="text-xs text-muted-foreground">como cliente</span>
                </div>
              )}
            </div>
          </div>

          {/* Datos de contacto */}
          <div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-2">
            <ContactRow icon={Mail} label="Email" value={user.email} />
            <ContactRow icon={Phone} label="Teléfono" value={user.phone} />
            <ContactRow icon={MapPin} label="Dirección" value={user.address} />
            <ContactRow icon={MapPin} label="Zona" value={user.zone} />
          </div>
        </CardContent>
      </Card>

      {/* Completitud del perfil */}
      {completeness < 100 && (
        <Card className="border-accent/30 bg-accent-light/40">
          <CardContent className="p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">Completá tu perfil</p>
                <p className="text-sm text-muted-foreground">
                  Un perfil completo le da confianza al profesional que va a ir a tu casa.
                </p>
              </div>
              <span className="text-2xl font-bold text-accent">{completeness}%</span>
            </div>
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-background">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${completeness}%` }} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {checks.map((c) => (
                <span
                  key={c.key}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs",
                    c.done ? "text-success" : "text-muted-foreground",
                  )}
                >
                  <CheckCircle2 className={cn("h-3.5 w-3.5", !c.done && "opacity-40")} />
                  {c.label}
                </span>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={() => navigate("/u/settings")}>
              <Settings className="h-4 w-4" />
              Completar datos
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Actividad */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mi actividad</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={ClipboardList} label="Solicitudes publicadas" value={offers.length} tone="primary" />
          <StatCard
            icon={Briefcase}
            label="Trabajos completados"
            value={completed.length}
            tone="success"
            hint={jobs.length > completed.length ? `${jobs.length - completed.length} en curso` : undefined}
          />
          <StatCard icon={Wallet} label="Total invertido" value={money(totalSpent)} tone="accent" />
          <StatCard icon={Heart} label="Favoritos" value={favorites.length} tone="muted" />
        </div>
      </section>

      {/* Panel según el tipo de cliente */}
      {(isAdmin || isPyme) && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            {isAdmin ? "Administración de consorcios" : "Mi negocio"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {isAdmin && (
              <QuickLink
                icon={Building2}
                label="Mis propiedades"
                hint={`${properties.length} ${properties.length === 1 ? "edificio" : "edificios"}`}
                onClick={() => navigate("/u/properties")}
              />
            )}
            <QuickLink
              icon={Repeat}
              label="Mantenimiento programado"
              hint={recurring.length > 0 ? `${recurring.length} planes activos` : "Sin planes activos"}
              onClick={() => navigate("/u/recurring")}
            />
            <QuickLink
              icon={ClipboardList}
              label={isAdmin ? "Panel de administración" : "Panel PyME"}
              hint="Facturación y reportes"
              onClick={() => navigate("/u/business")}
            />
          </div>
        </section>
      )}

      {/* Profesionales de confianza */}
      {trusted.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Tus profesionales de confianza</h2>
          <p className="-mt-2 text-sm text-muted-foreground">Los que más contrataste, con trabajos completados.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {trusted.map(({ worker, count }) => (
              <ClickableCard key={worker!.id} onClick={() => navigate(`/u/workers/${worker!.id}`)}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <UserAvatar name={worker!.name} photo={worker!.photo} className="h-11 w-11 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{worker!.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{worker!.trade}</p>
                    <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-success">
                      <ShieldCheck className="h-3 w-3" />
                      {count} {count === 1 ? "trabajo" : "trabajos"}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </ClickableCard>
            ))}
          </div>
        </section>
      )}

      {/* Plan */}
      <Card className={cn(isPlus ? "border-accent/40 bg-accent-light/30" : undefined)}>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <Crown className={cn("h-5 w-5", isPlus ? "text-accent" : "text-muted-foreground")} />
            {isPlus ? "OFIX Plus" : "Plan gratuito"}
          </CardTitle>
          <Button variant={isPlus ? "outline" : "default"} size="sm" onClick={togglePlan}>
            {isPlus ? "Volver al gratuito" : "Pasar a Plus"}
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {[
              "Acceso prioritario a profesionales verificados",
              "Atención de urgencias con prioridad en la búsqueda",
              "Seguro del servicio incluido sin cargo extra",
              "Soporte dedicado y gestión de reclamos ágil",
            ].map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", isPlus ? "text-accent" : "text-muted-foreground/40")} />
                <span className={isPlus ? undefined : "text-muted-foreground"}>{perk}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Reseñas recibidas — con réplica y sello de verificada */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reseñas que recibiste</h2>
        <p className="-mt-2 text-sm text-muted-foreground">
          Los profesionales también te califican. Podés responder cada reseña una vez.
        </p>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <ReviewList targetId={user.id} />
          </CardContent>
        </Card>
      </section>

      {/* Configuración */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Cuenta</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickLink icon={Settings} label="Configuración" hint="Datos, notificaciones y tema" onClick={() => navigate("/u/settings")} />
          <QuickLink icon={Star} label="Mis favoritos" hint={`${favorites.length} profesionales guardados`} onClick={() => navigate("/u/favorites")} />
        </div>
      </section>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {value ? (
          <p className="truncate font-medium">{value}</p>
        ) : (
          <p className="italic text-muted-foreground/70">Sin completar</p>
        )}
      </div>
    </div>
  );
}

function QuickLink({
  icon: Icon,
  label,
  hint,
  onClick,
}: {
  icon: typeof Mail;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <ClickableCard onClick={onClick}>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{label}</p>
            <p className="truncate text-xs text-muted-foreground">{hint}</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </CardContent>
    </ClickableCard>
  );
}

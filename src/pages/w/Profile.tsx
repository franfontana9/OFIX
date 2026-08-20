import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Pencil, LogOut, MapPin, DollarSign, Briefcase, Star, ShieldCheck, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StatCard } from "@/components/ofix/StatCard";
import { StarRating } from "@/components/ofix/StarRating";
import { VerificationBadge, LevelBadge } from "@/components/ofix/badges";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import type { WorkerLevel } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

export default function WorkerProfile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [available, setAvailable] = useState(user?.available ?? true);
  if (!user) return null;

  const toggleAvailable = () => {
    const next = !available;
    setAvailable(next);
    updateUser({ available: next });
    toast.success(next ? "Disponible para emergencias" : "No disponible para emergencias");
  };

  const trades = user.trades && user.trades.length ? user.trades : user.trade ? [user.trade] : [];
  const verification = user.verification || { identity: false, background: false, license: false };
  const reviews = store.getReviews({ targetId: user.id });

  const checks: { key: keyof typeof verification; label: string; hint: string }[] = [
    { key: "identity", label: "Identidad (DNI)", hint: "Validamos tu documento de identidad." },
    { key: "background", label: "Antecedentes", hint: "Verificación de antecedentes penales." },
    { key: "license", label: "Matrícula / título", hint: "Matrícula profesional o certificación del oficio." },
  ];
  const missing = checks.some((c) => !verification[c.key]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mi perfil"
        subtitle="Así te ven los clientes en OFIX"
        action={
          <>
            <Button className="gap-2" onClick={() => navigate("/w/settings")}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="ghost" className="gap-2 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </>
        }
      />

      {/* Cabecera */}
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
          <UserAvatar name={user.name} photo={user.photo} className="h-24 w-24 shrink-0 text-2xl" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <VerificationBadge verified={user.verified} />
              {user.level && <LevelBadge level={user.level as WorkerLevel} />}
            </div>
            {trades.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {trades.map((t) => (
                  <span key={t} className="rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <StarRating value={user.rating || 0} showValue count={user.reviewCount || 0} />
            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {user.coverageZone && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {user.coverageZone}
                </span>
              )}
              {typeof user.hourlyRate === "number" && (
                <span className="inline-flex items-center gap-2">
                  <DollarSign className="h-4 w-4 shrink-0" />${user.hourlyRate.toLocaleString()} / hora
                </span>
              )}
            </div>
            {user.bio && <p className="text-sm leading-relaxed text-foreground/80">{user.bio}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Disponibilidad para emergencias */}
      <button
        type="button"
        onClick={toggleAvailable}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors",
          available ? "border-success/40 bg-success-light/60" : "hover:bg-muted/50",
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-full", available ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
            <Siren className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Disponible para emergencias</p>
            <p className="text-sm text-muted-foreground">Recibí solicitudes urgentes de clientes cercanos.</p>
          </div>
        </div>
        <span className={cn("h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors", available ? "bg-success" : "bg-muted-foreground/30")}>
          <span className={cn("block h-5 w-5 rounded-full bg-white transition-transform", available && "translate-x-5")} />
        </span>
      </button>

      {/* Verificación (Seguro y vigencia) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-success" />
            Verificación (Seguro y vigencia)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.map((c) => {
            const ok = verification[c.key];
            return (
              <div key={c.key} className="flex items-start gap-3">
                {ok ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/40" />
                )}
                <div className="min-w-0">
                  <p className="font-medium">{c.label}</p>
                  <p className="text-sm text-muted-foreground">{c.hint}</p>
                </div>
              </div>
            );
          })}
          {missing && (
            <Button variant="outline" className="mt-2 w-full sm:w-auto" onClick={() => navigate("/w/verification")}>
              Completar verificación
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Mi actividad */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mi actividad</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard icon={Briefcase} label="Trabajos realizados" value={user.jobsDone || 0} tone="primary" />
          <StatCard
            icon={Star}
            label="Calificación"
            value={user.rating ? user.rating.toFixed(1) : "—"}
            tone="accent"
            hint={`${user.reviewCount || 0} reseñas`}
          />
        </div>
      </section>

      {/* Historial de trabajos */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Historial de trabajos</h2>
        {store.getJobs({ workerId: user.id, status: "completado" }).length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Todavía no completaste trabajos.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {store.getJobs({ workerId: user.id, status: "completado" }).map((j) => {
              const client = store.getUser(j.clientId);
              return (
                <Card key={j.id}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-light text-success">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{j.title}</span>
                        <span className="text-sm font-semibold">${j.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="rounded-full bg-muted px-2 py-0.5">{j.category}</span>
                        {j.completedAt && <span>{formatDate(j.completedAt)}</span>}
                        {client && <span>· {client.name}</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Reseñas recibidas */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reseñas recibidas</h2>
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Todavía no recibiste reseñas.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => {
              const author = store.getUser(r.authorId);
              return (
                <Card key={r.id}>
                  <CardContent className="flex gap-4 p-4">
                    <UserAvatar name={author?.name || "?"} photo={author?.photo} className="h-11 w-11 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">{author?.name || "Usuario"}</p>
                        <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                      </div>
                      <StarRating value={r.stars} size={14} />
                      {r.comment && <p className="mt-1 text-sm text-foreground/80">{r.comment}</p>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

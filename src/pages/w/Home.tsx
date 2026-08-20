import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Briefcase, Star, Wallet, Search, Plus, Banknote, Handshake, ArrowRight, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StatCard } from "@/components/ofix/StatCard";
import { JobStatusBadge, UrgencyBadge } from "@/components/ofix/badges";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

export default function WorkerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const stats = store.getWorkerStats(user!.id);
  const jobs = store.getJobs({ workerId: user!.id }).slice(0, 4);

  const trades = user?.trades || (user?.trade ? [user.trade] : []);
  const emergencies = store
    .getOffers({ emergency: true, status: "abierta" })
    .filter((o) => trades.includes(o.category));

  return (
    <div className="space-y-8">
      <PageHeader title={`Hola, ${user?.name?.split(" ")[0]}`} subtitle="Este es el resumen de tu actividad en OFIX." />

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Trabajos completados" value={stats.totalJobs} tone="success" />
        <StatCard icon={Briefcase} label="Trabajos activos" value={stats.activeJobs} tone="primary" />
        <StatCard icon={Star} label="Calificación" value={stats.rating ? stats.rating.toFixed(1) : "—"} tone="accent" hint={`${stats.reviewCount} reseñas`} />
        <StatCard icon={Wallet} label="Ingresos disponibles" value={`$${stats.wallet.available.toLocaleString()}`} tone="success" />
      </div>

      {/* Emergencias cercanas */}
      {emergencies.length > 0 && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2 text-destructive">
              <Siren className="h-5 w-5" />
              <h2 className="text-lg font-semibold">🚨 Emergencias cerca</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Solicitudes urgentes que coinciden con tus oficios.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {emergencies.map((o) => (
                <Link key={o.id} to={`/w/jobs/${o.id}`}>
                  <Card className="cursor-pointer border-destructive/30 transition-shadow hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{o.title}</h3>
                        <UrgencyBadge urgency={o.urgency} />
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{o.description}</p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{o.location}</span>
                        <span className="font-semibold">${o.budget.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accesos rápidos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction icon={Search} label="Buscar trabajos" hint="Solicitudes abiertas" onClick={() => navigate("/w/jobs")} />
        <QuickAction icon={Plus} label="Publicar servicio" hint="Sumá tu oficio" onClick={() => navigate("/w/services/new")} />
        <QuickAction icon={Banknote} label="Cobros" hint="Tu billetera" onClick={() => navigate("/w/cobros")} />
        <QuickAction icon={Handshake} label="Mis acuerdos" hint="Trabajos en curso" onClick={() => navigate("/w/agreements")} />
      </div>

      {/* Trabajos recientes / activos */}
      {jobs.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Trabajos recientes</h2>
            <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate("/w/agreements")}>
              Ver acuerdos <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {jobs.map((j) => (
              <Card key={j.id} className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => navigate(`/w/agreements/${j.id}`)}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{j.title}</h3>
                    <JobStatusBadge status={j.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{j.category}</span>
                    <span className="font-semibold">${j.amount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function QuickAction({ icon: Icon, label, hint, onClick }: { icon: typeof Plus; label: string; hint: string; onClick: () => void }) {
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={onClick}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

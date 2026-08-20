import { useNavigate } from "react-router-dom";
import { Plus, Search, ClipboardList, Siren, ArrowRight, Inbox, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { CategoryTile } from "@/components/ofix/CategoryIcon";
import { WorkerCard } from "@/components/ofix/WorkerCard";
import { EmergencyButton } from "@/components/ofix/EmergencyButton";
import { OfferStatusBadge, UrgencyBadge } from "@/components/ofix/badges";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";

export default function UserHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const requests = store.getOffers({ authorId: user?.id });
  const recommended = store.getRecommendedWorkers(6);
  // Profesionales que pueden ir AHORA en la zona del cliente.
  const availableNow = store.getAvailableNowCount({ zone: user?.zone });
  // Propuestas pendientes de revisar sobre las solicitudes abiertas del cliente.
  const proposalsReceived = requests
    .filter((o) => o.status === "abierta")
    .reduce((total, o) => total + store.getProposals({ offerId: o.id, status: "enviada" }).length, 0);

  return (
    <div className="space-y-8">
      <PageHeader title={`Hola, ${user?.name?.split(" ")[0]}`} subtitle="¿Qué necesitás resolver hoy?" />

      {/* Urgencia + emergencia */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glow-primary col-span-2 overflow-hidden bg-gradient-primary text-primary-foreground">
          <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
            <div>
              <h2 className="text-xl font-bold">¿Tenés una urgencia?</h2>
              <p className="text-sm text-primary-foreground/80">Publicá tu solicitud y recibí propuestas de profesionales verificados.</p>
            </div>
            <Button variant="secondary" className="w-fit gap-2" onClick={() => navigate("/u/requests/new")}>
              <Plus className="h-4 w-4" />
              Nueva solicitud
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center gap-3 border-destructive/30 bg-destructive/5 p-6 text-center">
          <Siren className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-semibold">Emergencia</p>
            <p className="text-xs text-muted-foreground">Un profesional lo antes posible</p>
          </div>
          <EmergencyButton full />
        </Card>
      </div>

      {/* Cuántos pueden ir AHORA: el dolor #1 de la investigación */}
      {availableNow > 0 && (
        <Card className="border-success/30 bg-success-light/50">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute h-3 w-3 animate-ping rounded-full bg-success opacity-75" />
                <span className="h-2 w-2 rounded-full bg-success" />
              </span>
              <p className="text-sm">
                <span className="font-semibold text-success">{availableNow} profesionales disponibles ahora</span>
                {user?.zone && <span className="text-muted-foreground"> cerca de {user.zone.split(",")[0]}</span>}
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/u/search?ahora=1")}>
              Ver quiénes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Los 3 accesos directos del prototipo de la tesis (2.12.4) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickAction icon={Search} label="Buscar profesionales" hint="Por oficio y zona" onClick={() => navigate("/u/search")} />
        <QuickAction
          icon={Inbox}
          label="Ofertas recibidas"
          hint={proposalsReceived > 0 ? `${proposalsReceived} para revisar` : "Sin propuestas nuevas"}
          onClick={() => navigate("/u/requests")}
        />
        <QuickAction icon={Briefcase} label="Mis trabajos" hint="Acuerdos y seguimiento" onClick={() => navigate("/u/jobs")} />
      </div>

      {/* Categorías */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Categorías de trabajadores</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((c) => (
            <CategoryTile key={c} category={c} onClick={() => navigate(`/u/search?cat=${encodeURIComponent(c)}`)} />
          ))}
        </div>
      </section>

      {/* Trabajadores recomendados */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trabajadores recomendados</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate("/u/search")}>
            Ver todos <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recommended.map((w) => (
            <WorkerCard key={w.id} worker={w} onClick={() => navigate(`/u/workers/${w.id}`)} />
          ))}
        </div>
      </section>

      {/* Solicitudes recientes */}
      {requests.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tus solicitudes recientes</h2>
            <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate("/u/requests")}>
              Ver todas <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {requests.slice(0, 4).map((o) => (
              <Card key={o.id} className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => navigate(`/u/requests/${o.id}`)}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{o.title}</h3>
                    <OfferStatusBadge status={o.status} />
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{o.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <UrgencyBadge urgency={o.urgency} />
                    <span className="font-semibold">${o.budget.toLocaleString()}</span>
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

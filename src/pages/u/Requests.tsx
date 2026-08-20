import { useNavigate } from "react-router-dom";
import { Plus, ClipboardList, MessageSquare, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ofix/PageHeader";
import { OfferStatusBadge, UrgencyBadge } from "@/components/ofix/badges";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import type { Offer, OfferStatus } from "@/lib/types";

const TABS: { value: string; label: string; status?: OfferStatus }[] = [
  { value: "todas", label: "Todas" },
  { value: "abierta", label: "Abiertas", status: "abierta" },
  { value: "asignada", label: "Asignadas", status: "asignada" },
  { value: "completada", label: "Completadas", status: "completada" },
];

export default function UserRequests() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const offers = store.getOffers({ authorId: user?.id });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis solicitudes"
        subtitle="Seguí el estado de tus pedidos y las propuestas que recibís"
        action={
          <Button className="gap-2" onClick={() => navigate("/u/requests/new")}>
            <Plus className="h-4 w-4" /> Nueva
          </Button>
        }
      />

      <Tabs defaultValue="todas">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => {
          const list = t.status ? offers.filter((o) => o.status === t.status) : offers;
          return (
            <TabsContent key={t.value} value={t.value} className="mt-4">
              {list.length === 0 ? (
                <EmptyState onNew={() => navigate("/u/requests/new")} />
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {list.map((o) => (
                    <RequestCard key={o.id} offer={o} onClick={() => navigate(`/u/requests/${o.id}`)} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function RequestCard({ offer, onClick }: { offer: Offer; onClick: () => void }) {
  const proposals = store.getProposals({ offerId: offer.id }).length;
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={onClick}>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold">{offer.title}</h3>
          <OfferStatusBadge status={offer.status} />
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{offer.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <UrgencyBadge urgency={offer.urgency} />
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{offer.category}</span>
          <span className="font-semibold">${offer.budget.toLocaleString()}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-3 w-3" /> {proposals} {proposals === 1 ? "propuesta" : "propuestas"}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" /> {new Date(offer.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
          <ClipboardList className="h-7 w-7" />
        </div>
        <div>
          <p className="font-semibold">No tenés solicitudes acá</p>
          <p className="text-sm text-muted-foreground">Publicá una solicitud y recibí propuestas de profesionales verificados.</p>
        </div>
        <Button className="gap-2" onClick={onNew}>
          <Plus className="h-4 w-4" /> Nueva solicitud
        </Button>
      </CardContent>
    </Card>
  );
}

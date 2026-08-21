import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ClickableCard } from "@/components/ofix/ClickableCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ofix/PageHeader";
import { ProposalStatusBadge } from "@/components/ofix/badges";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import type { ProposalStatus } from "@/lib/types";

type Filter = "todas" | ProposalStatus;

const TABS: { value: Filter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "enviada", label: "Enviadas" },
  { value: "aceptada", label: "Aceptadas" },
  { value: "rechazada", label: "Rechazadas" },
  { value: "finalizada", label: "Finalizadas" },
];

export default function WorkerProposals() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("todas");

  const proposals = store.getProposals({ workerId: user!.id });
  const filtered = filter === "todas" ? proposals : proposals.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Mis propuestas" subtitle="Seguí el estado de las ofertas que enviaste." />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="flex-wrap">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No tenés propuestas {filter !== "todas" ? "en este estado" : "todavía"}</p>
            <p className="text-sm text-muted-foreground">Buscá trabajos abiertos y enviá tu primera oferta.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((p) => {
            const offer = store.getOffer(p.offerId);
            return (
              <ClickableCard key={p.id} onClick={() => navigate(`/w/jobs/${p.offerId}`)}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{offer?.title ?? "Solicitud"}</h3>
                      {offer && <span className="text-sm text-muted-foreground">{offer.category}</span>}
                    </div>
                    <ProposalStatusBadge status={p.status} />
                  </div>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{p.message}</p>
                  <div className="flex items-center justify-between border-t pt-3 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />{new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-semibold">${p.price.toLocaleString()}</span>
                  </div>
                </CardContent>
              </ClickableCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

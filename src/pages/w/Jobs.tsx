import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ClickableCard } from "@/components/ofix/ClickableCard";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UrgencyBadge } from "@/components/ofix/badges";
import { cn } from "@/lib/utils";
import { store } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";

const ALL = "__all__";

export default function WorkerJobs() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>(ALL);
  const [q, setQ] = useState("");

  const offers = store.getOffers({
    status: "abierta",
    category: category === ALL ? undefined : category,
    q: q || undefined,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Buscar trabajos" subtitle="Solicitudes abiertas de clientes cerca tuyo." />

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por título o descripción..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas las categorías</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resultados */}
      {offers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No hay solicitudes abiertas</p>
            <p className="text-sm text-muted-foreground">Probá con otra categoría o volvé más tarde.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((o) => {
            const client = store.getUser(o.authorId);
            return (
              <ClickableCard
                key={o.id}
                onClick={() => navigate(`/w/jobs/${o.id}`)}
                className={cn("cursor-pointer transition-shadow hover:shadow-lg", o.emergency && "border-destructive/50 bg-destructive/5")}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{o.title}</h3>
                    <UrgencyBadge urgency={o.urgency} className={o.emergency ? "ring-1 ring-destructive" : undefined} />
                  </div>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{o.description}</p>
                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{o.category}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{o.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-sm text-muted-foreground">{client?.name ?? "Cliente"}</span>
                    <span className="font-semibold">${o.budget.toLocaleString()}</span>
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

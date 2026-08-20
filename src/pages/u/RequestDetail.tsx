import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Wallet, MessageSquare, Check, X, CalendarClock, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StarRating } from "@/components/ofix/StarRating";
import { UrgencyBadge, OfferStatusBadge, ProposalStatusBadge } from "@/components/ofix/badges";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import type { Proposal } from "@/lib/types";

export default function UserRequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const offer = id ? store.getOffer(id) : null;

  if (!offer) {
    return (
      <div>
        <PageHeader title="Solicitud" back />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No encontramos la solicitud que buscás.
          </CardContent>
        </Card>
      </div>
    );
  }

  const proposals = store.getProposals({ offerId: offer.id });
  const isOpen = offer.status === "abierta";
  const accepted = proposals.find((p) => p.status === "aceptada");

  // Comparación de propuestas enviadas (activas).
  const sent = proposals.filter((p) => p.status === "enviada");
  const showCompare = sent.length >= 2;

  const cheapest = showCompare
    ? sent.reduce((a, b) => (b.price < a.price ? b : a))
    : undefined;

  const withRating = sent
    .map((p) => ({ p, rating: store.getWorker(p.workerId)?.rating || 0 }))
    .filter((x) => x.rating > 0);
  const bestRated = showCompare && withRating.length
    ? withRating.reduce((a, b) => (b.rating > a.rating ? b : a))
    : undefined;

  // "Más rápida": heurística sobre el texto de disponibilidad.
  const speedRank = (a?: string) => {
    const t = (a || "").toLowerCase();
    if (/hoy|inmediat|ya |ahora/.test(t)) return 0;
    if (/mañana/.test(t)) return 1;
    if (a) return 2;
    return 3;
  };
  const fastest = showCompare
    ? [...sent].sort((a, b) => speedRank(a.availability) - speedRank(b.availability))[0]
    : undefined;
  const hasFastest = fastest && fastest.availability;

  const handleAccept = (p: Proposal) => {
    try {
      const job = store.acceptProposal(p.id);
      toast.success("¡Propuesta aceptada! Continuá con el pago.");
      navigate(`/u/requests/${offer.id}/hire?job=${job.id}`);
    } catch (err) {
      toast.error((err as Error).message || "No se pudo aceptar la propuesta");
    }
  };

  const handleReject = (p: Proposal) => {
    try {
      store.updateProposal(p.id, "rechazada");
      toast.success("Propuesta rechazada");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo rechazar la propuesta");
    }
  };

  const chatWith = (workerId: string) => {
    if (!user) return;
    const chat = store.createChat(user.id, workerId);
    navigate(`/u/chat/${chat.id}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader title={offer.title} back />

      {/* Detalle de la solicitud */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <OfferStatusBadge status={offer.status} />
            <UrgencyBadge urgency={offer.urgency} />
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{offer.category}</span>
          </div>
          <p className="text-sm">{offer.description}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {offer.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Wallet className="h-4 w-4" /> Presupuesto:{" "}
              <span className="font-semibold text-foreground">${offer.budget.toLocaleString()}</span>
            </span>
            {offer.scheduledDate && (
              <span className="inline-flex items-center gap-1">
                <CalendarClock className="h-4 w-4" /> {new Date(offer.scheduledDate).toLocaleDateString()}
              </span>
            )}
          </div>
          {offer.images && offer.images.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium">Fotos del problema</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {offer.images.map((src, i) => (
                  <a key={i} href={src} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-lg border">
                    <img src={src} alt={`Foto ${i + 1}`} className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solicitud ya asignada */}
      {accepted && (
        <Card className="border-success/30 bg-success-light">
          <CardContent className="flex items-center gap-3 p-4 text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            <span>
              Aceptaste la propuesta de{" "}
              <span className="font-semibold">{store.getWorker(accepted.workerId)?.name || "un profesional"}</span> por{" "}
              <span className="font-semibold">${accepted.price.toLocaleString()}</span>.
            </span>
          </CardContent>
        </Card>
      )}

      {/* Propuestas recibidas */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Propuestas recibidas ({proposals.length})</h2>

        {/* Resumen comparativo */}
        {showCompare && (
          <Card className="border-primary/20 bg-primary-light/40">
            <CardContent className="p-4">
              <p className="mb-3 text-sm font-medium">Comparativa rápida de {sent.length} propuestas</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {cheapest && (
                  <div className="rounded-lg border bg-background p-3">
                    <p className="inline-flex items-center gap-1 text-xs font-semibold text-success">💰 Mejor precio</p>
                    <p className="mt-1 font-semibold">${cheapest.price.toLocaleString()}</p>
                    <p className="truncate text-xs text-muted-foreground">{store.getWorker(cheapest.workerId)?.name || "Profesional"}</p>
                  </div>
                )}
                {bestRated && (
                  <div className="rounded-lg border bg-background p-3">
                    <p className="inline-flex items-center gap-1 text-xs font-semibold text-accent">⭐ Mejor calificado</p>
                    <p className="mt-1 inline-flex items-center gap-1 font-semibold">
                      <Star className="h-4 w-4 fill-accent text-accent" /> {bestRated.rating.toFixed(1)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{store.getWorker(bestRated.p.workerId)?.name || "Profesional"}</p>
                  </div>
                )}
                {hasFastest && (
                  <div className="rounded-lg border bg-background p-3">
                    <p className="inline-flex items-center gap-1 text-xs font-semibold text-primary">⚡ Más rápido</p>
                    <p className="mt-1 truncate text-sm font-semibold">{fastest!.availability}</p>
                    <p className="truncate text-xs text-muted-foreground">{store.getWorker(fastest!.workerId)?.name || "Profesional"}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {proposals.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no recibiste propuestas. Te avisamos cuando llegue la primera.</p>
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => {
              const worker = store.getWorker(p.workerId);
              const isCheapest = cheapest?.id === p.id;
              const isBestRated = bestRated?.p.id === p.id;
              const highlighted = isCheapest || isBestRated;
              return (
                <Card key={p.id} className={highlighted ? "border-primary/40 ring-1 ring-primary/20" : undefined}>
                  <CardContent className="space-y-3 p-4">
                    {(isCheapest || isBestRated) && (
                      <div className="flex flex-wrap gap-2">
                        {isCheapest && (
                          <span className="rounded-full bg-success-light px-2 py-0.5 text-xs font-semibold text-success">💰 Mejor precio</span>
                        )}
                        {isBestRated && (
                          <span className="rounded-full bg-accent-light px-2 py-0.5 text-xs font-semibold text-accent">⭐ Mejor calificado</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <button
                          className="font-semibold hover:underline"
                          onClick={() => navigate(`/u/workers/${p.workerId}`)}
                        >
                          {worker?.name || "Profesional"}
                        </button>
                        {worker && <StarRating value={worker.rating || 0} size={14} showValue count={worker.reviewCount} />}
                      </div>
                      <ProposalStatusBadge status={p.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{p.message}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                      <span className="inline-flex items-center gap-1">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">${p.price.toLocaleString()}</span>
                      </span>
                      {p.availability && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <CalendarClock className="h-4 w-4" /> {p.availability}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => chatWith(p.workerId)}>
                        <MessageSquare className="h-4 w-4" /> Chatear
                      </Button>
                      {isOpen && p.status === "enviada" && (
                        <>
                          <Button size="sm" className="gap-1" onClick={() => handleAccept(p)}>
                            <Check className="h-4 w-4" /> Aceptar
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1 text-destructive" onClick={() => handleReject(p)}>
                            <X className="h-4 w-4" /> Rechazar
                          </Button>
                        </>
                      )}
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

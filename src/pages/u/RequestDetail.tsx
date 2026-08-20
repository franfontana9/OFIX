import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Wallet,
  MessageSquare,
  Check,
  X,
  CalendarClock,
  CheckCircle2,
  Star,
  Radar,
  Timer,
  Siren,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Users,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StarRating } from "@/components/ofix/StarRating";
import { AvailabilityBadge } from "@/components/ofix/AvailabilityBadge";
import { UrgencyBadge, OfferStatusBadge, ProposalStatusBadge } from "@/components/ofix/badges";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ESCALATION_RADIUS_STEPS_KM, RESPONSE_WINDOW_MINUTES, type Proposal } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;
const hour = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

export default function UserRequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  // El store es sincrónico y mutable: forzamos re-render después de cada mutación
  // y también cada 10s para que corra la ventana de respuesta de las urgencias.
  const [, refresh] = useReducer((x: number) => x + 1, 0);
  const [confirmAuto, setConfirmAuto] = useState(false);

  const offer = id ? store.getOffer(id) : null;

  // Búsqueda activa de una urgencia: solo ahí corre el countdown.
  const liveSearch = !!offer && offer.urgency === "inmediata" && offer.status === "abierta";

  useEffect(() => {
    if (!liveSearch) return;
    const timer = setInterval(() => refresh(), 10000);
    return () => clearInterval(timer);
  }, [liveSearch]);

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
  const isOwner = !!user && user.id === offer.authorId;
  const accepted = proposals.find((p) => p.status === "aceptada");

  // ── Urgencia: ventana de respuesta, radio y escalados ──
  const minutesLeft = liveSearch ? store.getResponseWindowMinutes(offer.id) : null;
  const windowOver = minutesLeft !== null && minutesLeft <= 0;
  const windowProgress =
    minutesLeft === null ? 0 : Math.min(100, Math.max(0, (minutesLeft / RESPONSE_WINDOW_MINUTES) * 100));
  const currentRadius = offer.radiusKm ?? ESCALATION_RADIUS_STEPS_KM[0];
  const nextRadius = ESCALATION_RADIUS_STEPS_KM.find((r) => r > currentRadius);
  const notifiedCount = offer.notifiedWorkerIds?.length ?? 0;
  const escalations = offer.escalations ?? [];

  // Precio de referencia de la categoría (contexto para el aviso de precio alto).
  const priceRef = store.getPriceReference(offer.category);

  // ── Comparación de propuestas enviadas (activas) ──
  const sent = proposals.filter((p) => p.status === "enviada");
  const showCompare = sent.length >= 2;

  const cheapest = showCompare ? sent.reduce((a, b) => (b.price < a.price ? b : a)) : undefined;

  const withRating = sent
    .map((p) => ({ p, rating: store.getWorker(p.workerId)?.rating || 0 }))
    .filter((x) => x.rating > 0);
  const bestRated =
    showCompare && withRating.length ? withRating.reduce((a, b) => (b.rating > a.rating ? b : a)) : undefined;

  // "Más rápida": si hay ETA declarado gana el ETA; si no, heurística sobre el texto.
  const withEta = sent.filter((p): p is Proposal & { etaMinutes: number } => typeof p.etaMinutes === "number");
  const fastestByEta =
    showCompare && withEta.length ? withEta.reduce((a, b) => (b.etaMinutes < a.etaMinutes ? b : a)) : undefined;

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
  const fastestId = fastestByEta?.id ?? (hasFastest ? fastest!.id : undefined);

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

  // Escalado manual: amplía el radio y vuelve a notificar.
  const handleEscalate = () => {
    try {
      const { notified, radiusKm } = store.escalateOffer(offer.id);
      toast.success(
        `Ampliamos la búsqueda a ${radiusKm} km. ${
          notified > 0
            ? `Avisamos a ${notified} profesional${notified === 1 ? "" : "es"} más.`
            : "Por ahora no hay nuevos profesionales disponibles en ese radio."
        }`,
      );
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo ampliar la búsqueda");
    }
  };

  // Asignación automática por cercanía (diferencial de la matriz de posicionamiento).
  const handleAutoAssign = () => {
    try {
      const result = store.autoAssignNearest(offer.id);
      setConfirmAuto(false);
      toast.success(
        `Asignamos a ${result.worker.name}, a ${result.distance.toFixed(1)} km. Llega en ~${result.etaMinutes} min.`,
      );
      navigate(`/u/jobs/${result.job.id}`);
    } catch (err) {
      toast.error((err as Error).message || "No pudimos asignar un profesional");
      refresh();
    }
  };

  const chatWith = (workerId: string) => {
    if (!user) return;
    const chat = store.createChat(user.id, workerId);
    navigate(`/u/chat/${chat.id}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={offer.title}
        subtitle={`${offer.category} · ${offer.location}`}
        back
        action={<OfferStatusBadge status={offer.status} />}
      />

      {/* ── Urgencia: ventana de respuesta, radio y acciones ── */}
      {liveSearch && (
        <Card className="overflow-hidden border-destructive/30 bg-destructive/5">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  {!windowOver && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-destructive/25" />
                  )}
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-destructive text-white">
                    <Siren className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-tight">
                    {windowOver ? "Nadie respondió todavía" : "Buscando profesional"}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {windowOver
                      ? "Ampliá el radio de búsqueda o asignale la urgencia al más cercano."
                      : "Estamos avisando a los profesionales disponibles más cercanos."}
                  </p>
                </div>
              </div>

              <div className="text-right">
                {minutesLeft === null ? (
                  <p className="text-sm text-muted-foreground">Sin ventana activa</p>
                ) : windowOver ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive">
                    <AlertTriangle className="h-4 w-4" /> Ventana vencida
                  </span>
                ) : (
                  <>
                    <p className="text-3xl font-bold leading-none tabular-nums">
                      {minutesLeft} <span className="text-base font-semibold text-muted-foreground">min</span>
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Timer className="h-3.5 w-3.5" />
                      {offer.responseDeadline ? `Vence ${hour(offer.responseDeadline)}` : "Restantes"}
                    </p>
                  </>
                )}
              </div>
            </div>

            {minutesLeft !== null && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    windowOver ? "bg-destructive" : windowProgress < 34 ? "bg-accent" : "bg-success",
                  )}
                  style={{ width: `${windowOver ? 100 : windowProgress}%` }}
                />
              </div>
            )}

            {/* Radio de búsqueda + notificados */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-background p-3">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Radar className="h-3.5 w-3.5" /> Radio de búsqueda
                </p>
                <p className="mt-1 text-xl font-bold leading-none">{currentRadius} km</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {nextRadius ? `Se puede ampliar hasta ${nextRadius} km` : "Ya estás en el radio máximo"}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> Profesionales notificados
                </p>
                <p className="mt-1 text-xl font-bold leading-none">{notifiedCount}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {proposals.length > 0
                    ? `${proposals.length} ya respondió${proposals.length === 1 ? "" : "eron"}`
                    : "Todavía sin respuestas"}
                </p>
              </div>
            </div>

            {isOwner && (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2" onClick={handleEscalate} disabled={!nextRadius}>
                  <Radar className="h-4 w-4" />
                  {nextRadius ? "Ampliar la búsqueda" : "Radio máximo alcanzado"}
                </Button>
                <Button className="gap-2" onClick={() => setConfirmAuto(true)}>
                  <UserCheck className="h-4 w-4" /> Asignar al más cercano
                </Button>
              </div>
            )}

            {/* Historial de escalados */}
            {escalations.length > 0 && (
              <div className="rounded-lg border border-dashed bg-background/60 p-3">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <History className="h-3.5 w-3.5" /> Historial de escalados ({escalations.length})
                </p>
                <ul className="mt-2 space-y-1">
                  {escalations.map((at, i) => (
                    <li key={at} className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">
                        Escalado #{i + 1} — radio ampliado a{" "}
                        <span className="font-medium text-foreground">
                          {ESCALATION_RADIUS_STEPS_KM[Math.min(i + 1, ESCALATION_RADIUS_STEPS_KM.length - 1)]} km
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">{hour(at)} hs</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
              <span className="font-semibold text-foreground">{money(offer.budget)}</span>
            </span>
            {offer.scheduledDate && (
              <span className="inline-flex items-center gap-1">
                <CalendarClock className="h-4 w-4" />{" "}
                {new Date(offer.scheduledDate).toLocaleDateString("es-AR")}
              </span>
            )}
          </div>
          {offer.images && offer.images.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium">Fotos del problema</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {offer.images.map((src, i) => (
                  <a
                    key={i}
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-lg border"
                  >
                    <img
                      src={src}
                      alt={`Foto ${i + 1}`}
                      className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105"
                    />
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
              <span className="font-semibold">{money(accepted.price)}</span>.
            </span>
          </CardContent>
        </Card>
      )}

      {/* Propuestas recibidas */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">Propuestas recibidas ({proposals.length})</h2>
          {priceRef && priceRef.count >= 3 && (
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Promedio en {offer.category}: <span className="font-medium text-foreground">{money(priceRef.avg)}</span>
            </p>
          )}
        </div>

        {/* Resumen comparativo */}
        {showCompare && (
          <Card className="border-primary/20 bg-primary-light/40">
            <CardContent className="p-4">
              <p className="mb-3 text-sm font-medium">Comparativa rápida de {sent.length} propuestas</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {cheapest && (
                  <div className="rounded-lg border bg-background p-3">
                    <p className="inline-flex items-center gap-1 text-xs font-semibold text-success">💰 Mejor precio</p>
                    <p className="mt-1 font-semibold">{money(cheapest.price)}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {store.getWorker(cheapest.workerId)?.name || "Profesional"}
                    </p>
                  </div>
                )}
                {bestRated && (
                  <div className="rounded-lg border bg-background p-3">
                    <p className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                      ⭐ Mejor calificado
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 font-semibold">
                      <Star className="h-4 w-4 fill-accent text-accent" /> {bestRated.rating.toFixed(1)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {store.getWorker(bestRated.p.workerId)?.name || "Profesional"}
                    </p>
                  </div>
                )}
                {fastestByEta ? (
                  <div className="rounded-lg border bg-background p-3">
                    <p className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      ⚡ Llega más rápido
                    </p>
                    <p className="mt-1 text-sm font-semibold">~{fastestByEta.etaMinutes} min</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {store.getWorker(fastestByEta.workerId)?.name || "Profesional"}
                    </p>
                  </div>
                ) : (
                  hasFastest && (
                    <div className="rounded-lg border bg-background p-3">
                      <p className="inline-flex items-center gap-1 text-xs font-semibold text-primary">⚡ Más rápido</p>
                      <p className="mt-1 truncate text-sm font-semibold">{fastest!.availability}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {store.getWorker(fastest!.workerId)?.name || "Profesional"}
                      </p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {proposals.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Todavía no recibiste propuestas. Te avisamos cuando llegue la primera.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => {
              const worker = store.getWorker(p.workerId);
              const isCheapest = cheapest?.id === p.id;
              const isBestRated = bestRated?.p.id === p.id;
              const isFastest = fastestId === p.id;
              const abusive = store.isPriceAbusive(offer.category, p.price);
              const highlighted = isCheapest || isBestRated || isFastest;
              return (
                <Card key={p.id} className={highlighted ? "border-primary/40 ring-1 ring-primary/20" : undefined}>
                  <CardContent className="space-y-3 p-4">
                    {(isCheapest || isBestRated || isFastest || abusive) && (
                      <div className="flex flex-wrap gap-2">
                        {isCheapest && (
                          <span className="rounded-full bg-success-light px-2 py-0.5 text-xs font-semibold text-success">
                            💰 Mejor precio
                          </span>
                        )}
                        {isBestRated && (
                          <span className="rounded-full bg-accent-light px-2 py-0.5 text-xs font-semibold text-accent">
                            ⭐ Mejor calificado
                          </span>
                        )}
                        {isFastest && (
                          <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary">
                            ⚡ Más rápido
                          </span>
                        )}
                        {abusive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent-light px-2 py-0.5 text-xs font-semibold text-accent">
                            <AlertTriangle className="h-3 w-3" /> Por encima del promedio
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <button
                          className="font-semibold hover:underline"
                          onClick={() => navigate(`/u/workers/${p.workerId}`)}
                        >
                          {worker?.name || "Profesional"}
                        </button>
                        {worker && (
                          <StarRating value={worker.rating || 0} size={14} showValue count={worker.reviewCount} />
                        )}
                        <div className="mt-1.5">
                          <AvailabilityBadge status={store.getAvailabilityStatus(p.workerId)} />
                        </div>
                      </div>
                      <ProposalStatusBadge status={p.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{p.message}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                      <span className="inline-flex items-center gap-1">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{money(p.price)}</span>
                      </span>
                      {typeof p.etaMinutes === "number" && (
                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          <Timer className="h-4 w-4" /> Puede estar en ~{p.etaMinutes} min
                        </span>
                      )}
                      {p.availability && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <CalendarClock className="h-4 w-4" /> {p.availability}
                        </span>
                      )}
                    </div>
                    {abusive && priceRef && (
                      <p className="text-xs text-muted-foreground">
                        Está por encima de lo habitual para {offer.category} (promedio {money(priceRef.avg)} sobre{" "}
                        {priceRef.count} trabajos). Podés contratarla igual: es solo información para que compares.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => chatWith(p.workerId)}>
                        <MessageSquare className="h-4 w-4" /> Chatear
                      </Button>
                      {isOpen && p.status === "enviada" && (
                        <>
                          <Button size="sm" className="gap-1" onClick={() => handleAccept(p)}>
                            <Check className="h-4 w-4" /> Aceptar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-destructive"
                            onClick={() => handleReject(p)}
                          >
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

      {/* Confirmación de asignación automática por cercanía */}
      <Dialog open={confirmAuto} onOpenChange={setConfirmAuto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" /> Asignar al más cercano
            </DialogTitle>
            <DialogDescription>
              Vamos a asignar la urgencia automáticamente al profesional disponible más cercano a tu ubicación, por el
              presupuesto que publicaste ({money(offer.budget)}). No vas a comparar propuestas: el trabajo queda
              agendado y podés seguirlo en tiempo real.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
            Buscamos dentro de {currentRadius} km entre los {notifiedCount} profesionales notificados de{" "}
            {offer.category}.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAuto(false)}>
              Cancelar
            </Button>
            <Button className="gap-2" onClick={handleAutoAssign}>
              <UserCheck className="h-4 w-4" /> Asignar y agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

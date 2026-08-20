import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Banknote,
  CalendarClock,
  Camera,
  CheckCircle2,
  Clock,
  Images,
  KeyRound,
  MapPin,
  MessageSquare,
  Navigation,
  ShieldAlert,
  ShieldCheck,
  Star,
  UserX,
  Wallet,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StatCard } from "@/components/ofix/StatCard";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { JobStatusBadge } from "@/components/ofix/badges";
import { PriceBreakdown } from "@/components/ofix/PriceBreakdown";
import { ImageUploader } from "@/components/ofix/ImageUploader";
import { TripTracker } from "@/components/ofix/TripTracker";
import { JobTimeline } from "@/components/ofix/JobTimeline";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import {
  DISPUTE_REASON_LABELS,
  DISPUTE_STATUS_LABELS,
  WARRANTY_STATUS_LABELS,
  type DisputeReason,
  type WarrantyClaim,
} from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

const fullDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
    : "—";

const REASON_OPTIONS = Object.keys(DISPUTE_REASON_LABELS) as DisputeReason[];

// El input datetime-local quiere "YYYY-MM-DDTHH:mm" en hora local.
function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function WorkerAgreementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, refresh] = useReducer((x: number) => x + 1, 0);

  const job = id ? store.getJob(id) : undefined;

  // Estado local de los formularios de la pantalla.
  const [eta, setEta] = useState("20");
  const [resultImages, setResultImages] = useState<string[]>(job?.resultImages ?? []);
  const [visitDrafts, setVisitDrafts] = useState<Record<string, string>>({});
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState<DisputeReason>("no_se_presento");
  const [disputeText, setDisputeText] = useState("");

  const storedImagesKey = (job?.resultImages ?? []).join("|");
  // Si el store cambia las fotos guardadas (otra pestaña, otra acción), reflejalo.
  useEffect(() => {
    setResultImages(storedImagesKey ? storedImagesKey.split("|") : []);
  }, [storedImagesKey]);

  // El ETA de `getTrackingState` es derivado del reloj: forzamos re-render mientras viaja.
  const isTraveling = job?.status === "en_camino";
  useEffect(() => {
    if (!isTraveling) return;
    const t = window.setInterval(() => refresh(), 8000);
    return () => window.clearInterval(t);
  }, [isTraveling, refresh]);

  if (!job) {
    return (
      <div>
        <PageHeader title="Acuerdo no encontrado" back />
        <p className="text-muted-foreground">No pudimos encontrar este acuerdo.</p>
      </div>
    );
  }

  const client = store.getUser(job.clientId);
  const payment = store.getPayment(job.id);
  const net = payment?.net;
  const arrivalCode = store.getJob(job.id)?.arrivalCode;
  const dispute = store.getDispute(job.id);
  const disputeIsOpen = !!dispute && (dispute.status === "abierta" || dispute.status === "en_revision");
  const claims = store.getWarrantyClaims({ jobId: job.id });
  const openClaims = claims.filter((c) => c.status === "abierto" || c.status === "agendado");
  const closedClaims = claims.filter((c) => c.status === "resuelto" || c.status === "rechazado");
  const warrantyLeft = store.warrantyDaysLeft(job.id);

  const isCompleted = job.status === "completado";
  const isCancelled = job.status === "cancelado";
  const scheduledPassed = job.scheduledAt ? new Date(job.scheduledAt).getTime() <= Date.now() : false;
  const canReportNoShow =
    (job.status === "agendado" || job.status === "en_camino") && (scheduledPassed || !!job.arrivedAt);
  const canOpenDispute = !disputeIsOpen && !isCancelled;

  const run = (fn: () => void, ok: string) => {
    try {
      fn();
      toast.success(ok);
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo completar la acción");
    }
  };

  const openChat = () => {
    if (!user) return;
    try {
      const chat = store.createChat(user.id, job.clientId);
      navigate(`/w/chat/${chat.id}`);
    } catch (err) {
      toast.error((err as Error).message || "No se pudo abrir el chat");
    }
  };

  const handleStartTrip = () => {
    const minutes = Number(eta);
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 480) {
      toast.error("El ETA tiene que estar entre 1 y 480 minutos");
      return;
    }
    run(() => store.startTrip(job.id, Math.round(minutes)), "Avisamos al cliente que estás en camino");
  };

  const handleArrived = () =>
    run(() => store.markArrived(job.id), "Marcamos tu llegada. El cliente ya tiene que confirmar el código.");

  const handleSaveImages = () =>
    run(() => store.addJobResultImages(job.id, resultImages), "Fotos guardadas en el trabajo y en tu portfolio");

  const handleNoShow = () => {
    if (!window.confirm("¿Confirmás que el cliente no estaba? Se cancela el acuerdo y se reembolsa el pago retenido.")) {
      return;
    }
    run(() => store.reportNoShow(job.id), "Registramos el incumplimiento");
  };

  const handleScheduleVisit = (claim: WarrantyClaim) => {
    const value = visitDrafts[claim.id];
    if (!value) {
      toast.error("Elegí fecha y hora para la revisión");
      return;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      toast.error("La fecha no es válida");
      return;
    }
    run(() => store.scheduleWarrantyVisit(claim.id, date.toISOString()), "Revisión de garantía agendada sin cargo");
  };

  const handleResolveClaim = (claim: WarrantyClaim) =>
    run(() => store.resolveWarrantyClaim(claim.id, "resuelto"), "Reclamo de garantía marcado como resuelto");

  const handleOpenDispute = () => {
    if (!disputeText.trim()) {
      toast.error("Contanos qué pasó para poder revisarlo");
      return;
    }
    try {
      store.openDispute({ jobId: job.id, reason: disputeReason, description: disputeText.trim() });
      toast.success("Reclamo abierto. OFIX va a revisar el caso.");
      setDisputeOpen(false);
      setDisputeText("");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo abrir el reclamo");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={job.title}
        subtitle={`${job.category} · Seguimiento del acuerdo`}
        back
        action={<JobStatusBadge status={job.status} />}
      />

      {/* ── Resumen económico y logístico ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Banknote}
          label="Tu cobro neto"
          value={money(net ?? job.amount)}
          tone="success"
          hint={net === undefined ? "Estimado sobre el monto acordado" : "Después de la comisión de OFIX"}
        />
        <StatCard
          icon={CalendarClock}
          label="Turno agendado"
          value={job.scheduledAt ? fullDate(job.scheduledAt) : "A coordinar"}
          tone="primary"
          hint={client?.zone ? `Zona ${client.zone}` : undefined}
        />
        <StatCard
          icon={ShieldCheck}
          label="Garantía del trabajo"
          value={warrantyLeft !== null ? `${warrantyLeft} días` : `${job.warrantyDays ?? 0} días`}
          tone={warrantyLeft !== null && warrantyLeft > 0 ? "accent" : "muted"}
          hint={warrantyLeft !== null && warrantyLeft > 0 ? "Cubrís el retrabajo sin cargo" : "Se activa al completarse"}
        />
      </div>

      {/* ── Disputa abierta: escrow congelado ── */}
      {dispute && disputeIsOpen && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-destructive">Fondos congelados por un reclamo</p>
                  <Badge variant="destructive">{DISPUTE_STATUS_LABELS[dispute.status]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  El pago no se libera hasta que OFIX medie el caso. Respondé por el chat con la mayor cantidad de
                  detalles posible: ayuda a resolverlo más rápido.
                </p>
              </div>
            </div>
            <div className="grid gap-2 rounded-lg border border-destructive/30 bg-background p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-muted-foreground">Motivo</span>
                <span className="font-medium">{DISPUTE_REASON_LABELS[dispute.reason]}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-muted-foreground">Abierto</span>
                <span className="font-medium">{fullDate(dispute.createdAt)}</span>
              </div>
              <p className="border-t pt-2 text-foreground/80">“{dispute.description}”</p>
              {!!dispute.images?.length && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {dispute.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Evidencia ${i + 1}`}
                      className="h-20 w-20 rounded-lg border object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
            <Button variant="outline" className="gap-2" onClick={openChat}>
              <MessageSquare className="h-4 w-4" />
              Responderle al cliente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Paso siguiente: salir hacia el trabajo ── */}
      {job.status === "agendado" && (
        <Card className="border-primary/50 bg-primary-light/40 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Navigation className="h-5 w-5 text-primary" />
              Salir hacia el trabajo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cuando arranques el viaje, el cliente ve tu avance en vivo y recibe un código de 4 dígitos. Ese código
              es la prueba de que sos vos quien toca la puerta.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="space-y-1.5 sm:w-56">
                <Label htmlFor="eta">¿En cuántos minutos llegás?</Label>
                <Input
                  id="eta"
                  type="number"
                  min={1}
                  max={480}
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  placeholder="20"
                />
              </div>
              <Button size="lg" className="gap-2 sm:flex-1" onClick={handleStartTrip}>
                <Navigation className="h-4 w-4" />
                Salí para el trabajo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sé realista con el ETA: la puntualidad es parte de tu reputación en OFIX.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Código de llegada (el profesional lo dice en la puerta) ── */}
      {!!arrivalCode && (job.status === "en_camino" || job.status === "en_progreso") && (
        <Card className="border-accent/50 bg-accent-light/50">
          <CardContent className="flex flex-wrap items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20">
              <KeyRound className="h-6 w-6 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Tu código de llegada</p>
              <p className="text-sm text-muted-foreground">
                Decíselo al cliente en la puerta para que confirme tu identidad y arranque el trabajo.
              </p>
            </div>
            <span className="rounded-xl border-2 border-accent/40 bg-background px-5 py-2 font-mono text-3xl font-bold tracking-[0.35em] text-accent">
              {arrivalCode}
            </span>
          </CardContent>
        </Card>
      )}

      {/* ── Seguimiento en vivo del trayecto ── */}
      {job.status === "en_camino" && <TripTracker jobId={job.id} role="worker" />}

      {/* ── Llegué / esperando confirmación ── */}
      {job.status === "en_camino" && !job.arrivedAt && (
        <Card className="border-primary/50 bg-primary-light/40">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="font-semibold">¿Ya estás en el domicilio?</p>
                <p className="text-sm text-muted-foreground">
                  Avisale al cliente que llegaste. Le va a llegar una notificación para que te pida el código.
                </p>
              </div>
            </div>
            <Button size="lg" className="w-full gap-2 text-base" onClick={handleArrived}>
              <MapPin className="h-5 w-5" />
              Llegué
            </Button>
          </CardContent>
        </Card>
      )}

      {job.status === "en_camino" && !!job.arrivedAt && (
        <Card className="border-accent/50 bg-accent-light/40">
          <CardContent className="flex items-start gap-3 p-5">
            <Clock className="mt-0.5 h-6 w-6 shrink-0 animate-pulse text-accent" />
            <div>
              <p className="font-semibold">Esperando que el cliente confirme tu identidad</p>
              <p className="text-sm text-muted-foreground">
                Decile el código <strong className="font-mono tracking-widest text-accent">{arrivalCode ?? "----"}</strong>{" "}
                para validar que sos vos. Cuando lo ingrese, el trabajo pasa a “En progreso”.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Llegada registrada: {fullDate(job.arrivedAt)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {isCompleted && (
        <Card className="border-success/40 bg-success-light">
          <CardContent className="flex items-center gap-3 p-5">
            <CheckCircle2 className="h-8 w-8 shrink-0 text-success" />
            <div>
              <p className="font-semibold text-success">¡Acuerdo exitoso!</p>
              <p className="text-sm text-success/80">
                El cliente validó el trabajo y se liberaron los fondos a tu billetera.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isCancelled && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-5">
            <AlertTriangle className="h-7 w-7 shrink-0 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Acuerdo cancelado</p>
              <p className="text-sm text-muted-foreground">
                {job.noShowReportedAt
                  ? `Se registró un incumplimiento el ${fullDate(job.noShowReportedAt)}. El pago retenido fue reembolsado.`
                  : "Este acuerdo ya no está activo."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Reclamos de garantía ── */}
      {openClaims.map((claim) => (
        <Card key={claim.id} className="border-accent/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-center gap-2 text-base">
              <Wrench className="h-5 w-5 text-accent" />
              Reclamo de garantía
              <Badge variant="accent">{WARRANTY_STATUS_LABELS[claim.status]}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <p className="text-foreground/80">“{claim.description}”</p>
              <p className="mt-2 text-xs text-muted-foreground">Reclamado el {fullDate(claim.createdAt)}</p>
            </div>

            {!!claim.images?.length && (
              <div>
                <p className="mb-2 text-sm font-medium">Fotos del cliente</p>
                <div className="flex flex-wrap gap-2">
                  {claim.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Foto del reclamo ${i + 1}`}
                      className="h-24 w-24 rounded-lg border object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-accent/40 bg-accent-light/40 p-3 text-sm text-foreground/80">
              <strong className="text-accent">La revisión de garantía no se cobra.</strong> No se genera un pago nuevo:
              volvés al domicilio, resolvés el retrabajo y así protegés tu reputación y la del marketplace.
            </div>

            {claim.status === "agendado" && claim.scheduledAt && (
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <CalendarClock className="h-4 w-4" />
                Revisión agendada para el {fullDate(claim.scheduledAt)}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="space-y-1.5 sm:flex-1">
                <Label htmlFor={`visit-${claim.id}`}>
                  {claim.status === "agendado" ? "Reprogramar la revisión" : "Fecha y hora de la revisión"}
                </Label>
                <Input
                  id={`visit-${claim.id}`}
                  type="datetime-local"
                  min={toLocalInputValue(new Date())}
                  value={visitDrafts[claim.id] ?? ""}
                  onChange={(e) => setVisitDrafts((prev) => ({ ...prev, [claim.id]: e.target.value }))}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="gap-2" onClick={() => handleScheduleVisit(claim)}>
                  <CalendarClock className="h-4 w-4" />
                  Agendar revisión
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => handleResolveClaim(claim)}>
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar resuelto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contacto — datos del cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <UserAvatar name={client?.name || "?"} photo={client?.photo} className="h-14 w-14" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{client?.name || "Cliente"}</p>
                {client?.zone && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {client.zone}
                  </p>
                )}
                <StarRating
                  value={client?.rating || 0}
                  showValue
                  count={client?.reviewCount}
                  size={14}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full gap-2" onClick={openChat}>
                <MessageSquare className="h-4 w-4" />
                Enviar mensaje
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/w/users/${job.clientId}`)}>
                Ver perfil del cliente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estado del pago */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-4 w-4" />
              Estado del pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payment ? (
              <>
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  {payment.status === "liberado" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="text-sm font-medium text-success">Fondos liberados</span>
                    </>
                  ) : payment.status === "retenido" ? (
                    <>
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-primary">En garantía (retenido)</span>
                    </>
                  ) : payment.status === "en_disputa" ? (
                    <>
                      <ShieldAlert className="h-5 w-5 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Congelado por un reclamo</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Pago {payment.status}</span>
                    </>
                  )}
                </div>
                <PriceBreakdown
                  gross={payment.gross}
                  commission={payment.commission}
                  insuranceCost={payment.insuranceCost}
                  surcharge={payment.surcharge}
                />
                <div className="flex items-center justify-between rounded-lg bg-success-light p-3">
                  <span className="text-sm font-medium text-success">Tu cobro neto</span>
                  <span className="text-lg font-bold text-success">{money(payment.net)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {payment.status === "retenido"
                    ? "Los fondos se liberan a tu billetera cuando el cliente valida el trabajo."
                    : payment.status === "liberado"
                      ? "Ya podés retirar este cobro desde la sección Cobros."
                      : payment.status === "en_disputa"
                        ? "Mientras el reclamo esté abierto, el dinero queda retenido por OFIX."
                        : payment.status === "reembolsado"
                          ? "El pago volvió al cliente."
                          : "Pago pendiente de acreditación."}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                El cliente todavía no realizó el pago. Vas a cobrar {money(job.amount)} al concretar el trabajo.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Línea de tiempo del servicio ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seguimiento del acuerdo</CardTitle>
        </CardHeader>
        <CardContent>
          <JobTimeline jobId={job.id} />
        </CardContent>
      </Card>

      {/* ── Fotos del resultado → portfolio ── */}
      {(job.status === "en_progreso" || isCompleted) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="h-5 w-5 text-primary" />
              Fotos del trabajo terminado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2 rounded-lg bg-primary-light/50 p-3 text-sm text-foreground/80">
              <Images className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Estas fotos van a tu <strong className="text-primary">portfolio</strong>: se muestran como el “después”
                junto a las fotos originales de la solicitud. Es la prueba visual que mira el próximo cliente antes de
                contratarte.
              </span>
            </div>
            <ImageUploader images={resultImages} onChange={setResultImages} max={4} />
            <div className="flex flex-wrap items-center gap-3">
              <Button className="gap-2" onClick={handleSaveImages} disabled={resultImages.length === 0}>
                <Camera className="h-4 w-4" />
                Guardar fotos del trabajo
              </Button>
              <span className="text-xs text-muted-foreground">{resultImages.length} de 4 fotos</span>
            </div>
          </CardContent>
        </Card>
      )}

      {isCompleted && !job.reviewedByWorker && (
        <Card className="border-accent/40 bg-accent-light">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 shrink-0 text-accent" />
              <div>
                <p className="font-semibold">¿Cómo fue tu experiencia?</p>
                <p className="text-sm text-muted-foreground">Calificá al cliente para ayudar a la comunidad.</p>
              </div>
            </div>
            <Button className="gap-2" onClick={() => navigate(`/w/agreements/${job.id}/review`)}>
              <Star className="h-4 w-4" />
              Calificar al cliente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Historial de garantía ya cerrada ── */}
      {closedClaims.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Historial de garantía</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {closedClaims.map((claim) => (
              <div
                key={claim.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
              >
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{claim.description}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={claim.status === "resuelto" ? "success" : "outline"}>
                    {WARRANTY_STATUS_LABELS[claim.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{fullDate(claim.resolvedAt || claim.createdAt)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Zona de problemas ── */}
      {(canReportNoShow || canOpenDispute) && (
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              ¿Algo salió mal?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Registrar el problema en OFIX deja constancia: se congela el dinero, interviene el equipo de soporte y no
              queda tu palabra contra la del otro.
            </p>
            <div className="flex flex-wrap gap-2">
              {canReportNoShow && (
                <Button variant="outline" className="gap-2" onClick={handleNoShow}>
                  <UserX className="h-4 w-4" />
                  El cliente no estaba
                </Button>
              )}
              {canOpenDispute && (
                <Button variant="outline" className="gap-2 text-destructive" onClick={() => setDisputeOpen(true)}>
                  <ShieldAlert className="h-4 w-4" />
                  Abrir un reclamo
                </Button>
              )}
            </div>
            {canReportNoShow && (
              <p className="text-xs text-muted-foreground">
                Reportar que el cliente no estaba cancela el acuerdo, reembolsa el pago retenido y reabre la solicitud.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Dialog: abrir reclamo (lado profesional) ── */}
      <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir un reclamo</DialogTitle>
            <DialogDescription>
              Los fondos de este trabajo quedan congelados hasta que OFIX medie. Contá qué pasó con el mayor detalle
              posible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="dispute-reason">Motivo</Label>
              <Select value={disputeReason} onValueChange={(v) => setDisputeReason(v as DisputeReason)}>
                <SelectTrigger id="dispute-reason">
                  <SelectValue placeholder="Elegí un motivo" />
                </SelectTrigger>
                <SelectContent>
                  {REASON_OPTIONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {DISPUTE_REASON_LABELS[reason]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dispute-text">¿Qué pasó?</Label>
              <Textarea
                id="dispute-text"
                rows={5}
                value={disputeText}
                onChange={(e) => setDisputeText(e.target.value)}
                placeholder="Ej: llegué en horario, esperé 30 minutos y nadie me abrió la puerta."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisputeOpen(false)}>
              Cancelar
            </Button>
            <Button className="gap-2" onClick={handleOpenDispute}>
              <ShieldAlert className="h-4 w-4" />
              Abrir el reclamo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

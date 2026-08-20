import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Camera,
  FileText,
  Flag,
  LifeBuoy,
  Lock,
  MessageCircle,
  PartyPopper,
  ShieldCheck,
  Siren,
  Star,
  UserX,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { PriceBreakdown } from "@/components/ofix/PriceBreakdown";
import { JobStatusBadge, VerificationBadge } from "@/components/ofix/badges";
import { TripTracker } from "@/components/ofix/TripTracker";
import { ArrivalPanel } from "@/components/ofix/ArrivalPanel";
import { JobTimeline } from "@/components/ofix/JobTimeline";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import {
  DISPUTE_REASON_LABELS,
  DISPUTE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  WARRANTY_STATUS_LABELS,
  type PaymentStatus,
} from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });

// Estilo del chip de estado del pago (exhaustivo sobre PaymentStatus).
const PAYMENT_CHIP: Record<PaymentStatus, string> = {
  pendiente: "bg-muted text-muted-foreground",
  retenido: "bg-primary-light text-primary",
  en_disputa: "bg-destructive/10 text-destructive",
  liberado: "bg-success-light text-success",
  reembolsado: "bg-accent-light text-accent",
};

// Línea de tiempo del dinero: qué pasó y qué falta, según el estado del escrow.
type MoneyStepState = "done" | "pending" | "alert";
type MoneyStep = { key: string; label: string; state: MoneyStepState };

const MONEY_FLOW: Record<PaymentStatus, MoneyStep[]> = {
  pendiente: [
    { key: "pagado", label: "Pago pendiente", state: "pending" },
    { key: "retenido", label: "Retenido en OFIX", state: "pending" },
    { key: "validado", label: "Validado por vos", state: "pending" },
    { key: "liberado", label: "Liberado al profesional", state: "pending" },
  ],
  retenido: [
    { key: "pagado", label: "Pagado", state: "done" },
    { key: "retenido", label: "Retenido en OFIX", state: "done" },
    { key: "validado", label: "Validado por vos", state: "pending" },
    { key: "liberado", label: "Liberado al profesional", state: "pending" },
  ],
  en_disputa: [
    { key: "pagado", label: "Pagado", state: "done" },
    { key: "retenido", label: "Retenido en OFIX", state: "done" },
    { key: "congelado", label: "Congelado por el reclamo", state: "alert" },
    { key: "resolucion", label: "A resolver por OFIX", state: "pending" },
  ],
  liberado: [
    { key: "pagado", label: "Pagado", state: "done" },
    { key: "retenido", label: "Retenido en OFIX", state: "done" },
    { key: "validado", label: "Validado por vos", state: "done" },
    { key: "liberado", label: "Liberado al profesional", state: "done" },
  ],
  reembolsado: [
    { key: "pagado", label: "Pagado", state: "done" },
    { key: "retenido", label: "Retenido en OFIX", state: "done" },
    { key: "reembolsado", label: "Reembolsado a tu medio de pago", state: "done" },
  ],
};

const MONEY_CHIP: Record<MoneyStepState, string> = {
  done: "bg-success-light text-success",
  pending: "bg-muted text-muted-foreground",
  alert: "bg-destructive/10 text-destructive",
};

// Banner de aviso reutilizable — jerarquía visual por tono.
const BANNER_TONE = {
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  warning: "border-accent/30 bg-accent-light text-accent",
  success: "border-success/30 bg-success-light text-success",
  info: "border-primary/30 bg-primary-light text-primary",
} as const;

function Banner({
  tone,
  icon: Icon,
  title,
  children,
  action,
}: {
  tone: keyof typeof BANNER_TONE;
  icon: typeof AlertTriangle;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-wrap items-start gap-3 rounded-xl border p-4", BANNER_TONE[tone])}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-0.5 text-sm text-foreground/80">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default function UserJobDetail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [, refresh] = useReducer((x: number) => x + 1, 0);

  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [npsComment, setNpsComment] = useState("");

  const job = id ? store.getJob(id) : undefined;
  const worker = job ? store.getWorker(job.workerId) : null;
  const payment = id ? store.getPayment(id) : undefined;

  // El ETA y el timeline se derivan del reloj: refrescamos mientras el trabajo está en curso.
  const live = job?.status === "en_camino" || job?.status === "en_progreso";
  useEffect(() => {
    if (!live) return;
    const t = window.setInterval(refresh, 10000);
    return () => window.clearInterval(t);
  }, [live, refresh]);

  if (!job || !worker) {
    return (
      <div>
        <PageHeader title="Seguimiento del trabajo" back />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">No encontramos este trabajo.</CardContent>
        </Card>
      </div>
    );
  }

  const dispute = store.getDispute(job.id);
  const disputeOpen = !!dispute && (dispute.status === "abierta" || dispute.status === "en_revision");

  const underWarranty = store.isUnderWarranty(job.id);
  const warrantyDays = store.warrantyDaysLeft(job.id);
  const warrantyClaims = store.getWarrantyClaims({ jobId: job.id });
  const openWarrantyClaim = warrantyClaims.find((c) => c.status === "abierto" || c.status === "agendado");
  const lastWarrantyClaim = warrantyClaims[0];

  const scheduledPassed = !!job.scheduledAt && new Date(job.scheduledAt).getTime() < Date.now();
  const canReportNoShow = (job.status === "agendado" || job.status === "en_camino") && scheduledPassed;
  const canPanic = job.status === "en_camino" || job.status === "en_progreso";
  const canValidate =
    !disputeOpen && (job.status === "agendado" || job.status === "en_progreso") && payment?.status === "retenido";
  const canDispute = job.status !== "cancelado" && !disputeOpen;
  const showNps = job.status === "completado" && !!user && !store.hasAnsweredNps(job.id, user.id);
  const resultImages = job.resultImages ?? [];

  const openChat = () => {
    try {
      const chat = store.createChat(user!.id, job.workerId);
      navigate(`/u/chat/${chat.id}`);
    } catch (err) {
      toast.error((err as Error).message || "No se pudo abrir el chat");
    }
  };

  const handleValidate = () => {
    try {
      store.completeJob(job.id);
      toast.success("¡Trabajo validado! Se liberaron los fondos al profesional.");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo validar el trabajo");
    }
  };

  const handlePanic = () => {
    if (!window.confirm("¿Querés avisarle al soporte de OFIX que necesitás ayuda con este servicio?")) return;
    try {
      store.raisePanic(job.id);
      toast.success("Avisamos al soporte de OFIX. Si hay riesgo inmediato, llamá al 911.");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo registrar la alerta");
    }
  };

  const handleNoShow = () => {
    if (!window.confirm("¿Confirmás que el profesional no se presentó? Se cancela el trabajo, se reembolsa el pago y reabrimos tu solicitud."))
      return;
    try {
      store.reportNoShow(job.id);
      toast.success("Registramos el incumplimiento y reabrimos tu solicitud.");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo reportar el incumplimiento");
    }
  };

  const handleNps = () => {
    if (npsScore === null) return;
    try {
      store.submitNps({ jobId: job.id, score: npsScore, comment: npsComment.trim() || undefined });
      toast.success("¡Gracias! Tu respuesta nos ayuda a mejorar OFIX.");
      setNpsScore(null);
      setNpsComment("");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo enviar la encuesta");
    }
  };

  const headerSubtitle = [job.category, job.scheduledAt ? `Agendado para el ${fmtDateTime(job.scheduledAt)}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <PageHeader title={job.title} subtitle={headerSubtitle} back action={<JobStatusBadge status={job.status} />} />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* ── 1. Seguimiento en vivo: lo primero que el cliente necesita ver ── */}
        {job.status === "en_camino" && (
          <>
            <TripTracker jobId={job.id} role="client" />
            <ArrivalPanel jobId={job.id} onDone={refresh} />
          </>
        )}

        {/* ── Avisos críticos ── */}
        {disputeOpen && dispute && (
          <Banner
            tone="danger"
            icon={AlertTriangle}
            title="Reclamo abierto — los fondos están congelados"
            action={
              <Button variant="outline" size="sm" onClick={() => navigate(`/u/jobs/${job.id}/dispute`)}>
                Ver reclamo
              </Button>
            }
          >
            Estado: <strong>{DISPUTE_STATUS_LABELS[dispute.status]}</strong> · Motivo:{" "}
            {DISPUTE_REASON_LABELS[dispute.reason]}. El pago no se libera hasta que OFIX resuelva. Abierto el{" "}
            {fmtDate(dispute.createdAt)}.
          </Banner>
        )}

        {job.panicAt && (
          <Banner tone="danger" icon={Siren} title="Soporte de OFIX fue avisado">
            Registramos tu alerta el {fmtDateTime(job.panicAt)}. Un agente se va a contactar con vos. Si hay riesgo
            inmediato, llamá al 911.
          </Banner>
        )}

        {job.noShowReportedAt && (
          <Banner tone="warning" icon={UserX} title="Incumplimiento reportado">
            Se registró que no hubo presentación el {fmtDateTime(job.noShowReportedAt)}. El pago retenido fue
            reembolsado y tu solicitud volvió a estar abierta.
          </Banner>
        )}

        {job.status === "completado" && !disputeOpen && (
          <Banner tone="success" icon={PartyPopper} title="¡Acuerdo exitoso!">
            El trabajo se completó{job.completedAt ? ` el ${fmtDate(job.completedAt)}` : ""} y los fondos fueron
            liberados al profesional.
          </Banner>
        )}

        {/* ── Garantía del servicio ── */}
        {underWarranty && (
          <Card className="border-success/30">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-success" />
                Garantía activa
              </CardTitle>
              <span className="rounded-full bg-success-light px-2.5 py-0.5 text-xs font-medium text-success">
                {warrantyDays ?? 0} {warrantyDays === 1 ? "día restante" : "días restantes"}
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Si algo del trabajo falla, el profesional vuelve sin costo. La garantía vence
                {job.warrantyUntil ? ` el ${fmtDate(job.warrantyUntil)}` : ""}.
              </p>
              {openWarrantyClaim ? (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/40 p-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">Reclamo de garantía en curso</p>
                    <p className="text-muted-foreground">
                      {WARRANTY_STATUS_LABELS[openWarrantyClaim.status]}
                      {openWarrantyClaim.scheduledAt ? ` · Revisión: ${fmtDateTime(openWarrantyClaim.scheduledAt)}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary">
                    {WARRANTY_STATUS_LABELS[openWarrantyClaim.status]}
                  </span>
                </div>
              ) : (
                <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={() => navigate(`/u/jobs/${job.id}/warranty`)}>
                  <Wrench className="h-4 w-4" />
                  Reclamar garantía
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {!underWarranty && !openWarrantyClaim && lastWarrantyClaim && (
          <Banner tone="info" icon={Wrench} title="Reclamo de garantía">
            {WARRANTY_STATUS_LABELS[lastWarrantyClaim.status]} · Abierto el {fmtDate(lastWarrantyClaim.createdAt)}.
          </Banner>
        )}

        {/* ── Encuesta NPS ── */}
        {showNps && (
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">¿Qué tan probable es que recomiendes OFIX?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNpsScore(n)}
                    className={cn(
                      "h-10 w-10 shrink-0 rounded-lg border text-sm font-semibold transition-colors",
                      npsScore === n
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary hover:text-primary",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 — Nada probable</span>
                <span>10 — Muy probable</span>
              </div>
              <Textarea
                placeholder="¿Querés contarnos por qué? (opcional)"
                value={npsComment}
                onChange={(e) => setNpsComment(e.target.value)}
                rows={3}
              />
              <Button className="w-full sm:w-auto" disabled={npsScore === null} onClick={handleNps}>
                Enviar respuesta
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Profesional ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profesional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <UserAvatar name={worker.name} photo={worker.photo} className="h-14 w-14" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{worker.name}</h3>
                  <VerificationBadge verified={worker.verified} />
                </div>
                <p className="text-sm text-muted-foreground">{worker.trade}</p>
                <StarRating value={worker.rating || 0} size={14} showValue count={worker.reviewCount} className="mt-1" />
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={openChat}>
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Timeline del servicio ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Seguimiento del acuerdo</CardTitle>
          </CardHeader>
          <CardContent>
            <JobTimeline jobId={job.id} />
          </CardContent>
        </Card>

        {/* ── Fotos del resultado ── */}
        {resultImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Camera className="h-4 w-4 text-muted-foreground" />
                Fotos del resultado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {resultImages.map((src, i) => (
                  <a
                    key={`${src.slice(-24)}-${i}`}
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-lg border bg-muted"
                  >
                    <img
                      src={src}
                      alt={`Resultado ${i + 1}`}
                      className="h-28 w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Pago ── */}
        {payment && (
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Pago</CardTitle>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", PAYMENT_CHIP[payment.status])}>
                {PAYMENT_STATUS_LABELS[payment.status]}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              {payment.status === "retenido" && (
                <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary-light p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-primary">Fondos en garantía</p>
                    <p className="text-foreground/80">
                      Tus {money(payment.total)} están retenidos por OFIX. Se liberan al profesional recién cuando validás
                      que el trabajo está bien hecho.
                    </p>
                  </div>
                </div>
              )}

              {/* Línea de tiempo del dinero */}
              <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 text-xs">
                {MONEY_FLOW[payment.status].map((step, i, arr) => (
                  <div key={step.key} className="flex items-center gap-1.5">
                    <span className={cn("whitespace-nowrap rounded-full px-2.5 py-1 font-medium", MONEY_CHIP[step.state])}>
                      {step.label}
                    </span>
                    {i < arr.length - 1 && <span className="text-muted-foreground/40">→</span>}
                  </div>
                ))}
              </div>

              <PriceBreakdown
                gross={payment.gross}
                commission={payment.commission}
                insuranceCost={payment.insuranceCost}
                surcharge={payment.surcharge}
                net={payment.net}
              />

              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <p className="text-xs text-muted-foreground">
                  Método: {PAYMENT_METHOD_LABELS[payment.method]}
                  {payment.releasedAt ? ` · Liberado el ${fmtDate(payment.releasedAt)}` : ""}
                </p>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/u/jobs/${job.id}/receipt`)}>
                  <FileText className="h-4 w-4" />
                  Ver comprobante
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Acciones principales ── */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {canValidate && (
            <Button className="flex-1 gap-2" onClick={handleValidate}>
              <ShieldCheck className="h-4 w-4" />
              Validar y liberar fondos
            </Button>
          )}
          {job.status === "completado" && !job.reviewedByClient && (
            <Button className="flex-1 gap-2" onClick={() => navigate(`/u/jobs/${job.id}/review`)}>
              <Star className="h-4 w-4" />
              Calificar al profesional
            </Button>
          )}
          <Button variant="outline" className="flex-1 gap-2" onClick={openChat}>
            <MessageCircle className="h-4 w-4" />
            Contactar
          </Button>
        </div>

        {/* ── Resolución de problemas ── */}
        {(canDispute || canReportNoShow || canPanic) && (
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">¿Algo no salió como esperabas?</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {canDispute && (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/u/jobs/${job.id}/dispute`)}>
                  <Flag className="h-4 w-4" />
                  Abrir un reclamo
                </Button>
              )}
              {canReportNoShow && (
                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive" onClick={handleNoShow}>
                  <UserX className="h-4 w-4" />
                  No se presentó
                </Button>
              )}
              {canPanic && !job.panicAt && (
                <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handlePanic}>
                  <LifeBuoy className="h-4 w-4" />
                  Necesito ayuda
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

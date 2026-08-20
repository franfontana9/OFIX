import { useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, MessageCircle, Star, ShieldCheck, CalendarClock, PlayCircle, PartyPopper, Lock, FileText, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { PriceBreakdown } from "@/components/ofix/PriceBreakdown";
import { JobStatusBadge, VerificationBadge } from "@/components/ofix/badges";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, type JobStatus } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString()}`;

const TIMELINE: { status: JobStatus; label: string; icon: typeof CalendarClock }[] = [
  { status: "agendado", label: "Agendado", icon: CalendarClock },
  { status: "en_camino", label: "En camino", icon: Navigation },
  { status: "en_progreso", label: "En progreso", icon: PlayCircle },
  { status: "completado", label: "Completado", icon: CheckCircle2 },
];

export default function UserJobDetail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [, refresh] = useReducer((x) => x + 1, 0);

  const job = id ? store.getJob(id) : undefined;
  const worker = job ? store.getWorker(job.workerId) : null;
  const payment = id ? store.getPayment(id) : undefined;

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

  const currentIndex = TIMELINE.findIndex((s) => s.status === job.status);
  const canValidate = (job.status === "agendado" || job.status === "en_progreso") && payment?.status === "retenido";

  const openChat = () => {
    const chat = store.createChat(user!.id, job.workerId);
    navigate(`/u/chat/${chat.id}`);
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

  return (
    <div className="space-y-6">
      <PageHeader title={job.title} subtitle={job.category} back action={<JobStatusBadge status={job.status as JobStatus} />} />

      <div className="mx-auto max-w-2xl space-y-6">
        {job.status === "completado" && (
          <div className="flex items-center gap-3 rounded-lg bg-success-light p-4 text-success">
            <PartyPopper className="h-6 w-6 shrink-0" />
            <div>
              <p className="font-semibold">¡Acuerdo exitoso!</p>
              <p className="text-sm">El trabajo se completó y los fondos fueron liberados.</p>
            </div>
          </div>
        )}

        {/* Datos del trabajador */}
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

        {/* Seguimiento del acuerdo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Seguimiento del acuerdo</CardTitle>
          </CardHeader>
          <CardContent>
            {job.status === "cancelado" ? (
              <p className="text-sm text-destructive">Este trabajo fue cancelado.</p>
            ) : (
              <ol className="space-y-4">
                {TIMELINE.map((step, i) => {
                  const done = i < currentIndex;
                  const active = i === currentIndex;
                  const Icon = step.icon;
                  return (
                    <li key={step.status} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
                          done && "border-success bg-success text-white",
                          active && "border-primary bg-primary text-primary-foreground",
                          !done && !active && "border-muted-foreground/30 text-muted-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={cn("font-medium", active ? "text-foreground" : done ? "text-success" : "text-muted-foreground")}>{step.label}</span>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>

        {/* Pago */}
        {payment && (
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Pago</CardTitle>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  payment.status === "liberado" && "bg-success-light text-success",
                  payment.status === "retenido" && "bg-primary-light text-primary",
                  payment.status === "pendiente" && "bg-muted text-muted-foreground",
                  payment.status === "reembolsado" && "bg-destructive/10 text-destructive",
                )}
              >
                {PAYMENT_STATUS_LABELS[payment.status]}
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              {payment.status === "retenido" && (
                <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary-light p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-primary">Fondos en garantía</p>
                    <p className="text-foreground/80">
                      Tu pago está retenido por OFIX. Se libera al profesional recién cuando validás que el trabajo está bien hecho.
                    </p>
                  </div>
                </div>
              )}

              {/* Línea de tiempo del dinero */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {[
                  { key: "pagado", label: "Pagado", done: true },
                  { key: "garantia", label: "En garantía", done: true },
                  { key: "validado", label: "Validado", done: payment.status === "liberado" },
                  { key: "liberado", label: "Liberado", done: payment.status === "liberado" },
                ].map((step, i, arr) => (
                  <div key={step.key} className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "whitespace-nowrap rounded-full px-2.5 py-1 font-medium",
                        step.done ? "bg-success-light text-success" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                    {i < arr.length - 1 && <span className="text-muted-foreground/40">→</span>}
                  </div>
                ))}
              </div>

              <PriceBreakdown gross={payment.gross} commission={payment.commission} insuranceCost={payment.insuranceCost} />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">Método: {PAYMENT_METHOD_LABELS[payment.method]}</p>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/u/jobs/${job.id}/receipt`)}>
                  <FileText className="h-4 w-4" />
                  Ver comprobante
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones */}
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
      </div>
    </div>
  );
}

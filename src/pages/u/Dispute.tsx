import { useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  Loader2,
  Lock,
  MessageCircle,
  Scale,
  Snowflake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { ImageUploader } from "@/components/ofix/ImageUploader";
import { JobStatusBadge } from "@/components/ofix/badges";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import {
  DISPUTE_REASON_LABELS,
  DISPUTE_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type DisputeReason,
  type DisputeStatus,
  type JobStatus,
} from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Tonos por estado del reclamo (exhaustivo sobre DisputeStatus).
const STATUS_TONE: Record<DisputeStatus, string> = {
  abierta: "bg-accent-light text-accent",
  en_revision: "bg-primary-light text-primary",
  resuelta_cliente: "bg-success-light text-success",
  resuelta_trabajador: "bg-muted text-muted-foreground",
};

const REASON_ORDER: DisputeReason[] = Object.keys(DISPUTE_REASON_LABELS) as DisputeReason[];

export default function UserDispute() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [, refresh] = useReducer((x) => x + 1, 0);

  const [reason, setReason] = useState<DisputeReason | "">("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const job = id ? store.getJob(id) : undefined;

  if (!id || !job) {
    return (
      <div>
        <PageHeader title="Abrir un reclamo" back />
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FileWarning className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold">No encontramos este trabajo</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Puede que el enlace esté vencido. Volvé a tus trabajos y abrí el reclamo desde el detalle.
            </p>
            <Button className="mt-1" onClick={() => navigate("/u/jobs")}>
              Ver mis trabajos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const worker = store.getWorker(job.workerId);
  const payment = store.getPayment(job.id);
  const dispute = store.getDispute(job.id);
  const isOpen = !!dispute && (dispute.status === "abierta" || dispute.status === "en_revision");

  const openChat = () => {
    if (!user) return;
    const chat = store.createChat(user.id, job.workerId);
    navigate(`/u/chat/${chat.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!reason) throw new Error("Elegí el motivo del reclamo");
      if (!description.trim()) throw new Error("Contanos qué pasó para poder revisarlo");
      store.openDispute({ jobId: job.id, reason, description: description.trim(), images });
      toast.success("Reclamo abierto. Los fondos quedaron congelados hasta que OFIX medie.");
      refresh();
      navigate(`/u/jobs/${job.id}`);
    } catch (err) {
      toast.error((err as Error).message || "No se pudo abrir el reclamo");
    } finally {
      setLoading(false);
    }
  };

  // Resumen del trabajo: contexto para el reclamo.
  const jobSummary = (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Trabajo reclamado</CardTitle>
        <JobStatusBadge status={job.status as JobStatus} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold leading-tight">{job.title}</p>
          <p className="text-sm text-muted-foreground">{job.category}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar name={worker?.name || "Profesional"} photo={worker?.photo} className="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{worker?.name || "Profesional"}</p>
              <p className="truncate text-xs text-muted-foreground">{worker?.trade || "Profesional asignado"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{money(job.amount)}</p>
            <p className="text-xs text-muted-foreground">
              {payment ? PAYMENT_STATUS_LABELS[payment.status] : "Sin pago registrado"}
            </p>
          </div>
        </div>
        {job.completedAt && (
          <p className="text-xs text-muted-foreground">Trabajo finalizado el {fmtDate(job.completedAt)}.</p>
        )}
      </CardContent>
    </Card>
  );

  // ── Ya hay un reclamo en curso: mostramos su estado, no el formulario ──
  if (isOpen && dispute) {
    const steps = [
      { key: "abierta", label: "Reclamo abierto", done: true },
      { key: "en_revision", label: "OFIX revisa la evidencia", done: dispute.status === "en_revision" },
      { key: "resuelta", label: "Resolución", done: false },
    ];
    return (
      <div>
        <PageHeader
          title="Reclamo en curso"
          subtitle="Ya tenés un reclamo abierto sobre este trabajo. Los fondos siguen congelados."
          back
        />
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary-light p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Snowflake className="h-5 w-5" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-primary">Fondos congelados</p>
              <p className="text-foreground/80">
                El profesional no cobra mientras el reclamo esté abierto. OFIX libera el dinero recién cuando el
                caso se resuelve.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Estado del reclamo</CardTitle>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_TONE[dispute.status])}>
                {DISPUTE_STATUS_LABELS[dispute.status]}
              </span>
            </CardHeader>
            <CardContent className="space-y-5">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs">
                {steps.map((s, i) => (
                  <li key={s.key} className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "whitespace-nowrap rounded-full px-2.5 py-1 font-medium",
                        s.done ? "bg-success-light text-success" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </span>
                    {i < steps.length - 1 && <span className="text-muted-foreground/40">→</span>}
                  </li>
                ))}
              </ol>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Motivo</p>
                  <p className="mt-1 text-sm font-medium">{DISPUTE_REASON_LABELS[dispute.reason]}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Abierto el</p>
                  <p className="mt-1 text-sm font-medium">{fmtDateTime(dispute.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lo que contaste</p>
                <p className="mt-1 whitespace-pre-line text-sm text-foreground/90">{dispute.description}</p>
              </div>

              {!!dispute.images?.length && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Evidencia ({dispute.images.length})
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {dispute.images.map((src, i) => (
                      <div key={i} className="h-20 w-20 overflow-hidden rounded-lg border">
                        <img src={src} alt={`Evidencia ${i + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {dispute.resolution && (
                <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                  <p className="font-medium">Resolución de OFIX</p>
                  <p className="text-muted-foreground">{dispute.resolution}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" onClick={() => navigate(`/u/jobs/${job.id}`)}>
              Volver al trabajo
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={openChat}>
              <MessageCircle className="h-4 w-4" />
              Escribirle al profesional
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulario de reclamo ──
  return (
    <div>
      <PageHeader
        title="Abrir un reclamo"
        subtitle="Si el trabajo salió mal, tenés un mecanismo formal: OFIX media y el dinero no se mueve."
        back
      />
      <div className="mx-auto max-w-2xl space-y-6">
        {/* La palanca real del cliente: el escrow se congela */}
        <Card className="border-primary/30 bg-primary-light/60">
          <CardHeader className="flex-row items-start gap-3 space-y-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Snowflake className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base text-primary">Abrir un reclamo congela los fondos</CardTitle>
              <p className="mt-1 text-sm text-foreground/80">
                Mientras el reclamo esté abierto, el pago queda retenido por OFIX y el profesional no cobra.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <span className="font-medium">El dinero se detiene.</span> El pago pasa a{" "}
                  <span className="font-medium">{PAYMENT_STATUS_LABELS.en_disputa}</span> y no se libera hasta que el
                  caso cierre.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Scale className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <span className="font-medium">OFIX media.</span> Revisamos tu descripción, las fotos y la versión
                  del profesional antes de resolver.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <span className="font-medium">Se resuelve con plata de por medio.</span> Según el caso, se reembolsa
                  al cliente o se libera al profesional.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {jobSummary}

        {dispute && !isOpen && (
          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground">
              Ya hubo un reclamo sobre este trabajo, cerrado el{" "}
              {dispute.resolvedAt ? fmtDate(dispute.resolvedAt) : fmtDate(dispute.createdAt)} (
              {DISPUTE_STATUS_LABELS[dispute.status]}). Si el problema es otro, podés abrir uno nuevo.
            </p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contanos qué pasó</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo del reclamo *</Label>
                <Select value={reason} onValueChange={(v) => setReason(v as DisputeReason)}>
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Elegí el motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {REASON_ORDER.map((r) => (
                      <SelectItem key={r} value={r}>
                        {DISPUTE_REASON_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Qué pasó *</Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Ej: el desagüe volvió a perder al día siguiente y el profesional no responde los mensajes."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Sé concreto: qué se acordó, qué encontraste y qué pediste. Es lo que OFIX lee para mediar.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Evidencia (opcional)</Label>
                <ImageUploader images={images} onChange={setImages} max={4} />
                <p className="text-xs text-muted-foreground">
                  Hasta 4 fotos. Las fotos del problema son la prueba más fuerte de un reclamo.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Un reclamo es un paso formal: el profesional queda notificado y no cobra hasta la resolución. Los
                  reclamos sin fundamento se cierran a favor del profesional.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/u/jobs/${job.id}`)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Abriendo reclamo...
                    </>
                  ) : (
                    <>
                      <Snowflake className="h-4 w-4" />
                      Abrir reclamo y congelar fondos
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

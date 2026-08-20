import { useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BadgeCheck,
  CalendarClock,
  CircleDollarSign,
  Clock,
  FileWarning,
  History,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { ImageUploader } from "@/components/ofix/ImageUploader";
import { JobStatusBadge } from "@/components/ofix/badges";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import {
  WARRANTY_STATUS_LABELS,
  type JobStatus,
  type WarrantyClaimStatus,
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

// Tonos por estado del reclamo de garantía (exhaustivo sobre WarrantyClaimStatus).
const STATUS_TONE: Record<WarrantyClaimStatus, string> = {
  abierto: "bg-accent-light text-accent",
  agendado: "bg-primary-light text-primary",
  resuelto: "bg-success-light text-success",
  rechazado: "bg-destructive/10 text-destructive",
};

export default function UserWarranty() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [, refresh] = useReducer((x) => x + 1, 0);

  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const job = id ? store.getJob(id) : undefined;

  if (!id || !job) {
    return (
      <div>
        <PageHeader title="Garantía del trabajo" back />
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FileWarning className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold">No encontramos este trabajo</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Entrá a tus trabajos y reclamá la garantía desde el detalle del trabajo completado.
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
  const underWarranty = store.isUnderWarranty(job.id);
  const daysLeft = store.warrantyDaysLeft(job.id);
  const claims = store.getWarrantyClaims({ jobId: job.id });
  const activeClaim = claims.find((c) => c.status === "abierto" || c.status === "agendado");
  const pastClaims = claims.filter((c) => c.status === "resuelto" || c.status === "rechazado");

  const openChat = () => {
    if (!user) return;
    const chat = store.createChat(user.id, job.workerId);
    navigate(`/u/chat/${chat.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!description.trim()) throw new Error("Contanos qué volvió a fallar");
      store.claimWarranty({ jobId: job.id, description: description.trim(), images });
      toast.success("Garantía reclamada. El profesional vuelve sin cargo.");
      refresh();
      navigate(`/u/jobs/${job.id}`);
    } catch (err) {
      toast.error((err as Error).message || "No se pudo reclamar la garantía");
    } finally {
      setLoading(false);
    }
  };

  // Resumen del trabajo cubierto: contexto para el reclamo.
  const jobSummary = (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Trabajo cubierto</CardTitle>
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
              {job.completedAt ? `Finalizado el ${fmtDate(job.completedAt)}` : "Sin finalizar"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Historial: si el mismo problema se repite, queda registrado (tesis: "nos arregló 3 veces lo mismo").
  const historyCard = pastClaims.length > 0 && (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <History className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-base">Historial de garantía ({pastClaims.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pastClaims.map((c) => (
          <div key={c.id} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">{fmtDate(c.createdAt)}</p>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_TONE[c.status])}>
                {WARRANTY_STATUS_LABELS[c.status]}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-foreground/90">{c.description}</p>
          </div>
        ))}
        {pastClaims.length >= 2 && (
          <div className="flex flex-col gap-3 rounded-lg border border-accent/40 bg-accent-light/60 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              <span className="font-semibold text-accent">La misma falla ya volvió {pastClaims.length} veces.</span>{" "}
              Si el arreglo no resuelve, no sigas reclamando garantía: abrí un reclamo formal y OFIX media.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => navigate(`/u/jobs/${job.id}/dispute`)}
            >
              Abrir reclamo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // ── Fuera de garantía ──
  if (!underWarranty) {
    const neverStarted = job.status !== "completado" || !job.warrantyUntil;
    return (
      <div>
        <PageHeader title="Garantía del trabajo" subtitle="Estado de la cobertura de este trabajo" back />
        <div className="mx-auto max-w-2xl space-y-6">
          <Card className="border-muted-foreground/20">
            <CardHeader className="flex-row items-start gap-3 space-y-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {neverStarted ? "La garantía todavía no arrancó" : "El período de garantía venció"}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {neverStarted
                    ? "La garantía se activa cuando validás el trabajo y se liberan los fondos al profesional."
                    : `La cobertura de este trabajo estuvo vigente hasta el ${fmtDate(job.warrantyUntil as string)}.`}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cobertura</p>
                  <p className="mt-1 text-sm font-semibold">
                    {job.warrantyDays ? `${job.warrantyDays} días` : "Sin definir"}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Vencimiento</p>
                  <p className="mt-1 text-sm font-semibold">
                    {job.warrantyUntil ? fmtDate(job.warrantyUntil) : "—"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Igual podés escribirle al profesional o, si el trabajo salió mal, abrir un reclamo para que OFIX
                intervenga.
              </p>
            </CardContent>
          </Card>

          {jobSummary}
          {historyCard}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" onClick={() => navigate(`/u/jobs/${job.id}`)}>
              Volver al trabajo
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/u/jobs/${job.id}/dispute`)}
            >
              Abrir un reclamo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── En garantía: hay un reclamo activo ──
  if (activeClaim) {
    return (
      <div>
        <PageHeader title="Garantía reclamada" subtitle="Ya hay una revisión de garantía en curso" back />
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-start gap-3 rounded-lg bg-success-light p-4 text-success">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0" />
            <div>
              <p className="font-semibold">Trabajo en garantía</p>
              <p className="text-sm">
                {daysLeft !== null ? `Te quedan ${daysLeft} ${daysLeft === 1 ? "día" : "días"} de cobertura` : "Cobertura vigente"}
                {job.warrantyUntil ? ` (hasta el ${fmtDate(job.warrantyUntil)})` : ""}. La revisión no se cobra.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Estado del reclamo</CardTitle>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_TONE[activeClaim.status])}>
                {WARRANTY_STATUS_LABELS[activeClaim.status]}
              </span>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">
                    {activeClaim.status === "agendado" && activeClaim.scheduledAt
                      ? `Revisión agendada para el ${fmtDateTime(activeClaim.scheduledAt)}`
                      : "Esperando que el profesional agende la revisión"}
                  </p>
                  <p className="text-muted-foreground">
                    {activeClaim.status === "agendado"
                      ? "La visita de garantía no tiene costo."
                      : "Le avisamos al profesional: tiene que coordinar la vuelta sin cargo."}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Reclamado el</p>
                  <p className="mt-1 text-sm font-medium">{fmtDateTime(activeClaim.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Costo</p>
                  <p className="mt-1 text-sm font-medium text-success">Sin cargo</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Qué reportaste</p>
                <p className="mt-1 whitespace-pre-line text-sm text-foreground/90">{activeClaim.description}</p>
              </div>

              {!!activeClaim.images?.length && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Fotos ({activeClaim.images.length})
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeClaim.images.map((src, i) => (
                      <div key={i} className="h-20 w-20 overflow-hidden rounded-lg border">
                        <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {jobSummary}
          {historyCard}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" onClick={() => navigate(`/u/jobs/${job.id}`)}>
              Volver al trabajo
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={openChat}>
              <MessageCircle className="h-4 w-4" />
              Coordinar por chat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── En garantía: formulario de reclamo ──
  return (
    <div>
      <PageHeader
        title="Reclamar garantía"
        subtitle="Si el arreglo no aguantó, el profesional vuelve sin que pagues de nuevo."
        back
      />
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-start gap-3 rounded-lg bg-success-light p-4 text-success">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0" />
          <div>
            <p className="font-semibold">
              {daysLeft !== null
                ? `Trabajo en garantía — te quedan ${daysLeft} ${daysLeft === 1 ? "día" : "días"}`
                : "Trabajo en garantía"}
            </p>
            <p className="text-sm">
              {job.warrantyUntil
                ? `La cobertura vence el ${fmtDate(job.warrantyUntil)}.`
                : "La cobertura está vigente."}{" "}
              {job.warrantyDays ? `Garantía de ${job.warrantyDays} días sobre el trabajo realizado.` : ""}
            </p>
          </div>
        </div>

        <Card className="border-success/30">
          <CardContent className="flex items-start gap-3 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-success">La revisión de garantía no se cobra</p>
              <p className="text-foreground/80">
                No se genera un pago nuevo ni comisión: el profesional vuelve a revisar el mismo trabajo sin cargo.
                Si vuelve a fallar, queda registrado en su historial.
              </p>
            </div>
          </CardContent>
        </Card>

        {jobSummary}
        {historyCard}

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">¿Qué volvió a fallar?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Descripción de la falla *</Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Ej: la canilla que arregló volvió a gotear a los 5 días, igual que antes del arreglo."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Aclará si es el mismo problema de antes o algo nuevo: ayuda a resolverlo de fondo.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Fotos de la falla (opcional)</Label>
                <ImageUploader images={images} onChange={setImages} max={4} />
                <p className="text-xs text-muted-foreground">Hasta 4 fotos. Sirven para comparar con el trabajo entregado.</p>
              </div>

              <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Al reclamar, le avisamos al profesional para que agende la revisión sin cargo. Vas a ver la fecha
                  acá y en tus notificaciones.
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
                      Reclamando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Reclamar garantía sin cargo
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

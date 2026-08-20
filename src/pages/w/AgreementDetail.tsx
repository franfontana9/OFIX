import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, MessageSquare, MapPin, Wallet, Star, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { JobStatusBadge } from "@/components/ofix/badges";
import { PriceBreakdown } from "@/components/ofix/PriceBreakdown";
import { StarRating } from "@/components/ofix/StarRating";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function WorkerAgreementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const job = id ? store.getJob(id) : undefined;

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
  const isCompleted = job.status === "completado";

  const openChat = () => {
    const chat = store.createChat(user!.id, job.clientId);
    navigate(`/w/chat/${chat.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={job.title} subtitle={`${job.category} · Seguimiento del acuerdo`} back action={<JobStatusBadge status={job.status} />} />

      {isCompleted && (
        <Card className="border-success/40 bg-success-light">
          <CardContent className="flex items-center gap-3 p-5">
            <CheckCircle2 className="h-8 w-8 text-success" />
            <div>
              <p className="font-semibold text-success">¡Acuerdo exitoso!</p>
              <p className="text-sm text-success/80">El cliente validó el trabajo y se liberaron los fondos a tu billetera.</p>
            </div>
          </CardContent>
        </Card>
      )}

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
                <StarRating value={client?.rating || 0} showValue count={client?.reviewCount} size={14} className="mt-1" />
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
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Pago {payment.status}</span>
                    </>
                  )}
                </div>
                <PriceBreakdown gross={payment.gross} commission={payment.commission} insuranceCost={payment.insuranceCost} />
                <div className="flex items-center justify-between rounded-lg bg-success-light p-3">
                  <span className="text-sm font-medium text-success">Tu cobro neto</span>
                  <span className="text-lg font-bold text-success">${payment.net.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {payment.status === "retenido"
                    ? "Los fondos se liberan a tu billetera cuando el cliente valida el trabajo."
                    : payment.status === "liberado"
                      ? "Ya podés retirar este cobro desde la sección Cobros."
                      : "Pago pendiente de acreditación."}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">El cliente todavía no realizó el pago. Vas a cobrar ${job.amount.toLocaleString()} al concretar el trabajo.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seguimiento del acuerdo — timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seguimiento del acuerdo</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline status={job.status} />
        </CardContent>
      </Card>

      {isCompleted && !job.reviewedByWorker && (
        <Card className="border-accent/40 bg-accent-light">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-accent" />
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
    </div>
  );
}

function Timeline({ status }: { status: JobStatus }) {
  const order: JobStatus[] = ["agendado", "en_progreso", "completado"];
  if (status === "cancelado") {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <span className="h-3 w-3 rounded-full bg-destructive" />
        <span className="font-medium">Acuerdo cancelado</span>
      </div>
    );
  }
  const currentIdx = order.indexOf(status);
  return (
    <ol className="space-y-4">
      {order.map((s, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs", done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground")}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </span>
              {i < order.length - 1 && <span className={cn("mt-1 h-8 w-0.5", done ? "bg-primary" : "bg-muted-foreground/20")} />}
            </div>
            <div className="pt-0.5">
              <p className={cn("font-medium", active && "text-primary")}>{JOB_STATUS_LABELS[s]}</p>
              <p className="text-xs text-muted-foreground">
                {s === "agendado" && "El acuerdo fue creado y agendado."}
                {s === "en_progreso" && "El pago está en garantía, el trabajo está en curso."}
                {s === "completado" && "El cliente validó el trabajo. ¡Listo!"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

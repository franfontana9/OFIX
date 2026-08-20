import { useReducer, useState } from "react";
import { Briefcase, Car, Check, CheckCircle2, KeyRound, Phone, Share2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { VerificationBadge } from "@/components/ofix/badges";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

function hora(iso?: string): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Ficha "quién va a ir" + validación de identidad en la puerta.
 * Cierra el miedo textual de la entrevista 3: "dejar entrar a desconocidos a mi casa".
 * El código de llegada sólo lo devuelve el store al cliente.
 */
export function ArrivalPanel({
  jobId,
  onDone,
  className,
}: {
  jobId: string;
  onDone?: () => void;
  className?: string;
}) {
  const [, refresh] = useReducer((x: number) => x + 1, 0);
  const [code, setCode] = useState("");

  const card = store.getArrivalCard(jobId);
  const job = store.getJob(jobId);
  if (!card) return null;

  const confirmedAt = job?.arrivalConfirmedAt;
  // El código sólo lo ve el cliente (lo filtra el store) y sólo hasta que valida la identidad.
  // Pedimos `en_camino` porque es la misma precondición que valida `store.confirmArrival`:
  // así no queda un botón muerto en un trabajo cancelado.
  const puedeValidar = !!card.arrivalCode && !confirmedAt && job?.status === "en_camino";
  const trackingToken = job?.trackingToken;

  const checks: { label: string; ok: boolean }[] = [
    { label: "Identidad", ok: !!card.verification?.identity },
    { label: "Antecedentes", ok: !!card.verification?.background },
    { label: "Matrícula", ok: !!card.verification?.license },
  ];
  const checksOk = checks.filter((c) => c.ok);

  function confirmar() {
    try {
      store.confirmArrival(jobId, code.trim());
      toast.success("Identidad confirmada", { description: "El profesional ya puede empezar el trabajo." });
      setCode("");
      refresh();
      onDone?.();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo confirmar la identidad");
    }
  }

  async function compartirSeguimiento() {
    if (!trackingToken) {
      toast.error("Todavía no hay un seguimiento para compartir");
      return;
    }
    const url = `${window.location.origin}/t/${trackingToken}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link de seguimiento copiado", {
        description: "Compartilo con alguien de confianza para que siga el servicio en vivo.",
      });
    } catch {
      toast.error("No se pudo copiar el link de seguimiento");
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="space-y-5 p-5 sm:p-6">
        {/* ── Encabezado ── */}
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Quién va a ir
        </div>

        {/* ── Ficha del profesional ── */}
        <div className="flex items-start gap-4">
          <UserAvatar name={card.name} photo={card.photo} className="h-20 w-20 shrink-0 text-lg" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-bold leading-tight">{card.name}</h3>
            {card.trade && <p className="truncate text-sm text-muted-foreground">{card.trade}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StarRating value={card.rating} showValue count={card.reviewCount} />
              <VerificationBadge verified={card.verified} />
            </div>
          </div>
        </div>

        {/* ── Controles superados ── */}
        {checksOk.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {checksOk.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success ring-1 ring-success/20"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
                {c.label}
              </span>
            ))}
          </div>
        )}

        {/* ── Datos duros: trabajos, vehículo, teléfono ── */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" />
              Trabajos hechos
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">{card.jobsDone.toLocaleString("es-AR")}</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Car className="h-3.5 w-3.5" />
              Vehículo
            </div>
            <p className="mt-1 truncate text-sm font-semibold">{card.vehicle || "No informado"}</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              Teléfono
            </div>
            {card.phone ? (
              <a href={`tel:${card.phone}`} className="mt-1 block truncate text-sm font-semibold text-primary hover:underline">
                {card.phone}
              </a>
            ) : (
              <p className="mt-1 text-sm font-semibold">No informado</p>
            )}
          </div>
        </div>

        {/* ── Identidad ya confirmada ── */}
        {confirmedAt && (
          <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-success">Identidad confirmada</p>
              <p className="text-xs text-muted-foreground">
                Validaste el código a las {hora(confirmedAt)}. El trabajo ya está en curso.
              </p>
            </div>
          </div>
        )}

        {/* ── Código de llegada + validación en la puerta ── */}
        {puedeValidar && (
          <div className="space-y-4 rounded-xl border-2 border-accent/40 bg-accent-light/60 p-4 sm:p-5">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                <KeyRound className="h-3.5 w-3.5" />
                Código de llegada
              </div>
              <p className="mt-2 font-mono text-4xl font-extrabold tracking-[0.35em] text-foreground sm:text-5xl">
                {card.arrivalCode}
              </p>
              <p className="mt-2 text-sm font-semibold">Pedile este código antes de dejarlo entrar</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Si no coincide con el que te dice, no abras la puerta y avisanos.
              </p>
            </div>

            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                confirmar();
              }}
            >
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                placeholder="0000"
                aria-label="Código de 4 dígitos"
                className="h-11 text-center font-mono text-xl font-bold tracking-[0.3em] sm:max-w-[160px]"
              />
              <Button type="submit" disabled={code.length !== 4} className="h-11 flex-1">
                <ShieldCheck className="h-4 w-4" />
                Confirmar identidad
              </Button>
            </form>
          </div>
        )}

        {/* ── Compartir seguimiento con un contacto de confianza ── */}
        {trackingToken && (
          <div className="flex justify-center border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={compartirSeguimiento}
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Share2 className="h-4 w-4" />
              Compartir seguimiento
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

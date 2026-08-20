import { Check, X } from "lucide-react";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

// Fecha corta es-AR: día + hora real del evento (ej. "20/08, 14:32").
function fechaCorta(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Trazabilidad visual del servicio: cada paso con la hora real en que pasó.
 * Se lee de un vistazo — hecho (check verde + hora) vs pendiente (gris, sin hora).
 * Va sin Card propio: las pantallas lo montan dentro de su propia Card.
 */
export function JobTimeline({ jobId, className }: { jobId: string; className?: string }) {
  const steps = store.getJobTimeline(jobId);
  if (!steps.length) return null;

  return (
    <ol className={cn("relative", className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        const nextDone = steps[i + 1]?.done ?? false;
        const cancelled = step.key === "cancelado";

        return (
          <li key={step.key} className={cn("relative flex gap-3", !last && "pb-5")}>
            {/* Línea conectora entre los círculos */}
            {!last && (
              <span
                className={cn(
                  "absolute bottom-0 left-[11px] top-6 w-0.5 rounded-full",
                  step.done && nextDone && !cancelled ? "bg-success/40" : "bg-border",
                )}
                aria-hidden
              />
            )}

            {/* Círculo del paso */}
            <span
              className={cn(
                "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-1",
                cancelled
                  ? "bg-destructive/10 text-destructive ring-destructive/30"
                  : step.done
                    ? "bg-success/10 text-success ring-success/30"
                    : "bg-muted text-muted-foreground ring-border",
              )}
            >
              {cancelled ? (
                <X className="h-3.5 w-3.5" strokeWidth={3} />
              ) : step.done ? (
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              )}
            </span>

            {/* Etiqueta + hora real */}
            <div className="min-w-0 flex-1 pt-0.5">
              <p
                className={cn(
                  "text-sm font-semibold leading-tight",
                  cancelled ? "text-destructive" : step.done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              {step.done && step.at && (
                <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{fechaCorta(step.at)}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

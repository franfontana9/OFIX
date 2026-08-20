import { useEffect, useReducer } from "react";
import { Clock, MapPin, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { JobStatusBadge } from "@/components/ofix/badges";
import { RealMap } from "@/components/ofix/RealMap";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { JobStatus } from "@/lib/types";

// Cada cuánto volvemos a pedirle el estado derivado al store para que el ETA "corra".
const TICK_MS = 5000;

// Estados en los que el trayecto ya existe y tiene sentido mostrarlo.
const TRACKABLE: JobStatus[] = ["en_camino", "en_progreso", "completado"];

function hora(iso?: string): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

function km(value: number | null): string {
  if (value === null) return "—";
  return `${value.toLocaleString("es-AR")} km`;
}

/**
 * Seguimiento en vivo del trayecto (diferencial 2.11 de la tesis).
 * El ETA sale de `store.getTrackingState`, que es derivado del reloj: no hay timers en el
 * store, así que acá forzamos un re-render periódico y volvemos a leer el estado.
 */
export function TripTracker({
  jobId,
  role,
  className,
}: {
  jobId: string;
  role: "client" | "worker";
  className?: string;
}) {
  const [, tick] = useReducer((x: number) => x + 1, 0);

  const state = store.getTrackingState(jobId);
  const trayectoTerminado = !!state?.arrivedAt || state?.status === "completado";

  // ETA en vivo: re-render cada 5s y nueva lectura del estado derivado.
  // Se corta cuando el trayecto terminó: no tiene sentido seguir latiendo
  // en un trabajo que ya llegó o se completó.
  useEffect(() => {
    if (trayectoTerminado) return;
    const id = window.setInterval(() => tick(), TICK_MS);
    return () => window.clearInterval(id);
  }, [jobId, trayectoTerminado]);

  if (!state) return null;
  if (!TRACKABLE.includes(state.status) || !state.departedAt) return null;

  const isClient = role === "client";
  const card = store.getArrivalCard(jobId);
  const workerName = card?.name || "El profesional";
  const workerTrade = card?.trade;

  const arrived = !!state.arrivedAt;
  const completed = state.status === "completado";
  const eta = state.etaMinutes;
  // Si ya llegó, la barra va al 100% aunque el ETA declarado no se haya
  // cumplido: si no, decía "Llegó" en verde con la barra a mitad de camino.
  const pct = arrived || completed ? 100 : Math.round(Math.max(0, Math.min(1, state.progress)) * 100);
  // El puntero no puede quedar cortado en los extremos de la barra.
  const markerPct = Math.min(96, Math.max(4, pct));

  // ── Titular: llegada en verde, "está llegando" sin números negativos, o el ETA ──
  let titulo: string;
  if (completed) titulo = "Servicio completado";
  else if (arrived) titulo = isClient ? "Llegó" : "Llegaste";
  else if (eta === 0) titulo = isClient ? "Está llegando" : "Estás llegando";
  else if (eta !== null) titulo = isClient ? `Llega en ~${eta} min` : `Llegás en ~${eta} min`;
  else titulo = isClient ? "En camino" : "Vas en camino";

  const subtitulo = arrived
    ? `En el domicilio desde las ${hora(state.arrivedAt)}`
    : isClient
      ? `${workerName} está en camino a tu domicilio`
      : "Vas en camino al domicilio del cliente";

  const workerGeo = state.workerGeo;
  const clientGeo = state.clientGeo;

  const mapSubtitle = arrived
    ? "En el domicilio"
    : [workerTrade, state.distanceKm !== null ? `a ${km(state.distanceKm)}` : null].filter(Boolean).join(" · ") ||
      "En camino";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="space-y-5 p-5 sm:p-6">
        {/* ── Encabezado: en vivo + estado ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="relative flex h-2 w-2">
                {!arrived && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                )}
                <span
                  className={cn("relative inline-flex h-2 w-2 rounded-full", arrived ? "bg-success" : "bg-primary")}
                />
              </span>
              Seguimiento en vivo
            </div>

            <h3
              className={cn(
                "mt-2 text-3xl font-extrabold leading-none tracking-tight sm:text-4xl",
                arrived || completed ? "text-success" : "text-foreground",
              )}
            >
              {titulo}
            </h3>
            <p className="mt-1.5 truncate text-sm text-muted-foreground">{subtitulo}</p>
          </div>

          <JobStatusBadge status={state.status} className="shrink-0" />
        </div>

        {/* ── Barra de progreso del trayecto ── */}
        <div className="space-y-2">
          <div className="relative">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-1000 ease-linear",
                  arrived || completed ? "bg-success" : "bg-primary",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div
              className={cn(
                "absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md ring-2 ring-card transition-[left] duration-1000 ease-linear",
                arrived || completed ? "bg-success" : "bg-primary",
              )}
              style={{ left: `${markerPct}%` }}
            >
              <Navigation className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <span>Salida {hora(state.departedAt)}</span>
            <span>{isClient ? "Tu domicilio" : "Domicilio del cliente"}</span>
          </div>
        </div>

        {/* ── Métricas del trayecto ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {arrived ? "Ubicación" : "Distancia restante"}
            </div>
            {/* La etiqueta acompaña al valor: antes decía "Distancia restante"
                con el valor "Llegó", que no cierra. */}
            <p className="mt-1 text-lg font-bold tabular-nums">
              {arrived ? "En el domicilio" : km(state.distanceKm)}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Hora de salida
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">{hora(state.departedAt) || "—"}</p>
          </div>
        </div>

        {/* ── Mapa real: sólo si tenemos las dos posiciones ── */}
        {workerGeo && clientGeo && (
          <RealMap
            points={[
              {
                id: "worker",
                name: workerName,
                lat: workerGeo.lat,
                lng: workerGeo.lng,
                subtitle: mapSubtitle,
                distance: state.distanceKm,
                verified: card?.verified,
                photo: card?.photo,
              },
            ]}
            center={clientGeo}
            className="h-[300px]"
          />
        )}
      </CardContent>
    </Card>
  );
}

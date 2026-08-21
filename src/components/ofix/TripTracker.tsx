import { useEffect, useReducer } from "react";
import { Clock, MapPin, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { JobStatusBadge } from "@/components/ofix/badges";
import { RealMap, type MapPoint } from "@/components/ofix/RealMap";
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
 * Seguimiento del trayecto (diferencial 2.11 de la tesis).
 *
 * Es EL MISMO mapa que `/u/map`, con un solo punto: el profesional que viene
 * hacia el domicilio. Antes era un widget aparte con su propia barra y sus
 * cajitas de métricas, y con el mapa relegado abajo — se leía como otro
 * componente en vez de como "el mapa siguiendo a una persona". Ahora el mapa es
 * el protagonista y el ETA va encima, y el pin se toca igual que en el mapa
 * general para ver quién es.
 *
 * El ETA sale de `store.getTrackingState`, derivado del reloj: no hay timers en
 * el store, así que acá se fuerza un re-render periódico y se vuelve a leer.
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

  // Se corta cuando el trayecto terminó: no tiene sentido seguir latiendo en un
  // trabajo que ya llegó o se completó.
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

  const arrived = !!state.arrivedAt;
  const completed = state.status === "completado";
  const eta = state.etaMinutes;
  // Si ya llegó, la barra va al 100% aunque el ETA declarado no se haya
  // cumplido: si no, decía "Llegó" en verde con la barra a mitad de camino.
  const pct = arrived || completed ? 100 : Math.round(Math.max(0, Math.min(1, state.progress)) * 100);

  // ── Titular: llegada en verde, "está llegando" sin números negativos, o el ETA ──
  let titulo: string;
  if (completed) titulo = "Servicio completado";
  else if (arrived) titulo = isClient ? "Llegó" : "Llegaste";
  else if (eta === 0) titulo = isClient ? "Está llegando" : "Estás llegando";
  else if (eta !== null) titulo = isClient ? `Llega en ~${eta} min` : `Llegás en ~${eta} min`;
  else titulo = isClient ? "En camino" : "Vas en camino";

  const workerGeo = state.workerGeo;
  const clientGeo = state.clientGeo;
  const verde = arrived || completed;

  const points: MapPoint[] =
    workerGeo
      ? [
          {
            id: "worker",
            name: workerName,
            lat: workerGeo.lat,
            lng: workerGeo.lng,
            subtitle: card?.trade,
            distance: state.distanceKm,
            rating: card?.rating,
            reviewCount: card?.reviewCount,
            verified: card?.verified,
            photo: card?.photo,
            // Mismo lenguaje que el mapa general: el color del pin dice el estado.
            pinColor: verde ? "#16a34a" : "#2563eb",
            tagLabel: arrived ? "En el domicilio" : eta !== null ? `Llega en ~${eta} min` : "En camino",
            tagColor: verde ? "#16a34a" : "#2563eb",
            actionLabel: "Ver quién viene",
          },
        ]
      : [];

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* ── Encabezado compacto: en vivo + ETA + estado ── */}
      <CardContent className="space-y-3 p-4 pb-3 sm:p-5 sm:pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="relative flex h-2 w-2">
                {!arrived && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                )}
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", verde ? "bg-success" : "bg-primary")} />
              </span>
              Seguimiento en vivo
            </div>
            <h3
              className={cn(
                "mt-1.5 text-2xl font-extrabold leading-none tracking-tight sm:text-3xl",
                verde ? "text-success" : "text-foreground",
              )}
            >
              {titulo}
            </h3>
          </div>
          <JobStatusBadge status={state.status} className="shrink-0" />
        </div>

        {/* Barra del trayecto */}
        <div className="space-y-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-1000 ease-linear",
                verde ? "bg-success" : "bg-primary",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Salió {hora(state.departedAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              {arrived ? (
                <>
                  <MapPin className="h-3 w-3" />
                  {isClient ? "En tu domicilio" : "En el domicilio"}
                </>
              ) : (
                <>
                  <Navigation className="h-3 w-3" />
                  {km(state.distanceKm)} · {isClient ? "tu domicilio" : "domicilio del cliente"}
                </>
              )}
            </span>
          </div>
        </div>
      </CardContent>

      {/* ── El mapa es el protagonista ── */}
      {workerGeo && clientGeo ? (
        <RealMap points={points} center={clientGeo} className="rounded-none border-x-0 border-b-0 h-[280px] sm:h-[340px]" />
      ) : (
        <div className="border-t bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
          Sin ubicación para mostrar en el mapa.
        </div>
      )}
    </Card>
  );
}

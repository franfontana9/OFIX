import { useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Lock,
  MapPin,
  Navigation,
  Radio,
  ShieldCheck,
  Wrench,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { JobStatusBadge, VerificationBadge } from "@/components/ofix/badges";
import { RealMap, type MapPoint } from "@/components/ofix/RealMap";
import { ThemeToggle } from "@/components/ofix/ThemeToggle";
import { cn } from "@/lib/utils";
import { store } from "@/lib/store";
import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/types";

// Cada cuánto se refresca el ETA (el estado del viaje se deriva del reloj en el store).
const TICK_MS = 5000;

const hhmm = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) : null;

type StatusStyle = {
  icon: typeof Navigation;
  tint: string;
  bar: string;
  headline: string;
  detail: string;
};

const STATUS_STYLE: Record<JobStatus, StatusStyle> = {
  agendado: {
    icon: CalendarClock,
    tint: "bg-muted text-muted-foreground",
    bar: "bg-muted-foreground/40",
    headline: "Todavía no salió",
    detail: "El servicio está agendado. Cuando el profesional inicie el viaje, lo vas a ver acá.",
  },
  en_camino: {
    icon: Navigation,
    tint: "bg-primary-light text-primary",
    bar: "bg-primary",
    headline: "En camino al domicilio",
    detail: "El profesional ya salió y está yendo al domicilio del servicio.",
  },
  en_progreso: {
    icon: Wrench,
    tint: "bg-accent-light text-accent",
    bar: "bg-accent",
    headline: "Trabajando en el domicilio",
    detail: "El profesional llegó, se validó su identidad y el trabajo está en curso.",
  },
  completado: {
    icon: CheckCircle2,
    tint: "bg-success-light text-success",
    bar: "bg-success",
    headline: "Servicio completado",
    detail: "El trabajo terminó y quedó registrado en OFIX.",
  },
  cancelado: {
    icon: XCircle,
    tint: "bg-destructive/10 text-destructive",
    bar: "bg-destructive",
    headline: "Servicio cancelado",
    detail: "Este servicio se canceló, así que el seguimiento ya no está activo.",
  },
};

const ORDER: JobStatus[] = ["agendado", "en_camino", "en_progreso", "completado"];

function OfixLogo() {
  return <span className="text-2xl font-extrabold tracking-tight text-primary">OFIX</span>;
}

export default function TrackShared() {
  const { token } = useParams<{ token: string }>();
  const [, tick] = useReducer((x: number) => x + 1, 0);

  // ETA en vivo: forzamos re-render y volvemos a pedirle el estado derivado al store.
  const data = token ? store.getTrackingByToken(token) : null;

  // El ETA solo tiene que correr mientras el profesional está viajando: una vez
  // que llegó o el trabajo cerró, este link deja de latir.
  const enViaje = data?.status === "en_camino" && !data.state?.arrivedAt;
  useEffect(() => {
    if (!enViaje) return;
    const id = window.setInterval(() => tick(), TICK_MS);
    return () => window.clearInterval(id);
  }, [enViaje]);

  // ── Link inválido o vencido ──
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="items-center space-y-3 text-center">
            <OfixLogo />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Lock className="h-7 w-7" />
            </div>
            <CardTitle className="text-lg">Este link de seguimiento no es válido o ya expiró</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-center">
            <p className="text-sm text-muted-foreground">
              Pedile al cliente que te comparta un link nuevo desde el seguimiento del servicio en OFIX.
            </p>
            <Button asChild className="w-full">
              <Link to="/">Ir al inicio de OFIX</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const state = data.state;
  const status = data.status;
  const style = STATUS_STYLE[status];
  const StatusIcon = style.icon;

  const enCamino = status === "en_camino";
  const finished = status === "en_progreso" || status === "completado";
  const percent = status === "cancelado" ? 0 : finished ? 100 : Math.round((state?.progress ?? 0) * 100);
  const eta = enCamino ? state?.etaMinutes ?? null : null;

  const departedAt = hhmm(state?.departedAt);
  const arrivedAt = hhmm(state?.arrivedAt);
  const updatedAt = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  const workerGeo = state?.workerGeo;
  const clientGeo = state?.clientGeo;
  const showMap = !!workerGeo || !!clientGeo;
  const points: MapPoint[] = workerGeo
    ? [
        {
          id: "profesional",
          name: data.workerName || "Profesional",
          lat: workerGeo.lat,
          lng: workerGeo.lng,
          subtitle: data.workerTrade,
          verified: data.workerVerified,
          photo: data.workerPhoto,
          distance: state?.distanceKm ?? null,
        },
      ]
    : [];

  const steps: { label: string; at: string | null; done: boolean }[] = [
    { label: "Servicio agendado", at: null, done: true },
    {
      label: "El profesional salió",
      at: departedAt,
      done: !!state?.departedAt || status === "en_camino" || finished,
    },
    {
      label: "Llegó al domicilio",
      at: arrivedAt,
      done: !!state?.arrivedAt || !!state?.arrivalConfirmed || finished,
    },
    { label: "Trabajo completado", at: null, done: status === "completado" },
  ];
  const cancelled = status === "cancelado";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Barra pública (esta pantalla no vive dentro del AppLayout) */}
      <header className="sticky top-0 z-10 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <OfixLogo />
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline">Seguimiento</span>
          </Link>
          <div className="flex items-center gap-1">
            {enCamino && (
              <span className="mr-1 inline-flex items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                <Radio className="h-3 w-3 animate-pulse" />
                En vivo
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md space-y-5 px-4 pb-10 pt-6">
        {/* Encabezado */}
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Seguimiento del servicio
          </p>
          <h1 className="text-2xl font-bold leading-tight tracking-tight">{data.jobTitle}</h1>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <JobStatusBadge status={status} />
            {data.clientName && (
              <span className="text-sm text-muted-foreground">Compartido por {data.clientName}</span>
            )}
          </div>
        </div>

        {/* Ficha del profesional */}
        <Card className="shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <UserAvatar name={data.workerName || "Profesional"} photo={data.workerPhoto} className="h-16 w-16" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Quién va a entrar
              </p>
              <div className="flex items-center gap-1.5">
                <p className="truncate text-lg font-semibold">{data.workerName || "Profesional asignado"}</p>
                {data.workerVerified && <ShieldCheck className="h-4 w-4 shrink-0 text-success" />}
              </div>
              {data.workerTrade && <p className="truncate text-sm text-muted-foreground">{data.workerTrade}</p>}
              <div className="mt-2">
                <VerificationBadge verified={data.workerVerified} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ETA en vivo + progreso del trayecto */}
        <Card className="shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {enCamino ? "Llegada estimada" : "Estado del trayecto"}
                </p>
                {enCamino ? (
                  eta !== null && eta > 0 ? (
                    <p className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-4xl font-bold leading-none text-primary">{eta}</span>
                      <span className="text-base font-medium text-muted-foreground">min</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-2xl font-bold leading-none text-primary">Está llegando</p>
                  )
                ) : (
                  <p className="mt-1 text-2xl font-bold leading-none">{style.headline}</p>
                )}
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", style.tint)}>
                <StatusIcon className="h-6 w-6" />
              </div>
            </div>

            {!cancelled && (
              <div className="space-y-2">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", style.bar)}
                    style={{ width: `${Math.max(percent, 3)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{percent}% del trayecto</span>
                  {typeof state?.distanceKm === "number" && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />a {state.distanceKm} km
                    </span>
                  )}
                </div>
              </div>
            )}

            <p className="flex items-center gap-1.5 border-t pt-3 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {enCamino ? `Actualizado a las ${updatedAt}` : `Consultado a las ${updatedAt}`}
            </p>
          </CardContent>
        </Card>

        {/* Mapa del recorrido */}
        {showMap && (
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recorrido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-5">
              <RealMap points={points} center={clientGeo} className="h-72 w-full" />
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  El profesional
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  Domicilio del servicio
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado grande + hitos */}
        <Card className="shadow-sm">
          <CardContent className="space-y-5 p-5">
            <div className={cn("flex items-start gap-4 rounded-xl p-4", style.tint)}>
              <StatusIcon className="mt-0.5 h-7 w-7 shrink-0" />
              <div>
                <p className="text-lg font-bold leading-tight">{JOB_STATUS_LABELS[status]}</p>
                <p className="mt-1 text-sm opacity-90">{style.detail}</p>
              </div>
            </div>

            {!cancelled && (
              <ol className="space-y-3">
                {steps.map((step, i) => {
                  const isCurrent = step.done && ORDER[i] === status;
                  return (
                    <li key={step.label} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                          step.done
                            ? "border-transparent bg-success text-success-foreground"
                            : "border-dashed border-border bg-background text-muted-foreground",
                        )}
                      >
                        {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          step.done ? "font-medium text-foreground" : "text-muted-foreground",
                          isCurrent && "text-primary",
                        )}
                      >
                        {step.label}
                      </span>
                      {step.at && <span className="text-xs text-muted-foreground">{step.at}</span>}
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>

        {/* Nota de privacidad: este link no filtra el código de llegada */}
        <div className="space-y-3 rounded-xl border border-dashed bg-background/60 p-4 text-center">
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Solo lectura
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Seguimiento compartido por el cliente. No incluye datos de contacto ni el código de llegada.
          </p>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link to="/">Conocé OFIX</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Siren, CalendarClock, FileText, ClipboardList, Briefcase, ArrowRight, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StatCard } from "@/components/ofix/StatCard";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export default function UserBusiness() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const offers = user ? store.getOffers({ authorId: user.id }) : [];
  const jobs = user ? store.getJobs({ clientId: user.id }) : [];
  const periods = user ? store.getBillingPeriods(user.id) : [];
  const totalBilled = periods.reduce((s, p) => s + p.total, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Panel PyME"
        subtitle="Servicios premium de mantenimiento y urgencias para tu negocio gastronómico"
      />

      {/* Resumen de actividad */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} label="Solicitudes publicadas" value={offers.length} tone="primary" />
        <StatCard icon={Briefcase} label="Trabajos contratados" value={jobs.length} tone="success" />
        <StatCard icon={Receipt} label="Total facturado" value={money(totalBilled)} tone="accent" />
      </div>

      {/* Features */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Servicios para tu PyME</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Urgencias express */}
          <Card className="flex flex-col border-destructive/30 bg-destructive/5">
            <CardContent className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Siren className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Urgencias express</h3>
                <p className="text-sm text-muted-foreground">
                  Un local parado pierde plata. Publicá una urgencia y recibí propuestas de profesionales verificados en minutos.
                </p>
              </div>
              <Button variant="destructive" className="w-full gap-2" onClick={() => navigate("/u/requests/new")}>
                <Siren className="h-4 w-4" />
                Pedir ahora
              </Button>
            </CardContent>
          </Card>

          {/* Mantenimiento recurrente */}
          <Card className="flex flex-col">
            <CardContent className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Mantenimiento recurrente</h3>
                <p className="text-sm text-muted-foreground">
                  Agendá visitas periódicas de plomería, electricidad y refrigeración para prevenir cortes en plena operación.
                </p>
              </div>
              <span className="text-xs font-medium text-muted-foreground">Próximamente</span>
            </CardContent>
          </Card>

          {/* Facturación / SLA */}
          <Card className="flex flex-col">
            <CardContent className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-light text-accent">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Facturación / SLA</h3>
                <p className="text-sm text-muted-foreground">
                  Comprobante tipo A por cada trabajo y reportes mensuales de todo lo que gastó tu negocio.
                </p>
              </div>
              <span className="text-xs font-medium text-accent">Disponible abajo ↓</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Facturación mensual */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-lg font-semibold">Facturación</h2>
          <p className="text-sm text-muted-foreground">
            Total facturado: <span className="font-semibold text-foreground">{money(totalBilled)}</span>
          </p>
        </div>

        {periods.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Receipt className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold">Todavía no hay comprobantes</p>
                <p className="text-sm text-muted-foreground">
                  Cuando pagues un trabajo vas a poder descargar el comprobante desde acá.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {periods.map((p) => (
              <Card key={p.key}>
                <CardContent className="p-0">
                  {/* Resumen del mes */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                    <div>
                      <p className="font-semibold capitalize">{p.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.jobs} {p.jobs === 1 ? "trabajo" : "trabajos"} · servicios {money(p.gross)} · comisión{" "}
                        {money(p.commission)}
                        {p.insuranceCost > 0 && ` · seguro ${money(p.insuranceCost)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
                      <p className="text-xl font-bold">{money(p.total)}</p>
                    </div>
                  </div>

                  {/* Comprobantes del mes */}
                  <ul className="divide-y">
                    {p.receipts.map((r) => (
                      <li key={r.number}>
                        <button
                          type="button"
                          onClick={() => navigate(`/u/jobs/${r.jobId}/receipt`)}
                          className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-foreground/70 text-sm font-bold">
                            {r.kind}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{r.concept}</span>
                            <span className="block text-xs text-muted-foreground">
                              {r.number} ·{" "}
                              {new Date(r.issuedAt).toLocaleDateString("es-AR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block font-semibold">{money(r.total)}</span>
                            <span className="block text-xs text-muted-foreground">{r.worker.name}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Accesos rápidos */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Gestión</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => navigate("/u/requests")}>
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Mis solicitudes</p>
                  <p className="text-xs text-muted-foreground">{offers.length} publicadas</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => navigate("/u/jobs")}>
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-success-light text-success">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Mis trabajos</p>
                  <p className="text-xs text-muted-foreground">{jobs.length} contratados</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

import {
  Activity,
  Ban,
  CheckCircle2,
  ClipboardList,
  Coins,
  Gauge,
  Handshake,
  Info,
  MapPin,
  Receipt,
  Repeat,
  Scale,
  ShieldAlert,
  Smile,
  Timer,
  TrendingUp,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ofix/EmptyState";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StatCard } from "@/components/ofix/StatCard";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

type Tone = "primary" | "accent" | "success" | "muted";

// Cada métrica se muestra junto a la fórmula / sección de la tesis que la define:
// eso es lo que hace el panel defendible en la exposición.
function Metric({
  icon,
  label,
  value,
  tone = "primary",
  hint,
  source,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: Tone;
  hint?: string;
  source: string;
}) {
  return (
    <div className="space-y-1.5">
      <StatCard icon={icon} label={label} value={value} tone={tone} hint={hint} />
      <p className="px-1 text-[11px] leading-snug text-muted-foreground">{source}</p>
    </div>
  );
}

function Section({
  title,
  source,
  description,
  children,
}: {
  title: string;
  source: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b pb-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        <Badge variant="outline" className="shrink-0 font-mono text-[11px]">
          {source}
        </Badge>
      </div>
      {children}
    </section>
  );
}

export default function Metrics() {
  const m = store.getMarketplaceMetrics();

  const zones = [...m.liquidityByZone].sort((a, b) => b.total - a.total);
  const maxZoneTotal = Math.max(...zones.map((z) => z.total), 1);

  // Interpretación del NPS por color (verde ≥50, ámbar 0..49, rojo <0).
  const npsTone: "success" | "accent" | "destructive" | "muted" =
    m.nps === null ? "muted" : m.nps >= 50 ? "success" : m.nps >= 0 ? "accent" : "destructive";
  const npsText: Record<"success" | "accent" | "destructive" | "muted", string> = {
    success: "Excelente. Los promotores superan holgadamente a los detractores.",
    accent: "Aceptable. Hay más promotores que detractores, pero queda margen de mejora.",
    destructive: "Crítico. Predominan los detractores: revisar calidad y cumplimiento.",
    muted: "Todavía no hay encuestas respondidas para calcular el indicador.",
  };
  const npsColor: Record<"success" | "accent" | "destructive" | "muted", string> = {
    success: "text-success",
    accent: "text-accent",
    destructive: "text-destructive",
    muted: "text-muted-foreground",
  };
  // Clampeado: en los extremos (−100 / +100) el marcador quedaba medio cortado.
  const npsMarker = m.nps === null ? 50 : Math.min(98, Math.max(2, ((m.nps + 100) / 200) * 100));

  const totals: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Clientes", value: m.totals.clients, icon: Users },
    { label: "Trabajadores", value: m.totals.workers, icon: UserCheck },
    { label: "Solicitudes", value: m.totals.offers, icon: ClipboardList },
    { label: "Trabajos", value: m.totals.jobs, icon: Handshake },
    { label: "Completados", value: m.totals.completed, icon: CheckCircle2 },
    { label: "Cancelados", value: m.totals.cancelled, icon: Ban },
    { label: "Disputas", value: m.totals.disputes, icon: Scale },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Panel OFIX"
        subtitle="Salud del marketplace y KPIs del producto (demo interna)."
        action={
          <Badge variant="secondary" className="gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            Datos en vivo de la demo
          </Badge>
        }
      />

      {/* ─────────── Salud del marketplace (3.6.3) ─────────── */}
      <Section
        title="Salud del marketplace"
        source="Tesis 3.6.3"
        description="Los cuatro indicadores operativos que muestran si la plataforma efectivamente conecta oferta y demanda."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={Timer}
            label="Time to match"
            value={m.timeToMatchHours === null ? "—" : `${m.timeToMatchHours} h`}
            tone="primary"
            hint={m.timeToMatchHours === null ? "Sin solicitudes emparejadas" : "Promedio de todas las solicitudes"}
            source="3.6.3 · solicitud → primera oferta aceptada"
          />
          <Metric
            icon={CheckCircle2}
            label="Fill rate"
            value={`${m.fillRate}%`}
            tone="success"
            hint={`${m.totals.offers} solicitudes publicadas`}
            source="3.6.3 · solicitudes con al menos una oferta / solicitudes"
          />
          <Metric
            icon={Ban}
            label="Tasa de cancelación"
            value={`${m.cancelRate}%`}
            tone="accent"
            hint={`${m.totals.cancelled} de ${m.totals.jobs} trabajos`}
            source="3.6.3 · trabajos cancelados / trabajos totales"
          />
          <Metric
            icon={ShieldAlert}
            label="Tasa de disputas"
            value={`${m.disputeRate}%`}
            tone="muted"
            hint={`${m.totals.disputes} disputas abiertas o resueltas`}
            source="3.6.3 · disputas / trabajos cerrados (completados + cancelados)"
          />
        </div>
      </Section>

      {/* ─────────── Liquidez de oferta por zona ─────────── */}
      <Section
        title="Liquidez de oferta por zona"
        source="Tesis 3.6.3"
        description="Cuántos trabajadores hay registrados por zona y cuántos están disponibles en este momento."
      >
        {zones.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Sin trabajadores registrados"
            description="Cuando se sumen profesionales con zona de cobertura vas a ver acá la liquidez por barrio."
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zona</TableHead>
                    <TableHead className="w-[150px] text-right">Disponibles ahora</TableHead>
                    <TableHead className="w-[110px] text-right">Total</TableHead>
                    <TableHead className="w-[38%]">Proporción disponible</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((z) => {
                    const pct = z.total ? Math.round((z.availableNow / z.total) * 100) : 0;
                    const share = Math.round((z.total / maxZoneTotal) * 100);
                    return (
                      <TableRow key={z.zone}>
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                            {z.zone}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn("font-semibold", z.availableNow > 0 ? "text-success" : "text-muted-foreground")}>
                            {z.availableNow}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{z.total}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="h-2.5 min-w-[8px] overflow-hidden rounded-full bg-muted"
                              style={{ width: `${Math.max(share, 8)}%` }}
                            >
                              <div className="h-full rounded-full bg-success transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="shrink-0 text-xs text-muted-foreground">{pct}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        <p className="text-[11px] leading-snug text-muted-foreground">
          3.6.3 · liquidez de oferta = trabajadores con estado “disponible” sobre el total de la zona. El ancho de la barra
          es el peso de la zona sobre el total de trabajadores.
        </p>
      </Section>

      {/* ─────────── KPIs de producto (3.5) ─────────── */}
      <Section
        title="KPIs de producto"
        source="Tesis 3.5"
        description="Los indicadores de adopción, retención y eficacia del emparejamiento definidos en el plan."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Metric
            icon={TrendingUp}
            label="Conversión de clientes"
            value={`${m.clientConversion}%`}
            tone="primary"
            hint={`${m.totals.clients} clientes registrados`}
            source="3.5 · clientes que publicaron al menos una solicitud / clientes registrados"
          />
          <Metric
            icon={Repeat}
            label="Retención de usuarios"
            value={`${m.userRetention}%`}
            tone="success"
            hint="Clientes que vuelven a contratar"
            source="3.5 · clientes con más de un trabajo / clientes con trabajos"
          />
          <Metric
            icon={UserCheck}
            label="Retención de trabajadores"
            value={`${m.workerRetention}%`}
            tone="success"
            hint={`${m.totals.workers} trabajadores registrados`}
            source="3.5 · trabajadores con al menos un trabajo / trabajadores registrados"
          />
          <Metric
            icon={Gauge}
            label="Tasa de respuesta de trabajadores"
            value={`${m.workerResponseRate}%`}
            tone="accent"
            hint="Invitaciones contestadas dentro de la ventana"
            source="3.5 · invitaciones respondidas / invitaciones recibidas"
          />
          <Metric
            icon={Handshake}
            label="Éxito de emparejamiento"
            value={`${m.matchingSuccessRate}%`}
            tone="primary"
            hint={`${m.totals.completed} trabajos completados`}
            source="3.5 · trabajos completados / solicitudes publicadas"
          />
        </div>
      </Section>

      {/* ─────────── Negocio ─────────── */}
      <Section
        title="Negocio"
        source="Tesis 3.5"
        description="Monetización y satisfacción: lo que sostiene el modelo de comisión."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:content-start">
            <Metric
              icon={Receipt}
              label="Ticket promedio"
              value={money(m.avgTicket)}
              tone="primary"
              hint="Por servicio pagado"
              source="3.5 · GMV / cantidad de pagos"
            />
            <Metric
              icon={Coins}
              label="GMV"
              value={money(m.totals.gmv)}
              tone="accent"
              hint="Volumen transaccionado en la plataforma"
              source="3.5 · suma de los totales cobrados (incluye comisión y seguro)"
            />
            <Card className="sm:col-span-2">
              <CardContent className="flex items-start gap-3 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  La comisión de servicio de OFIX es del <span className="font-semibold text-foreground">15%</span> sobre el
                  monto del trabajo, cobrada al cliente y visible en cada desglose de precio (tesis 6.3). El GMV incluye
                  comisión, recargos de guardia y microseguro.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* NPS destacado */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Smile className="h-4 w-4 text-accent" />
                NPS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {m.nps === null ? (
                <>
                  <p className="text-4xl font-bold text-muted-foreground">—</p>
                  <p className="text-sm text-muted-foreground">Sin respuestas todavía.</p>
                </>
              ) : (
                <>
                  <div className="flex items-end gap-2">
                    <p className={cn("text-5xl font-bold leading-none tracking-tight", npsColor[npsTone])}>{m.nps}</p>
                    <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
                  </div>
                  <p className={cn("text-sm font-medium", npsColor[npsTone])}>{npsText[npsTone]}</p>
                  <div>
                    {/* El overflow-hidden va en el wrapper de los tramos, no en
                        el contenedor: si no, recorta el marcador, que es más
                        alto que la barra a propósito. */}
                    <div className="relative h-4 w-full">
                      <div className="absolute inset-x-0 top-1/2 flex h-2.5 -translate-y-1/2 overflow-hidden rounded-full">
                        <div className="h-full w-1/2 bg-destructive/25" />
                        <div className="h-full w-1/4 bg-accent/30" />
                        <div className="h-full w-1/4 bg-success/30" />
                      </div>
                      <div
                        className={cn(
                          "absolute top-1/2 h-4 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card",
                          npsTone === "success" ? "bg-success" : npsTone === "accent" ? "bg-accent" : "bg-destructive",
                        )}
                        style={{ left: `${npsMarker}%` }}
                      />
                    </div>
                    {/* Tres marcas: con justify-between caen en 0/50/100%, que
                        es donde realmente están. Con cuatro quedaban en
                        0/33/66/100 y el "+50" mentía sobre la escala. */}
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>−100</span>
                      <span>0</span>
                      <span>+100</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sobre <span className="font-semibold text-foreground">{m.npsResponses}</span>{" "}
                    {m.npsResponses === 1 ? "respuesta" : "respuestas"}.
                  </p>
                </>
              )}
              <p className="border-t pt-3 text-[11px] leading-snug text-muted-foreground">
                3.5 · % promotores (9-10) − % detractores (0-6). Verde ≥ 50, ámbar 0 a 49, rojo &lt; 0.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ─────────── Totales ─────────── */}
      <Section
        title="Totales"
        source="Volúmenes de apoyo"
        description="Los volúmenes sobre los que se calculan todos los indicadores de arriba."
      >
        <Card>
          <CardContent className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border p-0 sm:grid-cols-4 lg:grid-cols-7">
            {totals.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="flex flex-col gap-1 bg-card p-4">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{t.label}</span>
                  </span>
                  <span className="text-2xl font-bold leading-none">{t.value.toLocaleString("es-AR")}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <p className="text-[11px] leading-snug text-muted-foreground">
          Panel interno de demostración: todo se calcula en vivo sobre los datos de la sesión, sin backend. Las fórmulas de
          cada indicador están declaradas al lado de cada valor para poder auditarlas.
        </p>
      </Section>
    </div>
  );
}

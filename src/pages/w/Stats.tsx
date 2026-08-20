import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Crown,
  Gauge,
  Lightbulb,
  Percent,
  ShieldCheck,
  Snowflake,
  Star,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StatCard } from "@/components/ofix/StatCard";
import { LevelBadge } from "@/components/ofix/badges";
import { CategoryIcon } from "@/components/ofix/CategoryIcon";
import { EmptyState } from "@/components/ofix/EmptyState";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, LEVEL_THRESHOLDS, type WorkerLevel } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

type Tip = {
  icon: typeof Zap;
  tone: "primary" | "accent" | "success";
  title: string;
  body: string;
  action?: { label: string; to: string };
};

export default function WorkerStats() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stats = store.getWorkerStats(user!.id);
  const demand = store.getDemandInsights(user!.id);
  const jobsDone = user?.jobsDone || 0;

  const maxIncome = Math.max(...stats.months.map((m) => m.income), 1);

  // Progreso hacia el próximo nivel.
  const levels: WorkerLevel[] = ["bronze", "silver", "gold"];
  const currentIdx = levels.indexOf(stats.level);
  const nextLevel = currentIdx < levels.length - 1 ? levels[currentIdx + 1] : null;
  const currentThreshold = LEVEL_THRESHOLDS[stats.level];
  const nextThreshold = nextLevel ? LEVEL_THRESHOLDS[nextLevel] : currentThreshold;
  const progressPct = nextLevel
    ? Math.min(100, Math.round(((jobsDone - currentThreshold) / (nextThreshold - currentThreshold)) * 100))
    : 100;
  const remaining = nextLevel ? Math.max(0, nextThreshold - jobsDone) : 0;

  // Dónde conviene ofrecerse: ratio = solicitudes abiertas por trabajador de la categoría.
  const opportunities = [...demand].sort((a, b) => b.ratio - a.ratio);
  const best = opportunities[0];
  const maxRatio = Math.max(...opportunities.map((o) => o.ratio), 0.01);

  // Insights accionables "Cómo mejorar".
  const tips: Tip[] = [];
  if (stats.acceptanceRate < 60) {
    tips.push({
      icon: Zap,
      tone: "primary",
      title: "Subí tu tasa de aceptación",
      body: `Tu tasa es del ${stats.acceptanceRate}%. Respondé más rápido a las solicitudes y ajustá tus presupuestos para ganar más trabajos.`,
    });
  }
  if (stats.responseRate < 70) {
    tips.push({
      icon: Gauge,
      tone: "primary",
      title: "Contestá más invitaciones",
      body: `Respondés el ${stats.responseRate}% de las solicitudes que te llegan. Las urgencias se reasignan a otro profesional si nadie contesta dentro de la ventana, así que cada respuesta cuenta.`,
    });
  }
  if (best && best.openRequests > 0) {
    tips.push({
      icon: Target,
      tone: "accent",
      title: `Hay demanda en ${best.category}`,
      body: `${best.openRequests} solicitud${best.openRequests === 1 ? "" : "es"} abierta${best.openRequests === 1 ? "" : "s"} y ${best.competitors} profesional${best.competitors === 1 ? "" : "es"} compitiendo. Es donde tenés más chances hoy.`,
      action: { label: "Ver solicitudes", to: "/w/proposals" },
    });
  }
  if (nextLevel && remaining > 0) {
    tips.push({
      icon: TrendingUp,
      tone: "success",
      title: `Cerca del nivel ${LEVEL_LABELS[nextLevel]}`,
      body: `Te faltan ${remaining} trabajo${remaining === 1 ? "" : "s"} para alcanzar el nivel ${LEVEL_LABELS[nextLevel]} y ganar más visibilidad.`,
    });
  }
  if (stats.rating > 0 && stats.rating < 4.5) {
    tips.push({
      icon: Star,
      tone: "accent",
      title: "Cuidá la calidad",
      body: `Tu calificación es ${stats.rating.toFixed(1)}. Cumplí los plazos y comunicá bien con el cliente para subir tu reputación por encima de 4.5.`,
    });
  }
  if (!user?.premium) {
    tips.push({
      icon: Crown,
      tone: "accent",
      title: "Sumá visibilidad con Premium",
      body: "Con OFIX Premium aparecés primero en las búsquedas y recibís más solicitudes de clientes.",
      action: { label: "Ver Premium", to: "/w/premium" },
    });
  }
  if (tips.length === 0) {
    tips.push({
      icon: ShieldCheck,
      tone: "success",
      title: "¡Vas muy bien!",
      body: "Mantené tu ritmo de trabajo y tu calidad para conservar tu buena reputación en OFIX.",
    });
  }

  const toneClasses: Record<Tip["tone"], string> = {
    primary: "bg-primary-light text-primary",
    accent: "bg-accent-light text-accent",
    success: "bg-success-light text-success",
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Estadísticas" subtitle="Tu rendimiento en OFIX de un vistazo." />

      {/* Fondos congelados por reclamos abiertos */}
      {stats.wallet.frozen > 0 && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Snowflake className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-destructive">
                  {money(stats.wallet.frozen)} congelados por reclamos abiertos
                </p>
                <p className="text-sm text-muted-foreground">
                  Ese dinero queda retenido hasta que se resuelvan las disputas. Respondé el reclamo y subí fotos del
                  trabajo para acelerar la liberación.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" onClick={() => navigate("/w/cobros")}>
              Ver mis cobros
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Rendimiento general */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Trabajos completados" value={stats.totalJobs} tone="success" />
        <StatCard icon={Percent} label="Tasa de aceptación" value={`${stats.acceptanceRate}%`} tone="primary" hint={`${stats.proposalsSent} propuestas enviadas`} />
        <StatCard icon={Star} label="Calificación" value={stats.rating ? stats.rating.toFixed(1) : "—"} tone="accent" hint={`${stats.reviewCount} reseñas`} />
        <StatCard icon={Award} label="Nivel" value={LEVEL_LABELS[stats.level]} tone="muted" hint={`${jobsDone} trabajos`} />
      </div>

      {/* Plata y capacidad de respuesta */}
      <div className="space-y-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Wallet}
            label="Ingresos del mes"
            value={money(stats.monthIncome)}
            tone="success"
            hint="Trabajos completados este mes"
          />
          <StatCard
            icon={Gauge}
            label="Tasa de respuesta"
            value={`${stats.responseRate}%`}
            tone="primary"
            hint="Invitaciones que contestás"
          />
          <StatCard
            icon={Clock}
            label="Tiempo de respuesta"
            value={stats.avgResponseMinutes === null ? "—" : `${stats.avgResponseMinutes} min`}
            tone="accent"
            hint="Promedio hasta tu respuesta"
          />
          <StatCard
            icon={TrendingUp}
            label="Disponible para retirar"
            value={money(stats.wallet.available)}
            tone="muted"
            hint={`${money(stats.wallet.totalEarned)} ganados en total`}
          />
        </div>
        <p className="px-1 text-xs text-muted-foreground">
          {stats.avgResponseMinutes === null
            ? "Todavía no registramos respuestas tuyas a invitaciones. Contestar rápido mejora tu posición en las búsquedas."
            : `Respondés en promedio en ${stats.avgResponseMinutes} min. `}
          Los clientes ven tu velocidad de respuesta antes de elegirte.
        </p>
      </div>

      {/* Ingresos últimos 6 meses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ingresos de los últimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 sm:gap-4" style={{ height: 220 }}>
            {stats.months.map((m, i) => {
              const heightPct = Math.round((m.income / maxIncome) * 100);
              const isCurrent = i === stats.months.length - 1;
              return (
                <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-medium text-muted-foreground">{m.income > 0 ? money(m.income) : ""}</span>
                  <div
                    className={cn("w-full max-w-[48px] rounded-t-md transition-all", isCurrent ? "bg-primary" : "bg-primary/60")}
                    style={{ height: `${Math.max(heightPct, m.income > 0 ? 4 : 2)}%` }}
                    title={`${m.label}: ${money(m.income)}`}
                  />
                  <span className={cn("text-xs", isCurrent ? "font-semibold text-foreground" : "text-muted-foreground")}>{m.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dónde conviene ofrecerse */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-primary" />
            Dónde conviene ofrecerse
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Solicitudes abiertas por cada profesional de tu rubro. Cuanto más alto el ratio, menos competencia tenés.
          </p>
        </CardHeader>
        <CardContent className={opportunities.length === 0 ? "" : "p-0"}>
          {opportunities.length === 0 ? (
            <EmptyState
              icon={Target}
              title="Sin datos de demanda"
              description="Cargá tus oficios en el perfil para ver dónde hay más solicitudes abiertas que profesionales disponibles."
              action={
                <Button variant="outline" size="sm" onClick={() => navigate("/w/profile")}>
                  Editar mis oficios
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rubro</TableHead>
                  <TableHead className="text-right">Solicitudes</TableHead>
                  <TableHead className="text-right">Competidores</TableHead>
                  <TableHead className="w-[26%]">Ratio</TableHead>
                  <TableHead className="text-right">Presupuesto prom.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((o, i) => (
                  <TableRow key={o.category} className={i === 0 ? "bg-primary-light/60 hover:bg-primary-light/60" : undefined}>
                    <TableCell className="font-medium">
                      <span className="flex flex-wrap items-center gap-2">
                        <CategoryIcon category={o.category} className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {o.category}
                        {i === 0 && (
                          <Badge variant="default" className="gap-1">
                            <Zap className="h-3 w-3" />
                            Oportunidad
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn("font-semibold", o.openRequests > 0 ? "text-foreground" : "text-muted-foreground")}>
                        {o.openRequests}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{o.competitors}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full min-w-[40px] overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn("h-full rounded-full", i === 0 ? "bg-primary" : "bg-primary/50")}
                            style={{ width: `${Math.max(Math.round((o.ratio / maxRatio) * 100), o.ratio > 0 ? 6 : 0)}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-xs font-medium tabular-nums">{o.ratio.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {o.avgBudget > 0 ? money(o.avgBudget) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {opportunities.length > 0 && (
          <CardContent className="pt-4">
            <div className="flex items-start gap-3 rounded-lg border border-dashed p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm text-muted-foreground">
                {best && best.openRequests > 0 ? (
                  <>
                    Hoy conviene <span className="font-semibold text-foreground">{best.category}</span>:{" "}
                    {best.openRequests} solicitud{best.openRequests === 1 ? "" : "es"} abierta
                    {best.openRequests === 1 ? "" : "s"} entre {best.competitors} profesional
                    {best.competitors === 1 ? "" : "es"}
                    {best.avgBudget > 0 ? `, con un presupuesto promedio de ${money(best.avgBudget)}` : ""}.
                  </>
                ) : (
                  "No hay solicitudes abiertas en tus rubros en este momento. Ampliá tus oficios o activá la guardia para captar urgencias."
                )}
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Progreso de nivel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            Progreso de nivel
            <LevelBadge level={stats.level} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {nextLevel ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {jobsDone} de {nextThreshold} trabajos para {LEVEL_LABELS[nextLevel]}
                </span>
                <span className="font-semibold">{progressPct}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-sm text-muted-foreground">
                Te faltan <span className="font-semibold text-foreground">{remaining}</span> trabajo{remaining === 1 ? "" : "s"} para alcanzar el nivel {LEVEL_LABELS[nextLevel]}.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">¡Alcanzaste el nivel máximo {LEVEL_LABELS[stats.level]}! Seguí así.</p>
          )}

          <div className="grid grid-cols-3 gap-3 pt-2">
            {levels.map((lv) => (
              <div key={lv} className={`rounded-lg border p-3 text-center ${lv === stats.level ? "border-primary bg-primary-light" : ""}`}>
                <p className="text-sm font-semibold">{LEVEL_LABELS[lv]}</p>
                <p className="text-xs text-muted-foreground">{LEVEL_THRESHOLDS[lv]}+ trabajos</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cómo mejorar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-accent" />
            Cómo mejorar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneClasses[tip.tone]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{tip.title}</p>
                  <p className="text-sm text-muted-foreground">{tip.body}</p>
                  {tip.action && (
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate(tip.action!.to)}>
                      {tip.action.label}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

import { CheckCircle2, Percent, Star, Award, Lightbulb, Zap, TrendingUp, Crown, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StatCard } from "@/components/ofix/StatCard";
import { LevelBadge } from "@/components/ofix/badges";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { LEVEL_LABELS, LEVEL_THRESHOLDS, type WorkerLevel } from "@/lib/types";

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Trabajos completados" value={stats.totalJobs} tone="success" />
        <StatCard icon={Percent} label="Tasa de aceptación" value={`${stats.acceptanceRate}%`} tone="primary" hint={`${stats.proposalsSent} propuestas enviadas`} />
        <StatCard icon={Star} label="Calificación" value={stats.rating ? stats.rating.toFixed(1) : "—"} tone="accent" hint={`${stats.reviewCount} reseñas`} />
        <StatCard icon={Award} label="Nivel" value={LEVEL_LABELS[stats.level]} tone="muted" hint={`${jobsDone} trabajos`} />
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
              return (
                <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-medium text-muted-foreground">{m.income > 0 ? `$${m.income.toLocaleString()}` : ""}</span>
                  <div
                    className="w-full max-w-[48px] rounded-t-md bg-primary transition-all"
                    style={{ height: `${Math.max(heightPct, m.income > 0 ? 4 : 2)}%` }}
                    title={`${m.label}: $${m.income.toLocaleString()}`}
                  />
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
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

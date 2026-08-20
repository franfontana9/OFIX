import { ShieldCheck, Zap, CalendarClock, CalendarDays, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  JOB_STATUS_LABELS,
  LEVEL_LABELS,
  OFFER_STATUS_LABELS,
  PROPOSAL_STATUS_LABELS,
  URGENCY_LABELS,
  type JobStatus,
  type OfferStatus,
  type ProposalStatus,
  type Urgency,
  type WorkerLevel,
} from "@/lib/types";

// ── Urgencia ──
export function UrgencyBadge({ urgency, className }: { urgency: Urgency; className?: string }) {
  const map: Record<Urgency, { variant: "destructive" | "accent" | "secondary"; icon: typeof Zap }> = {
    inmediata: { variant: "destructive", icon: Zap },
    en_el_dia: { variant: "accent", icon: CalendarClock },
    programada: { variant: "secondary", icon: CalendarDays },
  };
  const { variant, icon: Icon } = map[urgency] || map.programada;
  return (
    <Badge variant={variant} className={cn("gap-1", className)}>
      <Icon className="h-3 w-3" />
      {URGENCY_LABELS[urgency] || urgency}
    </Badge>
  );
}

// ── Verificación / Seguro y vigencia ──
export function VerificationBadge({ verified, className }: { verified?: boolean; className?: string }) {
  if (!verified)
    return (
      <Badge variant="secondary" className={cn("gap-1", className)}>
        Sin verificar
      </Badge>
    );
  return (
    <Badge variant="success" className={cn("gap-1", className)}>
      <ShieldCheck className="h-3 w-3" />
      Verificado
    </Badge>
  );
}

// ── Nivel Bronze / Silver / Gold ──
const LEVEL_STYLES: Record<WorkerLevel, string> = {
  bronze: "bg-amber-700/10 text-amber-700 border-amber-700/20",
  silver: "bg-slate-400/10 text-slate-500 border-slate-400/20",
  gold: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
};
export function LevelBadge({ level, className }: { level: WorkerLevel; className?: string }) {
  return (
    <Badge variant="outline" className={cn("gap-1", LEVEL_STYLES[level], className)}>
      <Award className="h-3 w-3" />
      {LEVEL_LABELS[level]}
    </Badge>
  );
}

// ── Estado de solicitud ──
type BadgeVariant = "default" | "success" | "secondary" | "destructive" | "accent";
export function OfferStatusBadge({ status, className }: { status: OfferStatus; className?: string }) {
  const variant: Record<OfferStatus, BadgeVariant> = {
    abierta: "default",
    asignada: "accent",
    completada: "success",
    cancelada: "destructive",
  };
  return (
    <Badge variant={variant[status]} className={className}>
      {OFFER_STATUS_LABELS[status]}
    </Badge>
  );
}

// ── Estado de propuesta ──
export function ProposalStatusBadge({ status, className }: { status: ProposalStatus; className?: string }) {
  const variant: Record<ProposalStatus, "default" | "success" | "secondary" | "destructive"> = {
    enviada: "default",
    aceptada: "success",
    rechazada: "destructive",
    finalizada: "secondary",
  };
  return (
    <Badge variant={variant[status]} className={className}>
      {PROPOSAL_STATUS_LABELS[status]}
    </Badge>
  );
}

// ── Estado de trabajo / acuerdo ──
export function JobStatusBadge({ status, className }: { status: JobStatus; className?: string }) {
  const variant: Record<JobStatus, BadgeVariant> = {
    agendado: "accent",
    en_progreso: "default",
    completado: "success",
    cancelado: "destructive",
  };
  return (
    <Badge variant={variant[status]} className={className}>
      {JOB_STATUS_LABELS[status]}
    </Badge>
  );
}

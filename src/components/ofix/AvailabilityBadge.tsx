import { Circle, Clock, Wrench } from "lucide-react";
import { AVAILABILITY_LABELS, type AvailabilityStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONES: Record<AvailabilityStatus, string> = {
  disponible: "bg-success-light text-success",
  ocupado: "bg-accent-light text-accent",
  fuera_de_horario: "bg-muted text-muted-foreground",
};

const ICONS: Record<AvailabilityStatus, typeof Circle> = {
  disponible: Circle,
  ocupado: Wrench,
  fuera_de_horario: Clock,
};

// Estado de disponibilidad del profesional. Responde al dolor #1 de la
// investigación: saber quién puede ir AHORA (4 de las 8 entrevistas).
export function AvailabilityBadge({
  status,
  className,
  showLabel = true,
}: {
  status: AvailabilityStatus;
  className?: string;
  showLabel?: boolean;
}) {
  const Icon = ICONS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONES[status],
        className,
      )}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {status === "disponible" && (
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-success opacity-75" />
        )}
        <Icon className={cn("h-2 w-2", status === "disponible" ? "fill-current" : "h-3 w-3")} />
      </span>
      {showLabel && AVAILABILITY_LABELS[status]}
    </span>
  );
}

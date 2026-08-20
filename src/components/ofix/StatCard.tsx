import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: "primary" | "accent" | "success" | "muted";
  hint?: string;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary-light text-primary",
    accent: "bg-accent-light text-accent",
    success: "bg-success-light text-success",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", tones[tone])}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-2xl font-bold leading-tight">{value}</p>
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          {hint && <p className="truncate text-xs text-muted-foreground/80">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

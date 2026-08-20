import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Estado vacío accionable estándar: ícono, título, ayuda y una acción principal.
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
          <Icon className="h-8 w-8" />
        </div>
        <p className="text-lg font-semibold">{title}</p>
        {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
        {action && <div className="mt-1">{action}</div>}
      </CardContent>
    </Card>
  );
}

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Encabezado de página estándar dentro del AppLayout.
export function PageHeader({
  title,
  subtitle,
  back,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: React.ReactNode;
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <div className={cn("mb-6", className)}>
      {back && (
        <Button variant="ghost" size="sm" className="mb-2 -ml-2 gap-2 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}

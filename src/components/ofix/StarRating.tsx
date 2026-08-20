import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Muestra u permite editar una calificación de 1 a 5 estrellas.
export function StarRating({
  value,
  onChange,
  size = 16,
  className,
  showValue = false,
  count,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  className?: string;
  showValue?: boolean;
  count?: number;
}) {
  const editable = !!onChange;
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="inline-flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            disabled={!editable}
            onClick={() => onChange?.(i)}
            className={cn(editable && "cursor-pointer transition-transform hover:scale-110", !editable && "cursor-default")}
            aria-label={`${i} estrellas`}
          >
            <Star
              style={{ width: size, height: size }}
              className={cn(i <= Math.round(value) ? "fill-accent text-accent" : "fill-none text-muted-foreground/40")}
            />
          </button>
        ))}
      </div>
      {showValue && <span className="text-sm font-semibold">{value.toFixed(1)}</span>}
      {typeof count === "number" && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  );
}

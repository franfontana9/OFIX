import {
  Wrench,
  Zap,
  Flame,
  KeyRound,
  PaintRoller,
  Cog,
  AirVent,
  Sparkles,
  Sprout,
  Hammer,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Plomería: Wrench,
  Electricidad: Zap,
  Gas: Flame,
  Cerrajería: KeyRound,
  Pintura: PaintRoller,
  Mantenimiento: Cog,
  "Aire acondicionado": AirVent,
  Limpieza: Sparkles,
  Jardinería: Sprout,
  Carpintería: Hammer,
};

export function categoryIcon(category: string): LucideIcon {
  return ICONS[category] || Wrench;
}

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = categoryIcon(category);
  return <Icon className={cn("h-5 w-5", className)} />;
}

// Tile de categoría (para el home y buscador).
export function CategoryTile({
  category,
  onClick,
  active,
}: {
  category: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const Icon = categoryIcon(category);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-w-[92px] flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all hover:border-primary hover:shadow-md",
        active ? "border-primary bg-primary-light" : "border-border bg-card",
      )}
    >
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-full", active ? "bg-primary text-primary-foreground" : "bg-primary-light text-primary")}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium leading-tight">{category}</span>
    </button>
  );
}

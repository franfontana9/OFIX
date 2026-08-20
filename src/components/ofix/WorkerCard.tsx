import { useState } from "react";
import { MapPin, Navigation, Heart, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "./UserAvatar";
import { StarRating } from "./StarRating";
import { VerificationBadge, LevelBadge } from "./badges";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { trustScore } from "@/lib/trust";
import type { PublicUser } from "@/lib/types";

export function WorkerCard({
  worker,
  distance,
  onClick,
  compact,
  showFavorite = true,
}: {
  worker: PublicUser;
  distance?: number | null;
  onClick?: () => void;
  compact?: boolean;
  showFavorite?: boolean;
}) {
  const { user } = useAuth();
  const canFav = showFavorite && user?.role === "user";
  const [fav, setFav] = useState(() => (canFav ? store.isFavorite(user!.id, worker.id) : false));
  const [pop, setPop] = useState(false);
  const score = trustScore(worker);

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = store.toggleFavorite(worker.id);
    setFav(now);
    if (now) setPop(true);
    toast.success(now ? "Agregado a favoritos" : "Quitado de favoritos");
  };

  return (
    <Card
      onClick={onClick}
      className={onClick ? "glow-hover cursor-pointer" : undefined}
    >
      <CardContent className={cn("relative", compact ? "p-3" : "p-4")}>
        {canFav && (
          <button
            onClick={toggleFav}
            aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
            className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <Heart
              onAnimationEnd={() => setPop(false)}
              className={cn("h-5 w-5 transition-colors", fav && "fill-destructive text-destructive", pop && "animate-pop")}
            />
          </button>
        )}
        <div className="flex items-start gap-3">
          <UserAvatar name={worker.name} photo={worker.photo} className={compact ? "h-11 w-11" : "h-14 w-14"} />
          <div className="min-w-0 flex-1 pr-6">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{worker.name}</h3>
              {worker.premium && <span className="text-xs font-medium text-accent">★ Destacado</span>}
            </div>
            <p className="truncate text-sm text-muted-foreground">{worker.trade}</p>
            <div className="mt-1 flex items-center gap-2">
              <StarRating value={worker.rating || 0} size={14} showValue count={worker.reviewCount} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <VerificationBadge verified={worker.verified} />
              {worker.level && <LevelBadge level={worker.level} />}
            </div>
            {!compact && (
              <>
                {/* Barra de confianza */}
                <div className="mt-2.5 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-success" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-success" style={{ width: `${score}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-success">{score}%</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {worker.coverageZone && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {worker.coverageZone}
                    </span>
                  )}
                  {typeof distance === "number" && (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Navigation className="h-3 w-3" />
                      a {distance} km
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
          {typeof worker.hourlyRate === "number" && worker.hourlyRate > 0 && (
            <div className="shrink-0 text-right">
              <p className="font-bold">${worker.hourlyRate.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">por hora</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

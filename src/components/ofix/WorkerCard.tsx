import { useState } from "react";
import { MapPin, Navigation, Heart, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ClickableCard } from "@/components/ofix/ClickableCard";
import { UserAvatar } from "./UserAvatar";
import { StarRating } from "./StarRating";
import { VerificationBadge, LevelBadge } from "./badges";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { run } from "@/lib/run";
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
    const now = run(() => store.toggleFavorite(worker.id));
    // `false` es un resultado valido (se quito de favoritos); solo `undefined` es error.
    if (now === undefined) return;
    setFav(now);
    if (now) setPop(true);
    toast.success(now ? "Agregado a favoritos" : "Quitado de favoritos");
  };

  const content = (
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start gap-3">
          <UserAvatar name={worker.name} photo={worker.photo} className={compact ? "h-11 w-11" : "h-14 w-14"} />
          <div className="min-w-0 flex-1">
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
                {/* Barra de confianza. Lleva etiqueta: un "99%" suelto al lado
                    de un escudo no dice qué se está midiendo. */}
                <div className="mt-2.5" title="Combina verificación, reseñas y trabajos completados">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-success" />
                      Confianza
                    </span>
                    <span className="text-xs font-semibold text-success">{score}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-success transition-all" style={{ width: `${score}%` }} />
                  </div>
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
          {/* Columna derecha: favorito arriba, precio abajo. Van apilados en la
              misma columna porque antes el corazón iba en absolute y el precio
              le quedaba justo debajo, superponiéndose. */}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {canFav && (
              <button
                onClick={toggleFav}
                aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
                className="-mr-1 -mt-1 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
              >
                <Heart
                  onAnimationEnd={() => setPop(false)}
                  className={cn("h-5 w-5 transition-colors", fav && "fill-destructive text-destructive", pop && "animate-pop")}
                />
              </button>
            )}
            {typeof worker.hourlyRate === "number" && worker.hourlyRate > 0 && (
              <div className="text-right">
                <p className="whitespace-nowrap font-bold leading-tight">
                  ${worker.hourlyRate.toLocaleString("es-AR")}
                </p>
                <p className="text-xs text-muted-foreground">por hora</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
  );

  // `onClick` es opcional: sin él la card es solo informativa y no tiene que
  // anunciarse como accionable ni recibir foco. Con él va en ClickableCard para
  // ser alcanzable con teclado — es la card principal de búsqueda, home y mapa.
  if (!onClick) return <Card>{content}</Card>;
  return (
    <ClickableCard onClick={onClick} label={`Ver perfil de ${worker.name}`}>
      {content}
    </ClickableCard>
  );
}

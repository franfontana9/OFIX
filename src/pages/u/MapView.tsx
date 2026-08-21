import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { RealMap, type MapPoint } from "@/components/ofix/RealMap";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { AvailabilityBadge } from "@/components/ofix/AvailabilityBadge";
import { VerificationBadge } from "@/components/ofix/badges";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { AVAILABILITY_LABELS, CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

/**
 * Mapa de profesionales cercanos. Es la cara visible de la geolocalización:
 * cada pin es un profesional, el color dice si puede ir ahora, y al tocarlo
 * se abre quién es, con qué calificación y a qué distancia.
 */
export default function UserMapView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState<string | null>(null);
  const [onlyNow, setOnlyNow] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const myGeo = user?.geo;

  // Solo los que tienen coordenadas pueden ir al mapa.
  const workers = useMemo(() => {
    const list = store.getWorkers({
      category: category || undefined,
      onlyAvailableNow: onlyNow || undefined,
    });
    return list
      .filter((w) => w.geo)
      .map((w) => ({
        worker: w,
        distance: store.distanceKm(myGeo, w.geo),
        availability: store.getAvailabilityStatus(w.id),
      }))
      .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  }, [category, onlyNow, myGeo]);

  const points: MapPoint[] = workers.map(({ worker, distance, availability }) => ({
    id: worker.id,
    name: worker.name,
    lat: worker.geo!.lat,
    lng: worker.geo!.lng,
    subtitle: worker.trade,
    distance,
    rating: worker.rating,
    reviewCount: worker.reviewCount,
    price: worker.hourlyRate,
    verified: worker.verified,
    photo: worker.photo,
    availability,
    availabilityLabel: AVAILABILITY_LABELS[availability],
  }));

  const availableNow = workers.filter((w) => w.availability === "disponible").length;
  const selectedEntry = workers.find((w) => w.worker.id === selected);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Profesionales cerca tuyo"
        subtitle="Tocá un punto del mapa para ver quién es, su calificación y a qué distancia está."
      />

      {/* Resumen + leyenda de colores */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm">
            <span className="font-semibold">{workers.length}</span> profesionales en el mapa
            {availableNow > 0 && (
              <>
                {" · "}
                <span className="font-semibold text-success">{availableNow} disponibles ahora</span>
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Legend color="bg-success" label="Disponible ahora" />
            <Legend color="bg-accent" label="En un trabajo" />
            <Legend color="bg-muted-foreground/50" label="Fuera de horario" />
            {myGeo && <Legend color="bg-accent" label="Tu ubicación" ring />}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={!category} onClick={() => setCategory(null)}>
            Todos los oficios
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Chip active={onlyNow} tone="success" onClick={() => setOnlyNow((v) => !v)}>
            Solo disponibles ahora
          </Chip>
        </div>
      </div>

      {/* Mapa */}
      {points.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold">No hay profesionales con estos filtros</p>
              <p className="text-sm text-muted-foreground">Probá con otro oficio o sacá el filtro de disponibilidad.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <RealMap
          points={points}
          center={myGeo}
          onSelect={(id) => setSelected(id)}
          className="h-[420px] sm:h-[520px]"
        />
      )}

      {/* Ficha del seleccionado */}
      {selectedEntry && (
        <Card className="border-primary/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <UserAvatar
                name={selectedEntry.worker.name}
                photo={selectedEntry.worker.photo}
                className="h-14 w-14 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{selectedEntry.worker.name}</h3>
                  <VerificationBadge verified={selectedEntry.worker.verified} />
                  <AvailabilityBadge status={selectedEntry.availability} />
                </div>
                <p className="text-sm text-muted-foreground">{selectedEntry.worker.trade}</p>
                <StarRating
                  value={selectedEntry.worker.rating || 0}
                  size={14}
                  showValue
                  count={selectedEntry.worker.reviewCount}
                  className="mt-1"
                />
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {selectedEntry.distance !== null && (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Navigation className="h-3 w-3" />a {selectedEntry.distance} km
                    </span>
                  )}
                  {selectedEntry.worker.coverageZone && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedEntry.worker.coverageZone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Cerrar"
                  className="-mr-1 -mt-1 rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
                {!!selectedEntry.worker.hourlyRate && (
                  <p className="whitespace-nowrap text-sm font-bold">{money(selectedEntry.worker.hourlyRate)}</p>
                )}
              </div>
            </div>
            <Button className="mt-3 w-full" onClick={() => navigate(`/u/workers/${selectedEntry.worker.id}`)}>
              Ver perfil y contratar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lista ordenada por cercanía */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Más cercanos</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {workers.slice(0, 8).map(({ worker, distance, availability }) => (
            <Card
              key={worker.id}
              className={cn("glow-hover cursor-pointer", selected === worker.id && "border-primary")}
              onClick={() => setSelected(worker.id)}
            >
              <CardContent className="flex items-center gap-3 p-3">
                <UserAvatar name={worker.name} photo={worker.photo} className="h-11 w-11 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{worker.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{worker.trade}</p>
                  <AvailabilityBadge status={availability} className="mt-1" />
                </div>
                <div className="shrink-0 text-right">
                  {distance !== null && <p className="text-xs font-semibold text-primary">a {distance} km</p>}
                  <StarRating value={worker.rating || 0} size={12} showValue />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function Legend({ color, label, ring }: { color: string; label: string; ring?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2.5 w-2.5 rounded-full", color, ring && "ring-2 ring-accent/30")} />
      {label}
    </span>
  );
}

function Chip({
  children,
  active,
  onClick,
  tone = "primary",
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  tone?: "primary" | "success";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? tone === "success"
            ? "border-success bg-success text-success-foreground"
            : "border-primary bg-primary text-primary-foreground"
          : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

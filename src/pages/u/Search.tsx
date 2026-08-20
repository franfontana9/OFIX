import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, MapPin, List, Map as MapIcon, X, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PageHeader } from "@/components/ofix/PageHeader";
import { WorkerCard } from "@/components/ofix/WorkerCard";
import { RealMap, type MapPoint } from "@/components/ofix/RealMap";
import { SkeletonList } from "@/components/ofix/Skeleton";
import { EmptyState } from "@/components/ofix/EmptyState";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";

const ALL = "__all__";
type Sort = "rating" | "distance" | "price";

const SORT_LABELS: Record<Sort, string> = {
  rating: "Mejor calificados",
  distance: "Más cerca",
  price: "Más baratos",
};

const RATING_OPTIONS = [
  { value: ALL, label: "Cualquiera" },
  { value: "4.5", label: "4.5+" },
  { value: "4", label: "4+" },
  { value: "3", label: "3+" },
];

export default function UserSearch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const initialCat = params.get("cat") || "";

  const [q, setQ] = useState("");
  const [zone, setZone] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const [category, setCategory] = useState<string>(
    initialCat && (CATEGORIES as readonly string[]).includes(initialCat) ? initialCat : ALL,
  );
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minRating, setMinRating] = useState<string>(ALL);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState<Sort>("rating");
  const [loading, setLoading] = useState(false);

  const { results, distanceById } = useMemo(() => {
    // Mapa de distancias por trabajador (para orden "más cerca" y para mostrarlas).
    const distMap: Record<string, number> = {};
    store
      .getNearbyWorkers(user?.geo, { category: category === ALL ? undefined : category })
      .forEach(({ worker, distance }) => {
        if (typeof distance === "number") distMap[worker.id] = distance;
      });

    let list = store.getWorkers({
      category: category === ALL ? undefined : category,
      zone: zone.trim() || undefined,
      q: q.trim() || undefined,
    });

    const min = priceMin.trim() ? Number(priceMin) : undefined;
    const max = priceMax.trim() ? Number(priceMax) : undefined;
    const minR = minRating === ALL ? undefined : Number(minRating);

    list = list.filter((w) => {
      const rate = w.hourlyRate ?? 0;
      if (min !== undefined && !Number.isNaN(min) && rate < min) return false;
      if (max !== undefined && !Number.isNaN(max) && rate > max) return false;
      if (minR !== undefined && (w.rating ?? 0) < minR) return false;
      if (onlyVerified && !w.verified) return false;
      if (onlyAvailable && !w.available) return false;
      return true;
    });

    const sorted = [...list].sort((a, b) => {
      if (sort === "price") return (a.hourlyRate ?? Infinity) - (b.hourlyRate ?? Infinity);
      if (sort === "distance") return (distMap[a.id] ?? Infinity) - (distMap[b.id] ?? Infinity);
      return (b.rating ?? 0) - (a.rating ?? 0);
    });

    return { results: sorted, distanceById: distMap };
  }, [category, zone, q, priceMin, priceMax, minRating, onlyVerified, onlyAvailable, sort, user?.geo]);

  // Sensación de carga al cambiar cualquier filtro.
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [category, zone, q, priceMin, priceMax, minRating, onlyVerified, onlyAvailable, sort]);

  const mapPoints: MapPoint[] = results
    .filter((w) => w.geo)
    .map((w) => ({
      id: w.id,
      name: w.name,
      lat: w.geo!.lat,
      lng: w.geo!.lng,
      subtitle: w.trade,
      distance: distanceById[w.id] ?? null,
      rating: w.rating,
      reviewCount: w.reviewCount,
      price: w.hourlyRate,
      verified: w.verified,
      photo: w.photo,
    }));

  const limpiar = () => {
    setQ("");
    setZone("");
    setCategory(ALL);
    setPriceMin("");
    setPriceMax("");
    setMinRating(ALL);
    setOnlyVerified(false);
    setOnlyAvailable(false);
    setSort("rating");
  };

  // Chips de filtros activos.
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (q.trim()) chips.push({ key: "q", label: `“${q.trim()}”`, clear: () => setQ("") });
  if (category !== ALL) chips.push({ key: "cat", label: category, clear: () => setCategory(ALL) });
  if (zone.trim()) chips.push({ key: "zone", label: zone.trim(), clear: () => setZone("") });
  if (priceMin.trim()) chips.push({ key: "pmin", label: `Desde $${Number(priceMin).toLocaleString()}/h`, clear: () => setPriceMin("") });
  if (priceMax.trim()) chips.push({ key: "pmax", label: `Hasta $${Number(priceMax).toLocaleString()}/h`, clear: () => setPriceMax("") });
  if (minRating !== ALL) chips.push({ key: "rating", label: `${minRating}+ estrellas`, clear: () => setMinRating(ALL) });
  if (onlyVerified) chips.push({ key: "verified", label: "Verificados", clear: () => setOnlyVerified(false) });
  if (onlyAvailable) chips.push({ key: "available", label: "Disponibles ahora", clear: () => setOnlyAvailable(false) });

  return (
    <div className="space-y-6">
      <PageHeader title="Buscar profesionales" subtitle="Encontrá al trabajador verificado que necesitás por oficio y zona" />

      {/* Filtros */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="q">Búsqueda</Label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="q" className="pl-9" placeholder="Nombre u oficio..." value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone">Zona</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="zone" className="pl-9" placeholder="Ej: Palermo, CABA" value={zone} onChange={(e) => setZone(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Filtros avanzados */}
          <div className="border-t pt-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros avanzados
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Tarifa por hora</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Mín"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    aria-label="Tarifa mínima por hora"
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Máx"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    aria-label="Tarifa máxima por hora"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minRating">Rating mínimo</Label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger id="minRating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RATING_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort">Ordenar por</Label>
                <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                  <SelectTrigger id="sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
                      <SelectItem key={s} value={s}>{SORT_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                />
                Solo verificados
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                Disponibles ahora
              </label>
            </div>
          </div>

          {/* Chips de filtros activos */}
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t pt-4">
              {chips.map((c) => (
                <Badge key={c.key} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1">
                  {c.label}
                  <button
                    type="button"
                    onClick={c.clear}
                    aria-label={`Quitar filtro ${c.label}`}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-background/60"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={limpiar}>
                Limpiar todo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Resultados</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "profesional" : "profesionales"}
          </span>
          <div className="inline-flex overflow-hidden rounded-lg border">
            <Button
              type="button"
              size="sm"
              variant={view === "list" ? "default" : "ghost"}
              className="gap-1.5 rounded-none"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === "map" ? "default" : "ghost"}
              className="gap-1.5 rounded-none"
              onClick={() => setView("map")}
            >
              <MapIcon className="h-4 w-4" />
              Mapa
            </Button>
          </div>
        </div>
      </div>

      {view === "map" ? (
        <RealMap
          points={mapPoints}
          center={user?.geo}
          onSelect={(id) => navigate(`/u/workers/${id}`)}
          className="h-[460px]"
        />
      ) : loading ? (
        <SkeletonList count={4} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No encontramos profesionales"
          description="Probá ajustando los filtros."
          action={
            <Button variant="outline" onClick={limpiar}>
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((w) => (
            <WorkerCard
              key={w.id}
              worker={w}
              distance={distanceById[w.id]}
              onClick={() => navigate(`/u/workers/${w.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

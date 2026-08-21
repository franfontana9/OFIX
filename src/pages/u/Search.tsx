import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search as SearchIcon,
  MapPin,
  List,
  Map as MapIcon,
  X,
  SlidersHorizontal,
  ChevronDown,
  Zap,
  BadgeCheck,
  ShieldCheck,
  CalendarClock,
  Layers,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PageHeader } from "@/components/ofix/PageHeader";
import { WorkerCard } from "@/components/ofix/WorkerCard";
import { AvailabilityBadge } from "@/components/ofix/AvailabilityBadge";
import { RealMap, type MapPoint } from "@/components/ofix/RealMap";
import { SkeletonList } from "@/components/ofix/Skeleton";
import { EmptyState } from "@/components/ofix/EmptyState";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CATEGORIES, COMPLEXITY_LABELS, type Complexity } from "@/lib/types";

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

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

// Chip toggleable: los filtros que salieron de la investigación se manejan acá,
// a un click de distancia y siempre visibles (no escondidos en un panel).
function FilterChip({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

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
  const [complexity, setComplexity] = useState<Complexity | typeof ALL>(ALL);
  const [onlyVerified, setOnlyVerified] = useState(false);
  // "Ver quiénes" del home entra con ?ahora=1 y espera el filtro ya aplicado.
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(params.get("ahora") === "1");
  const [onlyLicensed, setOnlyLicensed] = useState(false);
  const [onCallOnly, setOnCallOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("rating");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  const cat = category === ALL ? undefined : category;
  const zoneQuery = zone.trim() || undefined;

  const { results, distanceById } = useMemo(() => {
    // Mapa de distancias por trabajador (para orden "más cerca" y para mostrarlas).
    const distMap: Record<string, number> = {};
    store.getNearbyWorkers(user?.geo, { category: cat }).forEach(({ worker, distance }) => {
      if (typeof distance === "number") distMap[worker.id] = distance;
    });

    const max = priceMax.trim() ? Number(priceMax) : undefined;
    const minR = minRating === ALL ? undefined : Number(minRating);

    let list = store.getWorkers({
      category: cat,
      zone: zoneQuery,
      q: q.trim() || undefined,
      onlyAvailableNow: onlyAvailableNow || undefined,
      onlyLicensed: onlyLicensed || undefined,
      onlyVerified: onlyVerified || undefined,
      onCallOnly: onCallOnly || undefined,
      complexity: complexity === ALL ? undefined : complexity,
      minRating: minR !== undefined && !Number.isNaN(minR) ? minR : undefined,
      maxPrice: max !== undefined && !Number.isNaN(max) ? max : undefined,
    });

    // El store no filtra por tarifa mínima: se resuelve acá.
    const min = priceMin.trim() ? Number(priceMin) : undefined;
    if (min !== undefined && !Number.isNaN(min)) {
      list = list.filter((w) => (w.hourlyRate ?? 0) >= min);
    }

    const sorted = [...list].sort((a, b) => {
      if (sort === "price") return (a.hourlyRate ?? Infinity) - (b.hourlyRate ?? Infinity);
      if (sort === "distance") return (distMap[a.id] ?? Infinity) - (distMap[b.id] ?? Infinity);
      return (b.rating ?? 0) - (a.rating ?? 0);
    });

    return { results: sorted, distanceById: distMap };
  }, [
    cat,
    zoneQuery,
    q,
    priceMin,
    priceMax,
    minRating,
    complexity,
    onlyVerified,
    onlyAvailableNow,
    onlyLicensed,
    onCallOnly,
    sort,
    user?.geo,
  ]);

  // Dolor #1 de las entrevistas: saber cuánta gente puede ir AHORA.
  const availableNow = useMemo(
    () => store.getAvailableNowCount({ category: cat, zone: zoneQuery }),
    [cat, zoneQuery],
  );
  const onCallCount = useMemo(() => store.getOnCallWorkers(cat).length, [cat]);

  // Miedo a los precios abusivos (entrevistas 1, 3 y 6): referencia de mercado.
  const priceRef = useMemo(() => (cat ? store.getPriceReference(cat) : null), [cat]);
  const showPriceRef = priceRef !== null && priceRef.count >= 3;

  // Sensación de carga al cambiar cualquier filtro.
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [
    cat,
    zoneQuery,
    q,
    priceMin,
    priceMax,
    minRating,
    complexity,
    onlyVerified,
    onlyAvailableNow,
    onlyLicensed,
    onCallOnly,
    sort,
  ]);

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
    setComplexity(ALL);
    setOnlyVerified(false);
    setOnlyAvailableNow(false);
    setOnlyLicensed(false);
    setOnCallOnly(false);
    setSort("rating");
  };

  const verDeGuardia = () => {
    setOnCallOnly(true);
    setOnlyAvailableNow(false);
  };

  // Contexto de la barra de disponibilidad.
  const contexto = [cat ?? "Todos los oficios", zoneQuery ? `en ${zoneQuery}` : "en todas las zonas"].join(" · ");

  // Filtros del panel avanzado (para el contador del botón "Más filtros").
  const advancedCount =
    (priceMin.trim() ? 1 : 0) + (priceMax.trim() ? 1 : 0) + (minRating !== ALL ? 1 : 0) + (complexity !== ALL ? 1 : 0);

  // Chips de filtros activos.
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (q.trim()) chips.push({ key: "q", label: `“${q.trim()}”`, clear: () => setQ("") });
  if (cat) chips.push({ key: "cat", label: cat, clear: () => setCategory(ALL) });
  if (zoneQuery) chips.push({ key: "zone", label: zoneQuery, clear: () => setZone("") });
  if (priceMin.trim())
    chips.push({ key: "pmin", label: `Desde ${money(Number(priceMin))}/h`, clear: () => setPriceMin("") });
  if (priceMax.trim())
    chips.push({ key: "pmax", label: `Hasta ${money(Number(priceMax))}/h`, clear: () => setPriceMax("") });
  if (minRating !== ALL) chips.push({ key: "rating", label: `${minRating}+ estrellas`, clear: () => setMinRating(ALL) });
  if (complexity !== ALL)
    chips.push({ key: "complexity", label: `Complejidad ${COMPLEXITY_LABELS[complexity].toLowerCase()}`, clear: () => setComplexity(ALL) });
  if (onlyVerified) chips.push({ key: "verified", label: "Verificados", clear: () => setOnlyVerified(false) });
  if (onlyAvailableNow)
    chips.push({ key: "availableNow", label: "Disponibles ahora", clear: () => setOnlyAvailableNow(false) });
  if (onlyLicensed) chips.push({ key: "licensed", label: "Matriculados", clear: () => setOnlyLicensed(false) });
  if (onCallOnly) chips.push({ key: "onCall", label: "De guardia", clear: () => setOnCallOnly(false) });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buscar profesionales"
        subtitle="Encontrá al trabajador verificado que necesitás por oficio, zona y disponibilidad real"
      />

      {/* Barra de disponibilidad en vivo — dolor #1 de la investigación */}
      <Card className={cn("overflow-hidden", availableNow > 0 ? "border-success/35 bg-success-light/50" : "bg-muted/40")}>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
              {availableNow > 0 && (
                <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-success opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  availableNow > 0 ? "bg-success" : "bg-muted-foreground/50",
                )}
              />
            </span>
            <div className="min-w-0">
              <p className="font-semibold leading-tight">
                {availableNow > 0 ? (
                  <>
                    <span className="text-success">{availableNow}</span>{" "}
                    {availableNow === 1 ? "profesional disponible ahora" : "profesionales disponibles ahora"}
                  </>
                ) : (
                  "Nadie disponible en este momento"
                )}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {availableNow > 0
                  ? contexto
                  : onCallCount > 0
                    ? `${contexto} — hay ${onCallCount} de guardia para fines de semana y feriados`
                    : `${contexto} — publicá tu solicitud y te avisamos cuando alguien se libere`}
              </p>
            </div>
          </div>

          {availableNow > 0 ? (
            onlyAvailableNow ? (
              <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => setOnlyAvailableNow(false)}>
                <X className="h-4 w-4" />
                Ver también los ocupados
              </Button>
            ) : (
              <Button type="button" size="sm" className="gap-1.5" onClick={() => setOnlyAvailableNow(true)}>
                <Zap className="h-4 w-4" />
                Ver solo disponibles
              </Button>
            )
          ) : onCallCount > 0 ? (
            <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={verDeGuardia}>
              <CalendarClock className="h-4 w-4" />
              Ver {onCallCount} de guardia
            </Button>
          ) : (
            <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => navigate("/u/requests/new")}>
              Publicar solicitud
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Precio de referencia — contra el miedo a que te cobren de más */}
      {showPriceRef && (
        <Card className="border-primary/25 bg-primary-light/40">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-semibold leading-snug">
                En tu zona, {priceRef.category} va de {money(priceRef.min)} a {money(priceRef.max)}{" "}
                <span className="text-muted-foreground">(promedio {money(priceRef.avg)})</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Referencia calculada sobre {priceRef.count} precios publicados y trabajos cerrados en OFIX. Si un
                presupuesto se va muy por encima, pedí un segundo.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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

          {/* Filtros rápidos: lo que pidieron las entrevistas, siempre a la vista */}
          <div className="flex flex-wrap items-center gap-2 border-t pt-4">
            <FilterChip icon={Zap} active={onlyAvailableNow} onClick={() => setOnlyAvailableNow((v) => !v)}>
              Disponible ahora
            </FilterChip>
            <FilterChip icon={BadgeCheck} active={onlyLicensed} onClick={() => setOnlyLicensed((v) => !v)}>
              Solo matriculados
            </FilterChip>
            <FilterChip icon={ShieldCheck} active={onlyVerified} onClick={() => setOnlyVerified((v) => !v)}>
              Solo verificados
            </FilterChip>
            <FilterChip icon={CalendarClock} active={onCallOnly} onClick={() => setOnCallOnly((v) => !v)}>
              De guardia fin de semana
            </FilterChip>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto gap-1.5 text-muted-foreground"
              aria-expanded={showAdvanced}
              onClick={() => setShowAdvanced((v) => !v)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Más filtros
              {advancedCount > 0 && (
                <Badge variant="secondary" className="ml-0.5 h-5 min-w-5 justify-center px-1.5 text-xs">
                  {advancedCount}
                </Badge>
              )}
              <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")} />
            </Button>
          </div>

          {/* Panel avanzado (colapsable) */}
          {showAdvanced && (
            <div className="grid gap-4 border-t pt-4 md:grid-cols-3">
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
                <Label htmlFor="complexity" className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  Complejidad del trabajo
                </Label>
                <Select value={complexity} onValueChange={(v) => setComplexity(v as Complexity | typeof ALL)}>
                  <SelectTrigger id="complexity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Cualquiera</SelectItem>
                    {(Object.keys(COMPLEXITY_LABELS) as Complexity[]).map((c) => (
                      <SelectItem key={c} value={c}>{COMPLEXITY_LABELS[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

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
        <div>
          <h2 className="text-lg font-semibold">Resultados</h2>
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "profesional" : "profesionales"}
            {cat ? ` de ${cat}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger id="sort" className="w-[180px]" aria-label="Ordenar por">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
                <SelectItem key={s} value={s}>{SORT_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          description="Probá ajustando los filtros o publicá tu solicitud para que te contacten."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={limpiar}>
                Limpiar filtros
              </Button>
              <Button onClick={() => navigate("/u/requests/new")}>Publicar solicitud</Button>
            </div>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((w) => (
            <div key={w.id} className="relative">
              <WorkerCard
                worker={w}
                distance={distanceById[w.id]}
                onClick={() => navigate(`/u/workers/${w.id}`)}
              />
              {/* Estado en vivo del profesional (derivado de agenda + trabajos activos) */}
              <AvailabilityBadge
                status={store.getAvailabilityStatus(w.id)}
                className="pointer-events-none absolute bottom-3 right-3 shadow-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

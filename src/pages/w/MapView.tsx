import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Siren, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClickableCard } from "@/components/ofix/ClickableCard";
import { PageHeader } from "@/components/ofix/PageHeader";
import { RealMap, type MapPoint } from "@/components/ofix/RealMap";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { UrgencyBadge } from "@/components/ofix/badges";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { CATEGORIES, URGENCY_LABELS, type Urgency } from "@/lib/types";
import { cn } from "@/lib/utils";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

// El color del pin dice qué tan urgente es el trabajo.
const URGENCY_COLOR: Record<Urgency, string> = {
  inmediata: "#dc2626",
  en_el_dia: "#f97316",
  programada: "#2563eb",
};

/**
 * Mapa de solicitudes cercanas — el espejo del mapa del cliente.
 *
 * El cliente ve profesionales; el profesional ve trabajo disponible. Cada pin
 * es una solicitud abierta, el color indica la urgencia, y al tocarlo se abre
 * quién la publicó, qué necesita, cuánto ofrece y a qué distancia está.
 */
export default function WorkerMapView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState<string | null>(null);
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const myGeo = user?.geo;
  // Por defecto se muestran solo los oficios del profesional: es su trabajo posible.
  const myTrades = user?.trades?.length ? user.trades : user?.trade ? [user.trade] : [];

  const offers = useMemo(() => {
    return store
      .getOffers({ status: "abierta", category: category || undefined })
      .filter((o) => o.geo)
      .filter((o) => (onlyEmergency ? o.emergency : true))
      .filter((o) => (category ? true : myTrades.length === 0 || myTrades.includes(o.category)))
      .map((o) => ({
        offer: o,
        client: store.getUser(o.authorId),
        distance: store.distanceKm(myGeo, o.geo),
      }))
      .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  }, [category, onlyEmergency, myGeo, myTrades]);

  const points: MapPoint[] = offers.map(({ offer, client, distance }) => ({
    id: offer.id,
    name: offer.title,
    lat: offer.geo!.lat,
    lng: offer.geo!.lng,
    subtitle: `${offer.category} · ${client?.name || "Cliente"}`,
    distance,
    price: offer.budget,
    photo: client?.photo,
    pinColor: URGENCY_COLOR[offer.urgency],
    tagLabel: offer.emergency ? "🚨 Emergencia" : URGENCY_LABELS[offer.urgency],
    tagColor: URGENCY_COLOR[offer.urgency],
    actionLabel: "Ver y presupuestar",
  }));

  const urgentes = offers.filter((o) => o.offer.urgency === "inmediata").length;
  const sel = offers.find((o) => o.offer.id === selected);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Trabajo cerca tuyo"
        subtitle="Tocá un punto del mapa para ver qué necesitan, cuánto ofrecen y a qué distancia está."
      />

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm">
            <span className="font-semibold">{offers.length}</span> solicitudes abiertas
            {urgentes > 0 && (
              <>
                {" · "}
                <span className="font-semibold text-destructive">{urgentes} inmediatas</span>
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Legend color="bg-destructive" label="Inmediata" />
            <Legend color="bg-accent" label="En el día" />
            <Legend color="bg-primary" label="Programada" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={!category} onClick={() => setCategory(null)}>
            {myTrades.length ? "Mis oficios" : "Todos los oficios"}
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Chip active={onlyEmergency} tone="destructive" onClick={() => setOnlyEmergency((v) => !v)}>
            Solo emergencias
          </Chip>
        </div>
      </div>

      {points.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold">No hay solicitudes con estos filtros</p>
              <p className="text-sm text-muted-foreground">Probá con otro oficio o sacá el filtro de emergencias.</p>
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

      {sel && (
        <Card className="border-primary/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <UserAvatar name={sel.client?.name || "?"} photo={sel.client?.photo} className="h-14 w-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{sel.offer.title}</h3>
                  <UrgencyBadge urgency={sel.offer.urgency} />
                  {sel.offer.emergency && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                      <Siren className="h-3 w-3" />
                      Emergencia
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {sel.offer.category} · {sel.client?.name || "Cliente"}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{sel.offer.description}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {sel.distance !== null && (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Navigation className="h-3 w-3" />a {sel.distance} km
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {sel.offer.location}
                  </span>
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
                <p className="whitespace-nowrap text-sm font-bold">{money(sel.offer.budget)}</p>
              </div>
            </div>
            <Button className="mt-3 w-full" onClick={() => navigate(`/w/jobs/${sel.offer.id}`)}>
              Ver detalle y presupuestar
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Más cercanas</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {offers.slice(0, 8).map(({ offer, client, distance }) => (
            <ClickableCard
              key={offer.id}
              onClick={() => setSelected(offer.id)}
              label={`Ver ${offer.title}`}
              className={cn(selected === offer.id && "border-primary")}
            >
              <CardContent className="flex items-center gap-3 p-3">
                <UserAvatar name={client?.name || "?"} photo={client?.photo} className="h-11 w-11 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{offer.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {offer.category} · {offer.location}
                  </p>
                  <UrgencyBadge urgency={offer.urgency} className="mt-1" />
                </div>
                <div className="shrink-0 text-right">
                  {distance !== null && <p className="text-xs font-semibold text-primary">a {distance} km</p>}
                  <p className="whitespace-nowrap text-sm font-bold">{money(offer.budget)}</p>
                </div>
              </CardContent>
            </ClickableCard>
          ))}
        </div>
      </section>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
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
  tone?: "primary" | "destructive";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? tone === "destructive"
            ? "border-destructive bg-destructive text-destructive-foreground"
            : "border-primary bg-primary text-primary-foreground"
          : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

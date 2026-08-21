import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  subtitle?: string;
  distance?: number | null;
  rating?: number;
  reviewCount?: number;
  price?: number;
  verified?: boolean;
  photo?: string;
  /** "disponible" pinta el pin en verde y lo muestra en el popup. */
  availability?: "disponible" | "ocupado" | "fuera_de_horario";
  availabilityLabel?: string;
}

const AVAILABILITY_COLOR: Record<string, string> = {
  disponible: "#16a34a",
  ocupado: "#f97316",
  fuera_de_horario: "#94a3b8",
};

// Pin personalizado (evita el bug de assets de los íconos default de Leaflet).
function pin(color: string, ring = false) {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative">
      <div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.35);border:2px solid #fff"></div>
      <div style="position:absolute;top:7px;left:7px;width:10px;height:10px;border-radius:50%;background:#fff"></div>
      ${ring ? `<div style="position:absolute;top:-6px;left:-6px;width:38px;height:38px;border-radius:50%;background:${color}33;animation:ofixping 1.6s ease-out infinite"></div>` : ""}
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -24],
  });
}

function FitBounds({ points, center }: { points: MapPoint[]; center?: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    const coords: [number, number][] = points.map((p) => [p.lat, p.lng]);
    if (center) coords.push([center.lat, center.lng]);
    if (coords.length === 1) {
      map.setView(coords[0], 14);
    } else if (coords.length > 1) {
      map.fitBounds(L.latLngBounds(coords).pad(0.25));
    }
  }, [map, points, center]);
  return null;
}

// Mapa real (OpenStreetMap) con pines de trabajadores por geolocalización.
export function RealMap({
  points,
  center,
  onSelect,
  className,
}: {
  points: MapPoint[];
  center?: { lat: number; lng: number };
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const fallback = center || (points[0] ? { lat: points[0].lat, lng: points[0].lng } : { lat: -34.6037, lng: -58.3816 });
  const accent = "#f97316";
  const primary = "#2563eb";
  return (
    <div className={cn("relative overflow-hidden rounded-xl border", className)}>
      <MapContainer
        center={[fallback.lat, fallback.lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", minHeight: 300 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} center={center} />
        {center && (
          <Marker position={[center.lat, center.lng]} icon={pin(accent, true)}>
            <Popup>Tu ubicación</Popup>
          </Marker>
        )}
        {points.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            // El color del pin dice de un vistazo quién puede ir ahora.
            icon={pin(p.availability ? AVAILABILITY_COLOR[p.availability] || primary : primary)}
            eventHandlers={{ click: () => onSelect?.(p.id) }}
          >
            <Popup>
              <div style={{ minWidth: 190, fontFamily: "inherit" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {p.photo ? (
                    <img src={p.photo} alt={p.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#dbe6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                      {p.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
                      {p.name}
                      {p.verified && <span title="Verificado" style={{ color: "#16a34a" }}>✓</span>}
                    </div>
                    {p.subtitle && <div style={{ color: "#64748b", fontSize: 12 }}>{p.subtitle}</div>}
                  </div>
                </div>
                {p.availabilityLabel && (
                  <div style={{ margin: "8px 0 0" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        color: p.availability ? AVAILABILITY_COLOR[p.availability] : "#64748b",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: p.availability ? AVAILABILITY_COLOR[p.availability] : "#64748b",
                        }}
                      />
                      {p.availabilityLabel}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", gap: 12, margin: "8px 0", fontSize: 12, color: "#334155" }}>
                  {typeof p.rating === "number" && p.rating > 0 && <span>⭐ {p.rating.toFixed(1)}{p.reviewCount ? ` (${p.reviewCount})` : ""}</span>}
                  {typeof p.distance === "number" && <span style={{ color: "#2563eb" }}>📍 a {p.distance} km</span>}
                </div>
                {typeof p.price === "number" && p.price > 0 && (
                  <div style={{ fontSize: 12, marginBottom: 6 }}><strong>${p.price.toLocaleString()}</strong> / hora</div>
                )}
                {onSelect && (
                  <button
                    onClick={() => onSelect(p.id)}
                    style={{ width: "100%", background: "#2563eb", color: "#fff", border: 0, borderRadius: 8, padding: "7px 8px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  >
                    Ver perfil
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

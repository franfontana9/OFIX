import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import type { PublicUser } from "@/lib/types";
import { cn } from "@/lib/utils";

type NearbyWorker = { worker: PublicUser; distance: number | null };

interface MapMockProps {
  workers: NearbyWorker[];
  center?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

/** Hash determinista simple a partir del id para ubicar los pines. */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Devuelve una posición estable (left/top en %) dentro del rango 10-85%. */
function pinPosition(id: string): { left: number; top: number } {
  const h = hashId(id);
  const left = 10 + (h % 76); // 10 .. 85
  const top = 10 + ((Math.floor(h / 97)) % 76); // 10 .. 85
  return { left, top };
}

export function MapMock({ workers, center, onSelect, className }: MapMockProps) {
  const [active, setActive] = useState<string | null>(null);

  // Grid de "calles" simuladas.
  const streets = Array.from({ length: 6 });
  // Algunas "cuadras" destacadas de forma determinista.
  const blocks = [
    { left: 18, top: 22, w: 20, h: 16 },
    { left: 55, top: 14, w: 24, h: 20 },
    { left: 30, top: 55, w: 26, h: 22 },
    { left: 66, top: 60, w: 18, h: 20 },
    { left: 8, top: 68, w: 16, h: 18 },
  ];

  return (
    <div
      className={cn(
        "relative h-72 w-full overflow-hidden rounded-xl border bg-muted md:h-80",
        className,
      )}
      role="img"
      aria-label="Mapa de profesionales cercanos"
    >
      {/* Fondo del mapa */}
      <div className="absolute inset-0 bg-primary-light/40" />

      {/* Cuadras */}
      {blocks.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-md bg-primary/5"
          style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.w}%`, height: `${b.h}%` }}
        />
      ))}

      {/* Calles horizontales */}
      {streets.map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-primary/15"
          style={{ top: `${((i + 1) / (streets.length + 1)) * 100}%` }}
        />
      ))}
      {/* Calles verticales */}
      {streets.map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute bottom-0 top-0 w-px bg-primary/15"
          style={{ left: `${((i + 1) / (streets.length + 1)) * 100}%` }}
        />
      ))}

      {/* Avenida diagonal para dar textura */}
      <div className="absolute -inset-1/4 rotate-[24deg] border-t-2 border-primary/10" style={{ top: "45%" }} />

      {/* Pin central: vos / centro */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-accent/30" />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow-lg">
          <Navigation className="h-4 w-4" />
        </div>
        <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-white shadow">
          {center || "Tu ubicación"}
        </span>
      </div>

      {/* Pines de trabajadores */}
      {workers.map(({ worker, distance }) => {
        const { left, top } = pinPosition(worker.id);
        const isActive = active === worker.id;
        return (
          <button
            key={worker.id}
            type="button"
            onClick={() => {
              setActive(worker.id);
              onSelect?.(worker.id);
            }}
            onMouseEnter={() => setActive(worker.id)}
            className={cn(
              "group absolute z-10 -translate-x-1/2 -translate-y-full focus:outline-none",
              isActive && "z-30",
            )}
            style={{ left: `${left}%`, top: `${top}%` }}
            aria-label={`${worker.name}${distance != null ? ` a ${distance} km` : ""}`}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md transition-transform group-hover:scale-110",
                isActive && "scale-110 ring-2 ring-primary/40",
              )}
            >
              <MapPin className="h-4 w-4" />
            </div>
            {isActive && (
              <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg border bg-background px-2 py-1 text-left shadow-lg">
                <p className="text-xs font-semibold leading-tight">{worker.name}</p>
                {distance != null && (
                  <p className="text-[10px] text-muted-foreground">a {distance} km</p>
                )}
                {worker.trade && (
                  <p className="text-[10px] text-primary">{worker.trade}</p>
                )}
              </div>
            )}
          </button>
        );
      })}

      {/* Leyenda */}
      <div className="absolute bottom-2 left-2 z-30 flex flex-wrap items-center gap-3 rounded-lg border bg-background/90 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-accent" /> Vos
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-primary" /> Profesionales ({workers.length})
        </span>
      </div>
    </div>
  );
}

export default MapMock;

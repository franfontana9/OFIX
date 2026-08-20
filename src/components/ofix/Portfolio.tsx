import { ArrowRight, Camera, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryIcon } from "./CategoryIcon";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

// Galería antes/después de trabajos ya cerrados. Responde a E2 ("la seguridad
// proviene de ver trabajos previos") y a E5 ("usaría la plataforma para mostrar
// mis trabajos"). Si el profesional no tiene fotos, no se renderiza nada.

function fecha(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
}

function PhotoStack({
  images,
  label,
  tone,
}: {
  images: string[];
  label?: string;
  tone?: "before" | "after";
}) {
  const [main, ...rest] = images;
  if (!main) return null;
  const alt = label ? `${label} — foto del trabajo` : "Foto del trabajo";

  return (
    <div className="min-w-0 flex-1">
      {label && (
        <Badge variant={tone === "after" ? "success" : "secondary"} className="mb-1.5">
          {label}
        </Badge>
      )}
      <a
        href={main}
        target="_blank"
        rel="noreferrer"
        className="group block overflow-hidden rounded-lg border bg-muted"
        title="Ver foto en tamaño completo"
      >
        <img
          src={main}
          alt={alt}
          loading="lazy"
          className="h-40 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </a>
      {rest.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {rest.slice(0, 4).map((src, i) => (
            <a
              key={`${src.slice(-16)}-${i}`}
              href={src}
              target="_blank"
              rel="noreferrer"
              className="block h-12 w-12 overflow-hidden rounded-lg border bg-muted"
              title="Ver foto en tamaño completo"
            >
              <img src={src} alt={`${alt} ${i + 2}`} loading="lazy" className="h-full w-full rounded-lg object-cover" />
            </a>
          ))}
          {rest.length > 4 && (
            <span className="flex h-12 w-12 items-center justify-center rounded-lg border text-xs font-semibold text-muted-foreground">
              +{rest.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function Portfolio({ workerId, className }: { workerId: string; className?: string }) {
  const items = store.getPortfolio(workerId);
  if (items.length === 0) return null;

  const conComparativa = items.filter((p) => p.before.length > 0 && p.after.length > 0).length;

  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Camera className="h-5 w-5 text-primary" />
            Trabajos realizados
          </h2>
          <p className="text-sm text-muted-foreground">
            Fotos de trabajos cerrados en OFIX
            {conComparativa > 0 && `, ${conComparativa} con antes y después`}.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <ImageIcon className="h-3 w-3" />
          {items.length} {items.length === 1 ? "trabajo" : "trabajos"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((p) => {
          const comparativa = p.before.length > 0 && p.after.length > 0;
          const cuando = fecha(p.completedAt);

          return (
            <Card key={p.jobId} className="overflow-hidden">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <CategoryIcon category={p.category} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold leading-tight">{p.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {p.category}
                      {cuando && ` · ${cuando}`}
                    </p>
                  </div>
                </div>

                {comparativa ? (
                  <div className="flex items-stretch gap-2">
                    <PhotoStack images={p.before} label="Antes" tone="before" />
                    <div className="flex shrink-0 items-center pt-7 text-muted-foreground">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <PhotoStack images={p.after} label="Después" tone="after" />
                  </div>
                ) : (
                  <PhotoStack images={p.after.length > 0 ? p.after : p.before} />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

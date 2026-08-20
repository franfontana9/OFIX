import { Skeleton, SkeletonList } from "@/components/ofix/Skeleton";

// Fallback del Suspense de rutas (code-splitting). Imita la forma de una
// pantalla típica para que el cambio de ruta no parpadee en blanco.
export function PageFallback() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:px-8" role="status" aria-label="Cargando página">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <SkeletonList count={4} />
    </div>
  );
}

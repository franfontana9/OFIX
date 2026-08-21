import { useNavigate, useParams, Link } from "react-router-dom";
import { Siren, Loader2, MessageCircle, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { WorkerCard } from "@/components/ofix/WorkerCard";
import { RealMap, type MapPoint } from "@/components/ofix/RealMap";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { run } from "@/lib/run";

export default function UserEmergency() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const offer = id ? store.getOffer(id) : undefined;

  if (!offer) {
    return (
      <div>
        <PageHeader title="Buscando profesional" back />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">No encontramos esta emergencia.</CardContent>
        </Card>
      </div>
    );
  }

  const nearby = store.getNearbyWorkers(offer.geo, { category: offer.category, onlyAvailable: true });

  const mapPoints: MapPoint[] = nearby
    .filter(({ worker }) => worker.geo)
    .map(({ worker, distance }) => ({
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
    }));

  const contact = (workerId: string) => {
    const chat = run(() => store.createChat(user!.id, workerId));
    if (!chat) return;
    navigate(`/u/chat/${chat.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Buscando profesional" subtitle={`Emergencia de ${offer.category} en ${offer.location}`} back />

      {/* Estado de búsqueda */}
      <Card className="overflow-hidden border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="relative">
            <span className="absolute inset-0 animate-ping rounded-full bg-destructive/20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-white">
              <Siren className="h-8 w-8" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm">Estamos avisando a los profesionales verificados más cercanos disponibles…</p>
          </div>
        </CardContent>
      </Card>

      {/* Mapa de profesionales cercanos */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Cerca tuyo ahora</h2>
        <RealMap
          points={mapPoints}
          center={offer.geo}
          onSelect={(workerId) => navigate(`/u/workers/${workerId}`)}
          className="h-[420px]"
        />
      </section>

      {/* Candidatos cercanos */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Profesionales cercanos disponibles</h2>
        {nearby.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No hay profesionales disponibles en tu zona por el momento. Probá con una solicitud normal.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {nearby.map(({ worker, distance }) => (
              <div key={worker.id} className="space-y-2">
                <WorkerCard worker={worker} distance={distance} onClick={() => navigate(`/u/workers/${worker.id}`)} />
                <div className="flex gap-2 pl-1">
                  <Button size="sm" className="gap-2" onClick={() => contact(worker.id)}>
                    <MessageCircle className="h-4 w-4" />
                    Contactar
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => navigate(`/u/workers/${worker.id}`)}>
                    <User className="h-4 w-4" />
                    Ver perfil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Link to={`/u/requests/${offer.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        Ver la solicitud
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

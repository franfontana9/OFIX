import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ofix/PageHeader";
import { EmptyState } from "@/components/ofix/EmptyState";
import { WorkerCard } from "@/components/ofix/WorkerCard";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

export default function UserFavorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const favorites = user ? store.getFavorites(user.id) : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Favoritos" subtitle="Los profesionales que guardaste para volver a contactar" />

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Todavía no tenés favoritos"
          description="Guardá profesionales de confianza para encontrarlos rápido."
          action={<Button onClick={() => navigate("/u/search")}>Buscar profesionales</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favorites.map((w) => (
            <WorkerCard key={w.id} worker={w} onClick={() => navigate(`/u/workers/${w.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

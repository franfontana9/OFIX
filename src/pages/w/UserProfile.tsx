import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, MapPin, Phone, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import type { ClientType } from "@/lib/types";

const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  hogar: "Hogar",
  pyme_gastronomica: "PyME Gastronómica",
};

export default function WorkerUserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const client = id ? store.getUser(id) : null;

  if (!client) {
    return (
      <div>
        <PageHeader title="Usuario no encontrado" back />
        <p className="text-muted-foreground">No pudimos encontrar este usuario.</p>
      </div>
    );
  }

  const reviews = store.getReviews({ targetId: client.id });
  const isPyme = client.clientType === "pyme_gastronomica";

  const openChat = () => {
    const chat = store.createChat(user!.id, client.id);
    navigate(`/w/chat/${chat.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={client.name} subtitle="Datos del usuario" back />

      {/* Datos */}
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <UserAvatar name={client.name} photo={client.photo} className="h-20 w-20 text-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">{client.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary">
                {isPyme ? <Building2 className="h-3 w-3" /> : <Home className="h-3 w-3" />}
                {client.clientType ? CLIENT_TYPE_LABELS[client.clientType] : "Cliente"}
              </span>
            </div>
            <StarRating value={client.rating || 0} showValue count={client.reviewCount} />
            <div className="space-y-1 text-sm text-muted-foreground">
              {client.zone && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {client.zone}
                </p>
              )}
              {client.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {client.phone}
                </p>
              )}
            </div>
          </div>
          <Button className="gap-2 sm:self-start" onClick={openChat}>
            <MessageSquare className="h-4 w-4" />
            Enviar mensaje
          </Button>
        </CardContent>
      </Card>

      {/* Reseñas / historial */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reseñas e historial ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">Este usuario todavía no tiene reseñas.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => {
                const author = store.getUser(r.authorId);
                return (
                  <div key={r.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={author?.name || "?"} photo={author?.photo} className="h-8 w-8 text-xs" />
                        <span className="text-sm font-medium">{author?.name || "Usuario"}</span>
                      </div>
                      <StarRating value={r.stars} size={14} />
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                    <p className="mt-1 text-xs text-muted-foreground/70">{new Date(r.createdAt).toLocaleDateString("es-AR")}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

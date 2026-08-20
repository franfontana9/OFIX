import { useNavigate } from "react-router-dom";
import { Pencil, LogOut, Mail, Phone, MapPin, Building2, ClipboardList, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { StatCard } from "@/components/ofix/StatCard";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  const offers = store.getOffers({ authorId: user.id });
  const jobs = store.getJobs({ clientId: user.id });
  const reviews = store.getReviews({ targetId: user.id });
  const clientTypeLabel = user.clientType === "pyme_gastronomica" ? "PyME gastronómica" : "Hogar";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mi perfil"
        action={
          <>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/u/settings")}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </>
        }
      />

      {/* Datos */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <UserAvatar name={user.name} photo={user.photo} className="h-20 w-20 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-4 w-4" /> {user.email}
                </span>
                {user.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-4 w-4" /> {user.phone}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-4 w-4" /> {clientTypeLabel}
                </span>
                {user.zone && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {user.zone}
                  </span>
                )}
              </div>
              <StarRating value={user.rating || 0} showValue count={user.reviewCount} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actividad */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mi actividad</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard icon={ClipboardList} label="Solicitudes" value={offers.length} tone="primary" />
          <StatCard icon={Briefcase} label="Trabajos" value={jobs.length} tone="success" />
        </div>
      </section>

      {/* Reseñas recibidas */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reseñas recibidas ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no recibiste reseñas.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => {
              const author = store.getUser(r.authorId);
              return (
                <Card key={r.id}>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{author?.name || "Usuario"}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString("es-AR")}
                      </span>
                    </div>
                    <StarRating value={r.stars} size={14} />
                    {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

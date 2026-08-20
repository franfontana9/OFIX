import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, MapPin, MessageSquare, ClipboardList, ShieldCheck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { ServiceThumb } from "@/components/ofix/ServiceThumb";
import { VerificationBadge, LevelBadge } from "@/components/ofix/badges";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

export default function UserWorkerProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const worker = id ? store.getWorker(id) : null;

  const [fav, setFav] = useState(() => (id && user ? store.isFavorite(user.id, id) : false));

  if (!worker) {
    return (
      <div>
        <PageHeader title="Profesional" back />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No encontramos el profesional que buscás.
          </CardContent>
        </Card>
      </div>
    );
  }

  const services = store.getServices({ workerId: worker.id });
  // Reseñas contextuales: primero las del oficio principal del profesional.
  const reviews = [...store.getReviews({ targetId: worker.id })].sort((a, b) => {
    const ca = store.getJob(a.jobId)?.category === worker.trade ? 1 : 0;
    const cb = store.getJob(b.jobId)?.category === worker.trade ? 1 : 0;
    return cb - ca || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const history = store.getJobs({ workerId: worker.id, status: "completado" });
  const v = worker.verification;

  const toggleFav = () => {
    const now = store.toggleFavorite(worker.id);
    setFav(now);
    toast.success(now ? "Agregado a favoritos" : "Quitado de favoritos");
  };

  const sendMessage = () => {
    if (!user) return;
    const chat = store.createChat(user.id, worker.id);
    navigate(`/u/chat/${chat.id}`);
  };

  const checks: { label: string; ok: boolean }[] = [
    { label: "Identidad verificada (DNI)", ok: !!v?.identity },
    { label: "Antecedentes verificados", ok: !!v?.background },
    { label: "Matrícula / título profesional", ok: !!v?.license },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={worker.name} back />

      {/* Cabecera */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <UserAvatar name={worker.name} photo={worker.photo} className="h-20 w-20 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold">{worker.name}</h1>
                {worker.premium && <span className="text-xs font-medium text-accent">★ Destacado</span>}
              </div>
              <p className="text-muted-foreground">{worker.trade}</p>
              <StarRating value={worker.rating || 0} showValue count={worker.reviewCount} />
              <div className="flex flex-wrap items-center gap-2">
                <VerificationBadge verified={worker.verified} />
                {worker.level && <LevelBadge level={worker.level} />}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {worker.coverageZone && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {worker.coverageZone}
                  </span>
                )}
                {typeof worker.hourlyRate === "number" && worker.hourlyRate > 0 && (
                  <span>
                    <span className="font-semibold text-foreground">${worker.hourlyRate.toLocaleString()}</span> / hora
                  </span>
                )}
              </div>
              {worker.bio && <p className="pt-1 text-sm">{worker.bio}</p>}
            </div>
            <Button variant={fav ? "secondary" : "outline"} className="gap-2 sm:self-start" onClick={toggleFav}>
              <Heart className={fav ? "h-4 w-4 fill-destructive text-destructive" : "h-4 w-4"} />
              {fav ? "Quitar" : "Agregar a favoritos"}
            </Button>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1 gap-2" onClick={() => navigate("/u/requests/new")}>
              <ClipboardList className="h-4 w-4" /> Solicitar
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={sendMessage}>
              <MessageSquare className="h-4 w-4" /> Enviar mensaje
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seguro y vigencia */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ShieldCheck className="h-5 w-5 text-success" /> Seguro y vigencia
        </h2>
        <Card>
          <CardContent className="divide-y p-0">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center gap-3 px-4 py-3">
                {c.ok ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <span className={c.ok ? "text-sm" : "text-sm text-muted-foreground"}>{c.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Servicios */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Servicios</h2>
        {services.length === 0 ? (
          <p className="text-sm text-muted-foreground">Este profesional todavía no publicó servicios.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((s) => (
              <Card key={s.id} className="overflow-hidden">
                <div className="h-32 w-full overflow-hidden border-b">
                  <ServiceThumb image={s.images?.[0]} category={s.category} />
                </div>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{s.title}</h3>
                    <span className="shrink-0 font-bold">${s.price.toLocaleString()}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {s.duration}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Historial de trabajos */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Historial de trabajos ({history.length})</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Este profesional todavía no tiene trabajos completados.</p>
        ) : (
          <div className="space-y-3">
            {history.map((j) => {
              const client = store.getUser(j.clientId);
              const review = store.getReviews({ jobId: j.id, targetId: worker.id })[0];
              return (
                <Card key={j.id}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-light text-success">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{j.title}</span>
                        <span className="text-sm font-semibold">${j.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="rounded-full bg-muted px-2 py-0.5">{j.category}</span>
                        {j.completedAt && <span>{new Date(j.completedAt).toLocaleDateString("es-AR")}</span>}
                        {client && <span>· {client.name}</span>}
                      </div>
                      {review && (
                        <div className="mt-2">
                          <StarRating value={review.stars} size={13} />
                          {review.comment && <p className="mt-0.5 text-sm text-muted-foreground">“{review.comment}”</p>}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Reseñas */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reseñas ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay reseñas para este profesional.</p>
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
                        {new Date(r.createdAt).toLocaleDateString()}
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

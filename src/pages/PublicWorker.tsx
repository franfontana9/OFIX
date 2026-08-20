import { useNavigate, useParams, Link } from "react-router-dom";
import { MapPin, ShieldCheck, CheckCircle2, XCircle, Clock, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { ServiceThumb } from "@/components/ofix/ServiceThumb";
import { VerificationBadge, LevelBadge } from "@/components/ofix/badges";
import { store } from "@/lib/store";
import { trustScore, trustLabel } from "@/lib/trust";

// Perfil público del trabajador (sin login). CTA para registrarse al contactar.
export default function PublicWorker() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const worker = id ? store.getWorker(id) : null;

  if (!worker) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">No encontramos el profesional.</p>
        <Button onClick={() => navigate("/explorar")}>Volver a explorar</Button>
      </div>
    );
  }

  const services = store.getServices({ workerId: worker.id });
  const reviews = store.getReviews({ targetId: worker.id });
  const history = store.getJobs({ workerId: worker.id, status: "completado" });
  const v = worker.verification;
  const score = trustScore(worker);
  const checks = [
    { label: "Identidad verificada (DNI)", ok: !!v?.identity },
    { label: "Antecedentes verificados", ok: !!v?.background },
    { label: "Matrícula / título profesional", ok: !!v?.license },
  ];
  const register = () => navigate("/auth/register?role=user");

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary">OFIX</Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/auth/login")}>Ingresar</Button>
            <Button onClick={() => navigate("/auth/register")}>Registrarse</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-6">
        <Button variant="ghost" size="sm" className="mb-3 -ml-2 gap-2 text-muted-foreground" onClick={() => navigate("/explorar")}>
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <UserAvatar name={worker.name} photo={worker.photo} className="h-20 w-20 shrink-0 text-2xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <h1 className="text-2xl font-bold">{worker.name}</h1>
                <p className="text-muted-foreground">{worker.trade}</p>
                <StarRating value={worker.rating || 0} showValue count={worker.reviewCount} />
                <div className="flex flex-wrap items-center gap-2">
                  <VerificationBadge verified={worker.verified} />
                  {worker.level && <LevelBadge level={worker.level} />}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {worker.coverageZone && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {worker.coverageZone}</span>}
                  {typeof worker.hourlyRate === "number" && worker.hourlyRate > 0 && (
                    <span><span className="font-semibold text-foreground">${worker.hourlyRate.toLocaleString()}</span> / hora</span>
                  )}
                </div>
                {worker.bio && <p className="pt-1 text-sm">{worker.bio}</p>}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-success-light/60 p-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-success" style={{ width: `${score}%` }} />
              </div>
              <span className="text-sm font-semibold text-success">{score}% · {trustLabel(score)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Seguro y vigencia */}
        <h2 className="mt-8 flex items-center gap-2 text-lg font-semibold"><ShieldCheck className="h-5 w-5 text-success" /> Seguro y vigencia</h2>
        <Card className="mt-3">
          <CardContent className="divide-y p-0">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center gap-3 px-4 py-3">
                {c.ok ? <CheckCircle2 className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-muted-foreground" />}
                <span className={c.ok ? "text-sm" : "text-sm text-muted-foreground"}>{c.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Servicios */}
        {services.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold">Servicios</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {services.map((s) => (
                <Card key={s.id} className="overflow-hidden">
                  <div className="h-32 w-full overflow-hidden border-b"><ServiceThumb image={s.images?.[0]} category={s.category} /></div>
                  <CardContent className="space-y-1 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{s.title}</h3>
                      <span className="shrink-0 font-bold">${s.price.toLocaleString()}</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                    <p className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {s.duration}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Historial */}
        {history.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold">Historial de trabajos ({history.length})</h2>
            <div className="mt-3 space-y-3">
              {history.map((j) => (
                <Card key={j.id}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                    <span className="flex-1 font-medium">{j.title}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{j.category}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Reseñas */}
        {reviews.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold">Reseñas ({reviews.length})</h2>
            <div className="mt-3 space-y-3">
              {reviews.map((r) => {
                const author = store.getUser(r.authorId);
                return (
                  <Card key={r.id}>
                    <CardContent className="space-y-1 p-4">
                      <div className="flex items-center justify-between"><span className="font-medium">{author?.name || "Usuario"}</span><StarRating value={r.stars} size={13} /></div>
                      {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* CTA fijo */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-card/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
          <p className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <Lock className="h-4 w-4" /> Registrate para contactar y contratar a {worker.name.split(" ")[0]}.
          </p>
          <Button className="w-full sm:w-auto" onClick={register}>Registrarme para solicitar</Button>
        </div>
      </div>
    </div>
  );
}

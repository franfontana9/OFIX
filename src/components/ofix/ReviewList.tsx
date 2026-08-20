import { useReducer, useState } from "react";
import { Flag, MessageSquare, Reply, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "./EmptyState";
import { StarRating } from "./StarRating";
import { UserAvatar } from "./UserAvatar";
import { store } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

// Reseñas con sello de verificación, derecho a réplica y reporte.
// Cierra tres miedos de las entrevistas: reseñas falsas (E2), quedar expuesto
// sin voz a una crítica pública (E4) y reseñas injustas (E5).

const VERIFIED_HINT = "Proviene de un trabajo pagado en OFIX";
type StarBucket = 1 | 2 | 3 | 4 | 5;

function fecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
}

export function ReviewList({ targetId, className }: { targetId: string; className?: string }) {
  const { user } = useAuth();
  const [, refresh] = useReducer((x) => x + 1, 0);
  const [openReply, setOpenReply] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const reviews = store.getReviews({ targetId });
  const isOwner = !!user && user.id === targetId;

  const total = reviews.length;
  const verifiedCount = reviews.filter((r) => r.verified).length;
  const avg = total ? reviews.reduce((s, r) => s + r.stars, 0) / total : 0;

  const dist: Record<StarBucket, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    const bucket = Math.min(5, Math.max(1, Math.round(r.stars))) as StarBucket;
    dist[bucket] += 1;
  });
  const buckets: StarBucket[] = [5, 4, 3, 2, 1];

  const enviarRespuesta = (reviewId: string) => {
    try {
      store.replyToReview(reviewId, draft);
      toast.success("Respuesta publicada");
      setOpenReply(null);
      setDraft("");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo publicar la respuesta");
    }
  };

  const reportar = (reviewId: string) => {
    try {
      store.reportReview(reviewId);
      toast.success("Reseña reportada. El equipo de OFIX la va a revisar.");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo reportar la reseña");
    }
  };

  if (total === 0) {
    return (
      <div className={cn("space-y-3", className)}>
        <EmptyState
          icon={MessageSquare}
          title="Todavía no hay reseñas"
          description={
            isOwner
              ? "Cuando cierres tu primer trabajo en OFIX, el cliente va a poder dejar una reseña verificada acá."
              : "Este perfil todavía no recibió reseñas de trabajos cerrados en OFIX."
          }
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* ── Resumen: promedio, volumen y cuántas están verificadas ── */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-4 sm:w-52 sm:flex-col sm:items-start">
              <div>
                <p className="text-4xl font-bold leading-none">{avg.toFixed(1)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {total} {total === 1 ? "reseña" : "reseñas"}
                </p>
              </div>
              <StarRating value={avg} size={18} />
            </div>

            {/* Distribución por estrellas */}
            <div className="min-w-0 flex-1 space-y-1.5">
              {buckets.map((b) => {
                const n = dist[b];
                const pct = total ? Math.round((n / total) * 100) : 0;
                return (
                  <div key={b} className="flex items-center gap-2">
                    <span className="flex w-8 shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
                      {b}
                      <Star className="h-3 w-3 fill-accent text-accent" />
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 shrink-0 text-right text-xs text-muted-foreground">{n}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sello de confianza: el antídoto a las reseñas falsas */}
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-success/25 bg-success-light/60 p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-success">
                {verifiedCount} de {total} verificadas
              </p>
              <p className="text-xs text-muted-foreground">
                Una reseña verificada solo la puede dejar quien contrató y pagó el trabajo dentro de OFIX.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Reseñas ── */}
      <div className="space-y-3">
        {reviews.map((r) => {
          const autor = store.getUser(r.authorId);
          const nombre = autor?.name || "Usuario de OFIX";
          const puedeResponder = isOwner && !r.reply;
          const respondiendo = openReply === r.id;

          return (
            <Card key={r.id}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <UserAvatar name={nombre} photo={autor?.photo} className="h-11 w-11 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{nombre}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                          <StarRating value={r.stars} size={14} />
                          <span className="text-xs text-muted-foreground">{fecha(r.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {r.verified ? (
                          <Badge variant="success" className="gap-1" title={VERIFIED_HINT}>
                            <ShieldCheck className="h-3 w-3" />
                            Reseña verificada
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1" title="No pudimos vincularla a un pago en OFIX">
                            Sin verificar
                          </Badge>
                        )}
                        {r.verified && <span className="text-[11px] text-muted-foreground">de un trabajo pagado en OFIX</span>}
                      </div>
                    </div>

                    {r.comment && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{r.comment}</p>}

                    {/* Derecho a réplica ya ejercido */}
                    {r.reply && (
                      <div className="mt-3 rounded-r-lg border-l-2 border-primary bg-muted/50 py-2.5 pl-3 pr-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                            <Reply className="h-3.5 w-3.5" />
                            Respuesta del profesional
                          </span>
                          <span className="text-xs text-muted-foreground">{fecha(r.reply.createdAt)}</span>
                        </div>
                        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed">{r.reply.text}</p>
                      </div>
                    )}

                    {/* Acciones del calificado: responder una vez y reportar */}
                    {isOwner && (
                      <div className="mt-3 border-t pt-3">
                        {respondiendo ? (
                          <div className="space-y-2">
                            <Textarea
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              placeholder="Contá tu versión con respeto. Se publica una sola vez y queda visible junto a la reseña."
                              className="min-h-[84px] text-sm"
                              autoFocus
                            />
                            <div className="flex flex-wrap items-center gap-2">
                              <Button size="sm" onClick={() => enviarRespuesta(r.id)} disabled={!draft.trim()}>
                                <Reply className="mr-1.5 h-4 w-4" />
                                Responder
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setOpenReply(null);
                                  setDraft("");
                                }}
                              >
                                Cancelar
                              </Button>
                              <span className="text-xs text-muted-foreground">Una sola respuesta por reseña</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            {puedeResponder && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setOpenReply(r.id);
                                  setDraft("");
                                }}
                              >
                                <Reply className="mr-1.5 h-4 w-4" />
                                Responder
                              </Button>
                            )}
                            {r.reportedAt ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
                                <Flag className="h-3.5 w-3.5" />
                                Reportada el {fecha(r.reportedAt)} — en revisión
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => reportar(r.id)}
                              >
                                <Flag className="mr-1.5 h-3.5 w-3.5" />
                                Reportar
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

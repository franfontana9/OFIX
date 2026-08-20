import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { toast } from "sonner";
import { store } from "@/lib/store";

export default function WorkerAgreementReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const job = id ? store.getJob(id) : undefined;
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!job) {
    return (
      <div>
        <PageHeader title="Acuerdo no encontrado" back />
        <p className="text-muted-foreground">No pudimos encontrar este acuerdo.</p>
      </div>
    );
  }

  const client = store.getUser(job.clientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      store.createReview({ jobId: job.id, targetId: job.clientId, stars, comment });
      toast.success("¡Gracias! Tu calificación fue enviada.");
      navigate(`/w/agreements/${job.id}`);
    } catch (err) {
      toast.error((err as Error).message || "No se pudo enviar la calificación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Calificar cliente" subtitle="Contanos cómo fue tu experiencia trabajando con este cliente." back />
      <Card className="mx-auto max-w-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3">
              <UserAvatar name={client?.name || "?"} photo={client?.photo} className="h-14 w-14" />
              <div>
                <p className="font-semibold">{client?.name || "Cliente"}</p>
                <p className="text-sm text-muted-foreground">{job.title}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tu calificación</Label>
              <div className="flex items-center gap-3">
                <StarRating value={stars} onChange={setStars} size={32} />
                <span className="text-sm font-medium text-muted-foreground">{stars} de 5</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comentario</Label>
              <Textarea id="comment" rows={4} placeholder="¿Cómo fue la comunicación, el pago y el trato?" value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(`/w/agreements/${job.id}`)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 gap-2" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Enviando...</> : <><Star className="h-4 w-4" />Enviar calificación</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

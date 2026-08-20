import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { toast } from "sonner";
import { store } from "@/lib/store";

export default function UserReview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const job = id ? store.getJob(id) : undefined;
  const worker = job ? store.getWorker(job.workerId) : null;

  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!job || !worker) {
    return (
      <div>
        <PageHeader title="Calificar profesional" back />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">No encontramos este trabajo.</CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    if (stars <= 0) {
      toast.error("Elegí una calificación de 1 a 5 estrellas");
      return;
    }
    setLoading(true);
    try {
      store.createReview({ jobId: job.id, targetId: job.workerId, stars, comment });
      toast.success("¡Gracias por tu reseña!");
      navigate(`/u/jobs/${job.id}`);
    } catch (err) {
      toast.error((err as Error).message || "No se pudo enviar la reseña");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Calificar profesional" subtitle="Tu opinión ayuda a otros usuarios" back />

      <Card className="mx-auto max-w-lg">
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <UserAvatar name={worker.name} photo={worker.photo} className="h-16 w-16" />
            <div>
              <h3 className="font-semibold">{worker.name}</h3>
              <p className="text-sm text-muted-foreground">{worker.trade}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Label>¿Cómo fue tu experiencia?</Label>
            <StarRating value={stars} onChange={setStars} size={32} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comentario</Label>
            <Textarea
              id="comment"
              rows={4}
              placeholder="Contá cómo fue el trabajo, la puntualidad, la calidad..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => navigate(-1)} disabled={loading}>
              Cancelar
            </Button>
            <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={loading}>
              <Send className="h-4 w-4" />
              Enviar reseña
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

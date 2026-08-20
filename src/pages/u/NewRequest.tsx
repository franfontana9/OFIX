import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PageHeader } from "@/components/ofix/PageHeader";
import { ImageUploader } from "@/components/ofix/ImageUploader";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { CATEGORIES, URGENCY_LABELS, type Urgency } from "@/lib/types";

export default function NewRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    urgency: "en_el_dia" as Urgency,
    scheduledDate: "",
    location: user?.zone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.title || !form.description || !form.category || !form.budget || !form.location)
        throw new Error("Por favor completá todos los campos");
      const budget = parseFloat(form.budget);
      if (isNaN(budget) || budget <= 0) throw new Error("El presupuesto debe ser mayor a 0");
      if (form.urgency === "programada" && !form.scheduledDate) throw new Error("Elegí una fecha para el trabajo programado");
      const offer = store.createOffer({
        authorId: user!.id,
        title: form.title,
        description: form.description,
        category: form.category,
        budget,
        urgency: form.urgency,
        scheduledDate: form.urgency === "programada" ? form.scheduledDate : undefined,
        location: form.location,
        geo: user?.geo,
        images,
        emergency: false,
        status: "abierta",
      });
      toast.success("¡Solicitud publicada! Vas a recibir propuestas pronto.");
      navigate(`/u/requests/${offer.id}`);
    } catch (err) {
      toast.error((err as Error).message || "Error al crear la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Nueva solicitud" subtitle="Describí tu urgencia y recibí propuestas de trabajadores verificados" back />
      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" placeholder="Ej: Reparación de pérdida de agua" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del problema *</Label>
              <Textarea id="description" placeholder="Describí en detalle el trabajo que necesitás..." rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label>Fotos (opcional)</Label>
              <ImageUploader images={images} onChange={setImages} max={4} />
              <p className="text-xs text-muted-foreground">Ayudan al profesional a cotizar mejor.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">Nivel de urgencia *</Label>
                <Select value={form.urgency} onValueChange={(v) => setForm({ ...form, urgency: v as Urgency })}>
                  <SelectTrigger id="urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(URGENCY_LABELS) as Urgency[]).map((u) => (
                      <SelectItem key={u} value={u}>{URGENCY_LABELS[u]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.urgency === "programada" && (
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Fecha del trabajo *</Label>
                <Input id="scheduledDate" type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget">Presupuesto estimado (ARS) *</Label>
                <Input id="budget" type="number" placeholder="5000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} required min="1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación *</Label>
                <Input id="location" placeholder="Ej: Palermo, CABA" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/u/home")} className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Publicando...</>) : "Publicar solicitud"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

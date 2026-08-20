import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PageHeader } from "@/components/ofix/PageHeader";
import { ImageUploader } from "@/components/ofix/ImageUploader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";

export default function WorkerNewService() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    category: user?.trades?.[0] || user?.trade || "",
    description: "",
    price: "",
    duration: "",
    schedule: "",
    withUrgency: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.title || !form.category || !form.description || !form.price || !form.duration)
        throw new Error("Completá todos los campos obligatorios");
      const price = parseFloat(form.price);
      if (isNaN(price) || price <= 0) throw new Error("El precio debe ser mayor a 0");
      store.createService({
        workerId: user!.id,
        title: form.title,
        category: form.category,
        description: form.description,
        price,
        duration: form.duration,
        schedule: form.schedule || undefined,
        withUrgency: form.withUrgency,
        images,
        active: true,
      });
      toast.success("¡Servicio publicado!");
      navigate("/w/services");
    } catch (err) {
      toast.error((err as Error).message || "Error al publicar el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Publicar servicio" subtitle="Describí tu servicio para que los clientes te encuentren." back />
      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título del servicio *</Label>
              <Input id="title" placeholder="Ej: Reparación de pérdidas de agua" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

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
              <Label htmlFor="description">Descripción *</Label>
              <Textarea id="description" rows={4} placeholder="Detallá qué incluye el servicio, garantías, materiales..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Precio (ARS) *</Label>
                <Input id="price" type="number" min="1" placeholder="3500" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración estimada *</Label>
                <Input id="duration" placeholder="Ej: 2-3 horas" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Horarios de atención</Label>
              <Input id="schedule" placeholder="Ej: Lun a Vie 9-18hs" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Fotos del trabajo</Label>
              <ImageUploader images={images} onChange={setImages} max={4} />
              <p className="text-xs text-muted-foreground">Mostrá fotos de trabajos anteriores para generar confianza.</p>
            </div>

            <button
              type="button"
              onClick={() => setForm({ ...form, withUrgency: !form.withUrgency })}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors",
                form.withUrgency ? "border-destructive/50 bg-destructive/5" : "hover:bg-muted/50",
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", form.withUrgency ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground")}>
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Atiendo urgencias</p>
                  <p className="text-xs text-muted-foreground">Recibí solicitudes de emergencia para este servicio.</p>
                </div>
              </div>
              <span className={cn("h-6 w-11 rounded-full p-0.5 transition-colors", form.withUrgency ? "bg-destructive" : "bg-muted-foreground/30")}>
                <span className={cn("block h-5 w-5 rounded-full bg-white transition-transform", form.withUrgency && "translate-x-5")} />
              </span>
            </button>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/w/services")} className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Publicando...</>) : "Publicar servicio"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

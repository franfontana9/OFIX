import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";

// Botón SOS: crea una solicitud inmediata y notifica trabajadores cercanos.
export function EmergencyButton({ className, full }: { className?: string; full?: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(user?.zone || user?.address || "");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!category) return toast.error("Elegí una categoría");
    if (!location) return toast.error("Indicá tu ubicación");
    const { offer, notified } = store.createEmergency({
      category,
      description,
      location,
      geo: user?.geo,
    });
    toast.success(`Emergencia enviada. Avisamos a ${notified} profesional(es) cercano(s).`);
    setOpen(false);
    navigate(`/u/emergency/${offer.id}`);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="destructive"
        size="lg"
        className={cn("gap-2 font-semibold", full && "w-full", className)}
      >
        <Siren className="h-5 w-5" />
        Emergencia
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Siren className="h-5 w-5" />
              Pedir emergencia
            </DialogTitle>
            <DialogDescription>
              Buscamos y avisamos a los profesionales verificados más cercanos disponibles ahora.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>¿Qué necesitás?</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej: Palermo, CABA" />
            </div>
            <div className="space-y-2">
              <Label>Detalle (opcional)</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Contá brevemente qué pasa" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleSubmit} className="gap-2">
              <Siren className="h-4 w-4" />
              Enviar emergencia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

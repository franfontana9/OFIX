import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store } from "@/lib/store";
import type { Job } from "@/lib/types";

// Valor para <input type="datetime-local"> (necesita hora local, sin zona).
function toLocalInput(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Reprograma un trabajo. Lo usan las dos agendas (cliente y trabajador).
export function RescheduleDialog({
  job,
  open,
  onOpenChange,
  onDone,
}: {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone?: () => void;
}) {
  const [value, setValue] = useState(() => toLocalInput(job.scheduledAt));
  const [saving, setSaving] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) {
      toast.error("Elegí una fecha y hora");
      return;
    }
    setSaving(true);
    try {
      store.rescheduleJob(job.id, new Date(value).toISOString());
      toast.success("Trabajo reprogramado. Avisamos a la otra parte.");
      onOpenChange(false);
      onDone?.();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo reprogramar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Reprogramar trabajo
          </DialogTitle>
          <DialogDescription>
            «{job.title}». La otra parte recibe una notificación con la nueva fecha.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reschedule-at">Nueva fecha y hora</Label>
            <Input
              id="reschedule-at"
              type="datetime-local"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
            {job.scheduledAt && (
              <p className="text-xs text-muted-foreground">
                Fecha actual:{" "}
                {new Date(job.scheduledAt).toLocaleString("es-AR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Reprogramar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

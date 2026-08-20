import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, CalendarClock, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { Calendar } from "@/components/ofix/Calendar";
import { RescheduleDialog } from "@/components/ofix/RescheduleDialog";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { JobStatusBadge } from "@/components/ofix/badges";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import type { Job } from "@/lib/types";

function formatDate(iso?: string) {
  if (!iso) return "Sin fecha";
  return new Date(iso).toLocaleString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserAgenda() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, refresh] = useReducer((x) => x + 1, 0);
  const [editing, setEditing] = useState<Job | null>(null);

  const agenda = user ? store.getAgenda(user.id) : [];

  const now = Date.now();
  const upcoming = agenda.filter((j) => j.scheduledAt && new Date(j.scheduledAt).getTime() >= now);
  const past = agenda.filter((j) => j.scheduledAt && new Date(j.scheduledAt).getTime() < now);

  const handleCancel = (job: Job) => {
    if (!window.confirm(`¿Cancelar "${job.title}"? Si ya pagaste, se reembolsa el pago retenido.`)) return;
    try {
      store.cancelJob(job.id);
      toast.success("Trabajo cancelado");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo cancelar");
    }
  };

  const JobRow = ({ job }: { job: Job }) => {
    const worker = store.getWorker(job.workerId);
    // Solo los trabajos abiertos se pueden mover o cancelar.
    const editable = job.status === "agendado" || job.status === "en_progreso";
    return (
      <Card className="transition-shadow hover:shadow-lg">
        <CardContent className="space-y-3 p-4">
          <div
            className="flex cursor-pointer items-center gap-4"
            onClick={() => navigate(`/u/jobs/${job.id}`)}
          >
            <UserAvatar name={worker?.name || "?"} photo={worker?.photo} className="h-12 w-12 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="truncate font-semibold">{job.title}</h3>
                <JobStatusBadge status={job.status} />
              </div>
              <p className="truncate text-sm text-muted-foreground">{worker?.name || "Profesional"}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs capitalize text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(job.scheduledAt)}
              </p>
            </div>
          </div>

          {editable && (
            <div className="flex flex-wrap gap-2 border-t pt-3">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditing(job)}>
                <CalendarClock className="h-4 w-4" />
                Reprogramar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive"
                onClick={() => handleCancel(job)}
              >
                <XCircle className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Agenda" subtitle="Tus trabajos agendados. Podés reprogramarlos o cancelarlos." />

      {agenda.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold">No tenés trabajos agendados</p>
              <p className="text-sm text-muted-foreground">Cuando aceptes una propuesta con fecha, va a aparecer acá.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Calendar
            events={agenda
              .filter((j) => j.scheduledAt)
              .map((j) => ({ id: j.id, title: j.title, date: j.scheduledAt!, status: j.status }))}
            onSelect={(id) => navigate(`/u/jobs/${id}`)}
          />

          {upcoming.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Próximos</h2>
              <div className="space-y-3">
                {upcoming.map((j) => (
                  <JobRow key={j.id} job={j} />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Pasados</h2>
              <div className="space-y-3">
                {past.map((j) => (
                  <JobRow key={j.id} job={j} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {editing && (
        <RescheduleDialog
          key={editing.id}
          job={editing}
          open
          onOpenChange={(o) => !o && setEditing(null)}
          onDone={refresh}
        />
      )}
    </div>
  );
}

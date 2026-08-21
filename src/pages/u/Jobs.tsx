import { useNavigate } from "react-router-dom";
import { Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ofix/PageHeader";
import { EmptyState } from "@/components/ofix/EmptyState";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { JobStatusBadge } from "@/components/ofix/badges";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { isJobActive, type Job, type JobStatus } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString()}`;

export default function UserJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const jobs = store.getJobs({ clientId: user?.id });

  const activos = jobs.filter((j) => isJobActive(j.status));
  const completados = jobs.filter((j) => j.status === "completado");
  const cancelados = jobs.filter((j) => j.status === "cancelado");

  return (
    <div className="space-y-6">
      <PageHeader title="Mis trabajos" subtitle="Seguí tus acuerdos y validá los trabajos realizados" />

      <Tabs defaultValue="activos">
        <TabsList>
          <TabsTrigger value="activos">Activos ({activos.length})</TabsTrigger>
          <TabsTrigger value="completados">Completados ({completados.length})</TabsTrigger>
          <TabsTrigger value="cancelados">Cancelados ({cancelados.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="activos" className="mt-4">
          <JobList jobs={activos} onOpen={(id) => navigate(`/u/jobs/${id}`)} onEmptyAction={() => navigate("/u/requests")} />
        </TabsContent>
        <TabsContent value="completados" className="mt-4">
          <JobList jobs={completados} onOpen={(id) => navigate(`/u/jobs/${id}`)} onEmptyAction={() => navigate("/u/requests")} />
        </TabsContent>
        <TabsContent value="cancelados" className="mt-4">
          <JobList jobs={cancelados} onOpen={(id) => navigate(`/u/jobs/${id}`)} onEmptyAction={() => navigate("/u/requests")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function JobList({ jobs, onOpen, onEmptyAction }: { jobs: Job[]; onOpen: (id: string) => void; onEmptyAction: () => void }) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Todavía no tenés trabajos"
        description="Cuando aceptes una propuesta y pagues, tus trabajos aparecen acá."
        action={<Button onClick={onEmptyAction}>Ver mis solicitudes</Button>}
      />
    );
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onClick={() => onOpen(job.id)} />
      ))}
    </div>
  );
}

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const worker = store.getWorker(job.workerId);
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={onClick}>
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-semibold">{job.title}</h3>
          <JobStatusBadge status={job.status as JobStatus} />
        </div>
        <div className="flex items-center gap-3">
          <UserAvatar name={worker?.name || "?"} photo={worker?.photo} className="h-10 w-10" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{worker?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{job.category}</p>
          </div>
          <span className="font-semibold">{money(job.amount)}</span>
        </div>
        {job.scheduledAt && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(job.scheduledAt).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

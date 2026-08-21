import { useNavigate } from "react-router-dom";
import { Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ofix/PageHeader";
import { EmptyState } from "@/components/ofix/EmptyState";
import { JobStatusBadge } from "@/components/ofix/badges";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { isJobActive, type Job, type JobStatus } from "@/lib/types";

export default function WorkerAgreements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const jobs = store.getJobs({ workerId: user!.id });

  const activos = jobs.filter((j) => isJobActive(j.status));
  const completados = jobs.filter((j) => j.status === "completado");
  const cancelados = jobs.filter((j) => j.status === "cancelado");

  return (
    <div>
      <PageHeader title="Mis acuerdos" subtitle="Trabajos que acordaste con tus clientes y su seguimiento." />

      <Tabs defaultValue="activos">
        <TabsList>
          <TabsTrigger value="activos">Activos ({activos.length})</TabsTrigger>
          <TabsTrigger value="completados">Completados ({completados.length})</TabsTrigger>
          <TabsTrigger value="cancelados">Cancelados ({cancelados.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="activos" className="mt-6">
          <JobList jobs={activos} onOpen={(id) => navigate(`/w/agreements/${id}`)} onEmptyAction={() => navigate("/w/jobs")} />
        </TabsContent>
        <TabsContent value="completados" className="mt-6">
          <JobList jobs={completados} onOpen={(id) => navigate(`/w/agreements/${id}`)} onEmptyAction={() => navigate("/w/jobs")} />
        </TabsContent>
        <TabsContent value="cancelados" className="mt-6">
          <JobList jobs={cancelados} onOpen={(id) => navigate(`/w/agreements/${id}`)} onEmptyAction={() => navigate("/w/jobs")} />
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
        title="Todavía no tenés acuerdos"
        description="Cuando un cliente acepte tu propuesta, el trabajo aparece acá."
        action={<Button onClick={onEmptyAction}>Buscar trabajos</Button>}
      />
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} onClick={() => onOpen(j.id)} />
      ))}
    </div>
  );
}

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const client = store.getUser(job.clientId);
  const dateLabel = (job.status as JobStatus) === "completado" && job.completedAt ? job.completedAt : job.scheduledAt || job.createdAt;
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={onClick}>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold">{job.title}</h3>
          <JobStatusBadge status={job.status} />
        </div>
        <p className="text-sm text-muted-foreground">Cliente: {client?.name || "—"}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(dateLabel).toLocaleDateString("es-AR")}
          </span>
          <span className="font-semibold">${job.amount.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

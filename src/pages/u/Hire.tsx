import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Check, ShieldOff, ShieldCheck, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { StarRating } from "@/components/ofix/StarRating";
import { VerificationBadge } from "@/components/ofix/badges";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { INSURANCE_PLANS } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString()}`;

export default function UserHire() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id: offerId } = useParams();
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get("job");

  const job = useMemo(() => {
    if (jobIdParam) return store.getJob(jobIdParam);
    return store.getJobs({ clientId: user?.id }).find((j) => j.offerId === offerId);
  }, [jobIdParam, offerId, user?.id]);

  const worker = job ? store.getWorker(job.workerId) : null;

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  if (!job || !worker) {
    return (
      <div>
        <PageHeader title="Confirmar contratación" back />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No encontramos el trabajo asociado a esta contratación.
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePay = () => {
    navigate(`/u/pay/${job.id}?ins=${selectedPlan || ""}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Confirmar contratación" subtitle="Revisá los datos y elegí una cobertura antes de pagar" back />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Datos del trabajador */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datos del trabajador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <UserAvatar name={worker.name} photo={worker.photo} className="h-14 w-14" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{worker.name}</h3>
                  <VerificationBadge verified={worker.verified} />
                </div>
                <p className="text-sm text-muted-foreground">{worker.trade}</p>
                <StarRating value={worker.rating || 0} size={14} showValue count={worker.reviewCount} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos de la operación */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datos de la operación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Trabajo" value={job.title} />
            <Row label="Categoría" value={job.category} icon={<Tag className="h-4 w-4 text-muted-foreground" />} />
            {job.scheduledAt && (
              <Row
                label="Fecha"
                value={new Date(job.scheduledAt).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
              />
            )}
            <div className="my-1 border-t" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Monto acordado</span>
              <span className="text-lg font-bold">{money(job.amount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Seguro del servicio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Seguro del servicio (opcional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              type="button"
              onClick={() => setSelectedPlan(null)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                selectedPlan === null ? "border-primary bg-primary-light" : "hover:border-primary/40",
              )}
            >
              <ShieldOff className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Sin seguro</p>
                <p className="text-sm text-muted-foreground">Contratás sin cobertura adicional.</p>
              </div>
              <span className="font-semibold">$0</span>
            </button>

            {INSURANCE_PLANS.map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                    active ? "border-primary bg-primary-light" : "hover:border-primary/40",
                  )}
                >
                  <ShieldCheck className={cn("mt-0.5 h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                  <div className="flex-1">
                    <p className="font-medium">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">{plan.coverage}</p>
                  </div>
                  <span className="font-semibold">{money(plan.cost)}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Términos */}
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <span className="text-sm">
            Acepto los <span className="font-medium text-primary">términos y condiciones</span> del servicio y la política de fondos en garantía de OFIX Connect.
          </span>
        </label>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button className="flex-1 gap-2" disabled={!accepted} onClick={handlePay}>
            <Check className="h-4 w-4" />
            Ir a pagar
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-1.5 text-right font-medium">
        {icon}
        {value}
      </span>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CreditCard, Banknote, Landmark, Loader2, ShieldCheck, Lock, Wallet, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { PriceBreakdown } from "@/components/ofix/PriceBreakdown";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { store } from "@/lib/store";
import { INSURANCE_PLANS, PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/lib/types";

const METHOD_ICONS: Record<PaymentMethod, typeof CreditCard> = {
  mercadopago: CreditCard,
  transferencia: Landmark,
  efectivo: Banknote,
};

export default function UserPay() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const insId = searchParams.get("ins") || "";

  const job = jobId ? store.getJob(jobId) : undefined;
  const plan = insId ? INSURANCE_PLANS.find((p) => p.id === insId) : undefined;

  const [method, setMethod] = useState<PaymentMethod>("mercadopago");
  const [loading, setLoading] = useState(false);

  if (!job) {
    return (
      <div>
        <PageHeader title="Método de pago" back />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">No encontramos el trabajo a pagar.</CardContent>
        </Card>
      </div>
    );
  }

  const handleConfirm = () => {
    setLoading(true);
    try {
      store.createPayment({ jobId: job.id, method, insurancePlanId: insId || undefined });
      toast.success("Pago realizado. Fondos en garantía hasta que valides el trabajo.");
      navigate(`/u/jobs/${job.id}`);
    } catch (err) {
      toast.error((err as Error).message || "No se pudo procesar el pago");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Método de pago" subtitle="Elegí cómo querés pagar. Los fondos quedan en garantía." back />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Bloque destacado: pago protegido (escrow) */}
        <Card className="border-primary/30 bg-primary-light">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-primary">🔒 Pago protegido</p>
                <p className="text-sm text-foreground/80">
                  Retenemos tu pago en garantía y se lo liberamos al profesional recién cuando validás que el trabajo está bien hecho.
                </p>
              </div>
            </div>

            {/* Mini línea de tiempo del dinero */}
            <div className="flex items-center gap-1.5 overflow-x-auto rounded-lg bg-background/60 p-3 text-xs">
              {[
                { icon: Wallet, label: "Pagás" },
                { icon: Lock, label: "En garantía (OFIX)" },
                { icon: CheckCircle2, label: "Validás" },
                { icon: ArrowRight, label: "Se libera" },
              ].map((step, i, arr) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center gap-1.5">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="whitespace-nowrap font-medium text-foreground/70">{step.label}</span>
                    </div>
                    {i < arr.length - 1 && <span className="mb-4 text-primary/40">→</span>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datos del pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => {
              const Icon = METHOD_ICONS[m];
              const active = method === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                    active ? "border-primary bg-primary-light" : "hover:border-primary/40",
                  )}
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="flex-1 font-medium">{PAYMENT_METHOD_LABELS[m]}</span>
                  <span className={cn("h-4 w-4 rounded-full border", active ? "border-primary bg-primary" : "border-muted-foreground/40")} />
                </button>
              );
            })}
            {method === "efectivo" && (
              <p className="text-xs text-muted-foreground">El pago en efectivo se coordina con el profesional al finalizar el trabajo.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PriceBreakdown gross={job.amount} commission={Math.round(job.amount * 0.15)} insuranceCost={plan?.cost || 0} />
            <div className="flex items-start gap-2 rounded-lg bg-success-light p-3 text-sm text-success">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Tu dinero queda retenido por OFIX y se libera al profesional recién cuando validás el trabajo.</span>
            </div>

            {/* Sellos de confianza */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CreditCard className="h-4 w-4 text-primary" /> Procesado con Mercado Pago
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Lock className="h-4 w-4 text-success" /> Datos cifrados
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-success" /> Garantía OFIX
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate(-1)} disabled={loading}>
            Cancelar
          </Button>
          <Button className="flex-1 gap-2" onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Pagar de forma protegida
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

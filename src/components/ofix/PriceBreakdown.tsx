import { cn } from "@/lib/utils";

// Desglose de precio con comisión de servicio (cobrada al cliente) y seguro.
// `net` responde a la pregunta textual de la entrevista 1: «se pregunta qué
// porcentaje del dinero le llega realmente al trabajador».
export function PriceBreakdown({
  gross,
  commission,
  insuranceCost = 0,
  surcharge = 0,
  net,
  className,
}: {
  gross: number;
  commission: number;
  insuranceCost?: number;
  surcharge?: number;
  net?: number;
  className?: string;
}) {
  const total = gross + commission + insuranceCost + surcharge;
  const money = (n: number) => `$${n.toLocaleString("es-AR")}`;
  return (
    <div className={cn("space-y-2 text-sm", className)}>
      <Row label="Monto del trabajo" value={money(gross)} />
      {surcharge > 0 && <Row label="Recargo por guardia (fin de semana)" value={money(surcharge)} muted />}
      <Row label="Comisión de servicio OFIX" value={money(commission)} muted />
      {insuranceCost > 0 && <Row label="Seguro del servicio" value={money(insuranceCost)} muted />}
      <div className="my-2 border-t" />
      <Row label="Total a pagar" value={money(total)} bold />

      {typeof net === "number" && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-success-light p-3 text-xs text-success">
          <span className="font-semibold">Transparencia:</span>
          <span className="text-foreground/80">
            El profesional recibe <strong className="text-success">{money(net)}</strong> —{" "}
            {Math.round((net / total) * 100)}% de lo que pagás. La comisión de OFIX cubre el pago protegido,
            la verificación y el soporte.
          </span>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn(muted && "text-muted-foreground", bold && "font-semibold")}>{label}</span>
      <span className={cn(bold ? "text-lg font-bold" : "font-medium")}>{value}</span>
    </div>
  );
}

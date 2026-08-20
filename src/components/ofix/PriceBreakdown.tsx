import { cn } from "@/lib/utils";

// Desglose de precio con comisión de servicio (cobrada al cliente) y seguro.
export function PriceBreakdown({
  gross,
  commission,
  insuranceCost = 0,
  className,
}: {
  gross: number;
  commission: number;
  insuranceCost?: number;
  className?: string;
}) {
  const total = gross + commission + insuranceCost;
  const money = (n: number) => `$${n.toLocaleString()}`;
  return (
    <div className={cn("space-y-2 text-sm", className)}>
      <Row label="Monto del trabajo" value={money(gross)} />
      <Row label="Comisión de servicio OFIX" value={money(commission)} muted />
      {insuranceCost > 0 && <Row label="Seguro del servicio" value={money(insuranceCost)} muted />}
      <div className="my-2 border-t" />
      <Row label="Total a pagar" value={money(total)} bold />
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

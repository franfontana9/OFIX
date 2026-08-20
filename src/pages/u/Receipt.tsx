import { useNavigate, useParams } from "react-router-dom";
import { Printer, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { store } from "@/lib/store";
import { PAYMENT_METHOD_LABELS, type PaymentStatus } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

const STATUS_LABELS: Record<PaymentStatus, string> = {
  pendiente: "Pendiente de pago",
  retenido: "Pagado — retenido en garantía",
  liberado: "Pagado y liberado",
  reembolsado: "Reembolsado",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <p className="text-sm">
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium">{value}</span>
    </p>
  );
}

export default function UserReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const receipt = id ? store.getReceipt(id) : null;

  if (!receipt) {
    return (
      <div>
        <PageHeader title="Comprobante" back />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold">Todavía no hay comprobante</p>
              <p className="text-sm text-muted-foreground">
                El comprobante se emite cuando se registra el pago del trabajo.
              </p>
            </div>
            {id && (
              <Button variant="outline" onClick={() => navigate(`/u/jobs/${id}`)}>
                Ver el trabajo
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="print-hide">
        <PageHeader
          title="Comprobante"
          subtitle={`${receipt.number} · ${formatDate(receipt.issuedAt)}`}
          back
          action={
            <Button className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Imprimir / PDF
            </Button>
          }
        />
      </div>

      {/* Hoja del comprobante — lo único que sale en la impresión. */}
      <div className="print-sheet mx-auto max-w-2xl rounded-xl border bg-card p-6 sm:p-8">
        {/* Encabezado */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-primary">OFIX</p>
            <p className="text-xs text-muted-foreground">Tu solución confiable, a un clic</p>
            <p className="mt-2 text-xs text-muted-foreground">
              OFIX actúa como intermediario entre el cliente y el profesional. No es empleador.
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border-2 border-foreground text-lg font-bold">
              {receipt.kind}
            </span>
            <p className="mt-2 text-sm font-semibold">{receipt.number}</p>
            <p className="text-xs text-muted-foreground">Emitido: {formatDate(receipt.issuedAt)}</p>
            {receipt.paidAt && <p className="text-xs text-muted-foreground">Liberado: {formatDate(receipt.paidAt)}</p>}
          </div>
        </div>

        {/* Partes */}
        <div className="grid gap-6 border-b py-5 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cliente</p>
            <p className="font-semibold">{receipt.client.name}</p>
            <Field label="Condición" value={receipt.client.detail} />
            <Field label="Email" value={receipt.client.email} />
            <Field label="Teléfono" value={receipt.client.phone} />
            <Field label="Domicilio" value={receipt.client.address} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Profesional</p>
            <p className="font-semibold">{receipt.worker.name}</p>
            <Field label="Oficio" value={receipt.worker.detail} />
            <Field label="Email" value={receipt.worker.email} />
            <Field label="Teléfono" value={receipt.worker.phone} />
            <Field label="Zona" value={receipt.worker.address} />
          </div>
        </div>

        {/* Detalle */}
        <div className="border-b py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Detalle</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Concepto</th>
                <th className="pb-2 text-right font-medium">Importe</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b last:border-0">
                <td className="py-2.5">
                  <span className="font-medium">{receipt.concept}</span>
                  <span className="block text-xs text-muted-foreground">{receipt.category}</span>
                </td>
                <td className="py-2.5 text-right font-medium">{money(receipt.gross)}</td>
              </tr>
              <tr className="border-b last:border-0">
                <td className="py-2.5 text-muted-foreground">Comisión de servicio OFIX (15%)</td>
                <td className="py-2.5 text-right">{money(receipt.commission)}</td>
              </tr>
              {receipt.insuranceCost > 0 && (
                <tr>
                  <td className="py-2.5 text-muted-foreground">
                    Seguro del servicio
                    {receipt.insuranceName && <span className="block text-xs">{receipt.insuranceName}</span>}
                  </td>
                  <td className="py-2.5 text-right">{money(receipt.insuranceCost)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex flex-wrap items-end justify-between gap-4 py-5">
          <div className="space-y-1 text-sm">
            <Field label="Medio de pago" value={PAYMENT_METHOD_LABELS[receipt.method]} />
            <Field label="Estado" value={STATUS_LABELS[receipt.status]} />
            <Field label="Trabajo" value={receipt.jobId} />
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
            <p className="text-3xl font-bold">{money(receipt.total)}</p>
          </div>
        </div>

        {/* Pie */}
        <div className="flex items-start gap-2 rounded-lg bg-success-light p-3 text-xs text-success">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Pago gestionado con garantía OFIX: los fondos se liberan al profesional una vez que el cliente valida el
            trabajo. Documento generado automáticamente, sin valor fiscal en esta versión de demostración.
          </span>
        </div>
      </div>

      <div className="print-hide mx-auto flex max-w-2xl gap-3">
        <Button variant="outline" className="flex-1" onClick={() => navigate(`/u/jobs/${receipt.jobId}`)}>
          Volver al trabajo
        </Button>
        <Button className="flex-1 gap-2" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Imprimir / PDF
        </Button>
      </div>
    </div>
  );
}

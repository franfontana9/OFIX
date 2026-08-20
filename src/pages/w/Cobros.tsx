import { useState } from "react";
import { DollarSign, Wallet, TrendingUp, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StatCard } from "@/components/ofix/StatCard";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

export default function WorkerCobros() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);

  // tick fuerza re-lectura del store tras un retiro.
  void tick;
  const summary = store.getWalletSummary(user!.id);
  const payouts = store.getPayouts(user!.id);

  const handleWithdraw = () => {
    if (summary.available <= 0) return;
    try {
      const total = store.withdrawFunds();
      toast.success(`Retiraste $${total.toLocaleString()} a tu CBU/MP (sin comisión)`);
      setTick((t) => t + 1);
    } catch (err) {
      toast.error((err as Error).message || "No se pudo procesar el retiro");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Cobros" subtitle="Tu billetera OFIX. Retirá tus ganancias sin comisión." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={TrendingUp} label="Total ganado" value={`$${summary.totalEarned.toLocaleString()}`} tone="primary" />
        <StatCard icon={Wallet} label="Disponible para retirar" value={`$${summary.available.toLocaleString()}`} tone="success" />
        <StatCard icon={CheckCircle2} label="Ya retirado" value={`$${summary.withdrawn.toLocaleString()}`} tone="muted" />
      </div>

      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-sm text-primary-foreground/80">Disponible para retirar</p>
            <p className="text-3xl font-bold">${summary.available.toLocaleString()}</p>
          </div>
          <Button variant="secondary" size="lg" className="gap-2" disabled={summary.available <= 0} onClick={handleWithdraw}>
            <DollarSign className="h-5 w-5" />
            Solicitar cobro / Retirar
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Retiro sin comisión a tu CBU o alias. La acreditación puede demorar hasta 48hs hábiles.</span>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Historial de cobros</h2>
        {payouts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center text-muted-foreground">
              <Wallet className="h-10 w-10 opacity-40" />
              <p>Todavía no tenés movimientos. Cuando completes trabajos, tus cobros aparecen acá.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="hidden md:block">
              <CardTitle className="text-base">Movimientos</CardTitle>
            </CardHeader>
            <CardContent className="p-0 md:px-6 md:pb-6">
              {/* Tabla en desktop */}
              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-semibold">${p.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === "liquidado" ? "success" : "secondary"}>
                            {p.status === "liquidado" ? "Liquidado" : "Pendiente"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">CBU / MP</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(p.paidAt || p.createdAt).toLocaleDateString("es-AR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Cards en mobile */}
              <div className="flex flex-col gap-3 p-4 md:hidden">
                {payouts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-semibold">${p.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">CBU / MP · {new Date(p.paidAt || p.createdAt).toLocaleDateString("es-AR")}</p>
                    </div>
                    <Badge variant={p.status === "liquidado" ? "success" : "secondary"}>
                      {p.status === "liquidado" ? "Liquidado" : "Pendiente"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

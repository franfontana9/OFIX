import { Crown, Check, Sparkles, TrendingUp, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ofix/PageHeader";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { run } from "@/lib/run";

const BENEFITS = [
  { icon: Sparkles, title: "Perfil destacado", description: "Aparecés con una insignia Premium y sos priorizado en los resultados." },
  { icon: TrendingUp, title: "Mayor visibilidad", description: "Tus servicios se muestran primero a los clientes de tu zona." },
  { icon: Percent, title: "Menor comisión", description: "Pagás una comisión reducida por cada trabajo concretado." },
];

const PRICE = "$4.999/mes";

export default function WorkerPremium() {
  const { user, updateUser } = useAuth();
  if (!user) return null;

  const active = !!user.premium;

  const handleToggle = async () => {
    const next = !active;
    if (run(() => store.setPremium(next)) === undefined) return;
    await updateUser({ premium: next });
    toast.success(next ? "¡Premium activado! Tu perfil ahora está destacado." : "Premium desactivado.");
  };

  return (
    <div className="space-y-8">
      <PageHeader title="OFIX Premium" subtitle="Destacá tu perfil y recibí más trabajos" />

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col gap-4 bg-gradient-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/15">
              <Crown className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-bold">Plan Premium</p>
              <p className="text-sm text-primary-foreground/85">{PRICE}</p>
            </div>
          </div>
          <Badge variant={active ? "success" : "secondary"} className="w-fit">
            {active ? "Activo" : "Inactivo"}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Beneficios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="flex items-center gap-2 font-medium">
                  <Check className="h-4 w-4 text-success" />
                  {title}
                </p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {active
            ? "Tenés Premium activo. Podés desactivarlo cuando quieras."
            : `Activá Premium por ${PRICE} y potenciá tu presencia en OFIX.`}
        </p>
        <Button variant={active ? "outline" : "default"} size="lg" className="gap-2" onClick={handleToggle}>
          <Crown className="h-4 w-4" />
          {active ? "Desactivar Premium" : "Activar Premium"}
        </Button>
      </div>
    </div>
  );
}

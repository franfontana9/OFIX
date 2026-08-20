import { CheckCircle2, ShieldCheck, FileCheck, Award, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { VerificationBadge } from "@/components/ofix/badges";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import type { Verification } from "@/lib/types";

type CheckKey = keyof Verification;

const ITEMS: { key: CheckKey; icon: LucideIcon; title: string; description: string; success: string }[] = [
  {
    key: "identity",
    icon: ShieldCheck,
    title: "Identidad (DNI)",
    description: "Subí una foto de tu DNI para confirmar quién sos. Es el primer paso para generar confianza.",
    success: "Identidad verificada",
  },
  {
    key: "background",
    icon: FileCheck,
    title: "Antecedentes",
    description: "Validamos tus antecedentes penales para que los clientes te contraten tranquilos.",
    success: "Antecedentes verificados",
  },
  {
    key: "license",
    icon: Award,
    title: "Matrícula / título",
    description: "Cargá tu matrícula profesional o certificación del oficio (opcional, pero suma visibilidad).",
    success: "Matrícula verificada",
  },
];

export default function WorkerVerification() {
  const { user, updateUser } = useAuth();
  if (!user) return null;

  const verification = user.verification || { identity: false, background: false, license: false };

  const handleVerify = async (key: CheckKey, label: string) => {
    const updated = store.verifyWorker({ [key]: true } as Partial<Verification>);
    await updateUser({ verification: updated.verification, verified: updated.verified });
    toast.success(`${label} ✓`);
    if (updated.verified && !user.verified) {
      toast.success("¡Tu perfil ahora está Verificado!");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Verificación de identidad" subtitle="Tu insignia de confianza en OFIX" back />

      {/* Pilar de confianza */}
      <Card className="overflow-hidden bg-gradient-primary text-primary-foreground">
        <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
          <ShieldCheck className="h-12 w-12 shrink-0" />
          <div>
            <h2 className="text-xl font-bold">OFIX te cuida</h2>
            <p className="text-sm text-primary-foreground/85">
              La verificación es el pilar de confianza de la plataforma. Los perfiles verificados reciben más contactos y
              acceden a las solicitudes de emergencia. Completá al menos identidad y antecedentes para obtener tu insignia.
            </p>
            <div className="mt-3">
              <VerificationBadge verified={user.verified} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checks */}
      <div className="space-y-4">
        {ITEMS.map(({ key, icon: Icon, title, description, success }) => {
          const done = verification[key];
          return (
            <Card key={key}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div
                  className={
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full " +
                    (done ? "bg-success-light text-success" : "bg-primary-light text-primary")
                  }
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                {done ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    {success}
                  </span>
                ) : (
                  <Button className="shrink-0" onClick={() => handleVerify(key, title)}>
                    Verificar
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

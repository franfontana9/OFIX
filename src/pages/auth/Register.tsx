import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, User, Wrench, ShieldCheck, FileCheck, ScrollText, Home, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stepper } from "@/components/ofix/Stepper";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/types";
import type { ClientType, Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const USER_STEPS = ["Tipo de cuenta", "Datos", "Sobre vos"];
const WORKER_STEPS = ["Tipo de cuenta", "Datos", "Tu oficio", "Verificación"];

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { register, user } = useAuth();

  const initialRole = (params.get("role") as Role) === "worker" ? "worker" : "user";
  const [role, setRole] = useState<Role>(initialRole);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Paso Datos
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Cliente
  const [clientType, setClientType] = useState<ClientType>("hogar");
  const [zone, setZone] = useState("");

  // Trabajador
  const [trade, setTrade] = useState<string>("");
  const [coverageZone, setCoverageZone] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [bio, setBio] = useState("");
  const [vIdentity, setVIdentity] = useState(false);
  const [vBackground, setVBackground] = useState(false);
  const [vLicense, setVLicense] = useState(false);

  // Mismo criterio que Login: redirect declarativo, nunca navigate() en render.
  if (user) return <Navigate to={user.role === "worker" ? "/w/home" : "/u/home"} replace />;

  const steps = role === "worker" ? WORKER_STEPS : USER_STEPS;
  const lastStep = steps.length - 1;

  const validateStep = (): boolean => {
    if (step === 0) return true;
    if (step === 1) {
      if (!name.trim()) return fail("Ingresá tu nombre");
      if (!email.trim()) return fail("Ingresá tu email");
      if (password.length < 6) return fail("La contraseña debe tener al menos 6 caracteres");
      if (!phone.trim()) return fail("Ingresá tu teléfono");
      return true;
    }
    if (step === 2) {
      if (role === "user") {
        if (!zone.trim()) return fail("Indicá tu zona");
        return true;
      }
      // worker
      if (!trade) return fail("Elegí tu oficio principal");
      if (!coverageZone.trim()) return fail("Indicá tu zona de cobertura");
      if (!hourlyRate || Number(hourlyRate) <= 0) return fail("Ingresá una tarifa por hora válida");
      return true;
    }
    return true;
  };

  const fail = (msg: string): boolean => {
    toast.error(msg);
    return false;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(lastStep, s + 1));
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const onSelectRole = (r: Role) => {
    setRole(r);
    setStep(1);
  };

  const onCreate = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        phone: phone || undefined,
        authProvider: "email",
        ...(role === "user"
          ? { clientType, zone: zone || undefined }
          : {
              trade,
              trades: trade ? [trade] : undefined,
              coverageZone: coverageZone || undefined,
              hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
              bio: bio || undefined,
              verification: { identity: vIdentity, background: vBackground, license: vLicense },
            }),
      });
      toast.success("¡Cuenta creada exitosamente!");
      navigate("/onboarding");
    } catch (err) {
      toast.error((err as Error).message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-accent-light p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto text-3xl font-extrabold text-primary">
            OFIX
          </Link>
          <CardTitle className="text-xl">Creá tu cuenta</CardTitle>
          <CardDescription>Unos pasos y ya estás dentro.</CardDescription>
          <div className="pt-4">
            <Stepper steps={steps} current={step} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Paso 0 — Tipo de cuenta */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">¿Cómo querés usar OFIX?</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onSelectRole("user")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-colors",
                    role === "user" ? "border-primary bg-primary-light" : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <User className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-semibold">Soy cliente</p>
                    <p className="text-sm text-muted-foreground">Encontrá profesional</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectRole("worker")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-colors",
                    role === "worker" ? "border-accent bg-accent-light" : "border-border hover:border-accent/50",
                  )}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light text-accent">
                    <Wrench className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-semibold">Soy trabajador</p>
                    <p className="text-sm text-muted-foreground">Ofrecé servicios</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Paso 1 — Datos */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" placeholder="Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">Mínimo 6 caracteres.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+54 9 11 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Paso 2 — Cliente: Sobre vos */}
          {step === 2 && role === "user" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de cliente</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setClientType("hogar")}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                      clientType === "hogar" ? "border-primary bg-primary-light" : "border-border hover:border-primary/50",
                    )}
                  >
                    <Home className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Hogar</p>
                      <p className="text-xs text-muted-foreground">Uso particular</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType("pyme_gastronomica")}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                      clientType === "pyme_gastronomica"
                        ? "border-primary bg-primary-light"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">PyME gastronómica</p>
                      <p className="text-xs text-muted-foreground">Bar, resto, cocina</p>
                    </div>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Zona</Label>
                <Input
                  id="zone"
                  placeholder="Ej: Palermo, CABA"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Paso 2 — Trabajador: Tu oficio */}
          {step === 2 && role === "worker" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Oficio principal</Label>
                <Select value={trade} onValueChange={setTrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elegí tu oficio" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverageZone">Zona de cobertura</Label>
                <Input
                  id="coverageZone"
                  placeholder="Ej: CABA y GBA Norte"
                  value={coverageZone}
                  onChange={(e) => setCoverageZone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Tarifa por hora (ARS)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min={0}
                  placeholder="Ej: 5000"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Descripción</Label>
                <Textarea
                  id="bio"
                  placeholder="Contá tu experiencia, especialidades y qué te diferencia."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Paso 3 — Trabajador: Verificación */}
          {step === 3 && role === "worker" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-primary-light p-4 text-primary">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">OFIX te cuida</p>
                  <p className="text-sm text-primary/80">
                    Verificarte genera más confianza con los clientes y te da acceso a más trabajos. Marcá lo que querés
                    autorizar.
                  </p>
                </div>
              </div>

              <VerificationOption
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Verificar identidad (DNI)"
                text="Validamos tu documento para confirmar quién sos."
                checked={vIdentity}
                onChange={setVIdentity}
              />
              <VerificationOption
                icon={<FileCheck className="h-5 w-5" />}
                title="Autorizo chequeo de antecedentes"
                text="Verificamos antecedentes para dar más seguridad."
                checked={vBackground}
                onChange={setVBackground}
              />
              <VerificationOption
                icon={<ScrollText className="h-5 w-5" />}
                title="Cargar matrícula / título"
                text="Sumá tu matrícula o título profesional si corresponde."
                checked={vLicense}
                onChange={setVLicense}
              />
            </div>
          )}

          {/* Navegación */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={back} disabled={loading}>
                Anterior
              </Button>
            ) : (
              <span />
            )}
            {step < lastStep ? (
              <Button type="button" onClick={next}>
                Siguiente
              </Button>
            ) : (
              <Button type="button" onClick={onCreate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            )}
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              ¿Ya tenés cuenta?{" "}
              <Link to="/auth/login" className="text-primary hover:underline">
                Iniciá sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VerificationOption({
  icon,
  title,
  text,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors",
        checked ? "border-success bg-success-light" : "border-border hover:border-success/50",
      )}
    >
      <div className={cn("mt-0.5", checked ? "text-success" : "text-muted-foreground")}>{icon}</div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 rounded border-input accent-success"
        onClick={(e) => e.stopPropagation()}
      />
    </button>
  );
}

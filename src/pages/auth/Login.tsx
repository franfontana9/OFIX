import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

const DEMO_PASSWORD = "password123";

// Todos los usuarios del seed, agrupados por rol y tipo de cliente.
const DEMO_GROUPS: { label: string; users: { name: string; email: string; detail: string }[] }[] = [
  {
    label: "Clientes",
    users: [
      { name: "María García", email: "maria@example.com", detail: "Hogar · Palermo" },
      { name: "Carlos López", email: "carlos@example.com", detail: "Hogar · Belgrano" },
      { name: "Bodegón La Esquina", email: "bodegon@example.com", detail: "PyME · San Telmo" },
      { name: "Administración Rivadavia", email: "consorcios@example.com", detail: "Consorcios · Caballito" },
    ],
  },
  {
    label: "Profesionales",
    users: [
      { name: "Juan Pérez", email: "juan@example.com", detail: "Plomería · Gold" },
      { name: "Ana Rodríguez", email: "ana@example.com", detail: "Electricidad · Silver" },
      { name: "Diego Fernández", email: "diego@example.com", detail: "Cerrajería · 24hs" },
      { name: "Lucía Martínez", email: "lucia@example.com", detail: "Pintura · Bronze" },
    ],
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  // Con sesión activa se sale de acá con <Navigate replace>. Llamar navigate()
  // en el cuerpo del componente es un efecto durante el render: React lo puede
  // reentrar y, con la guarda de ruta redirigiendo de vuelta, quedaba en loop.
  if (user) return <Navigate to={user.role === "worker" ? "/w/home" : "/u/home"} replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("¡Bienvenido de nuevo!");
      const u = useAuth.getState().user;
      navigate(u?.role === "worker" ? "/w/home" : "/u/home");
    } catch (err) {
      toast.error((err as Error).message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Carga un usuario de prueba en el formulario sin entrar todavía: se ve qué
  // credenciales se usan antes de apretar "Iniciar sesión".
  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
  };

  const onSocial = (provider: string) => {
    toast.info(`Continuar con ${provider}: próximamente`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-accent-light p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto text-3xl font-extrabold text-primary">
            OFIX
          </Link>
          <CardTitle className="text-xl">Ingresá a tu cuenta</CardTitle>
          <CardDescription>Bienvenido de nuevo, ingresá tus datos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                Recordarme
              </label>
              <Link to="/auth/forgot" className="text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">o continuá con</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" onClick={() => onSocial("Google")}>
              Continuar con Google
            </Button>
            <Button type="button" variant="outline" onClick={() => onSocial("Apple")}>
              Continuar con Apple
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              ¿No tenés cuenta?{" "}
              <Link to="/auth/register" className="text-primary hover:underline">
                Registrate aquí
              </Link>
            </p>
          </div>

          {/* Todos los usuarios del seed, con un clic para entrar directo. */}
          <div className="mt-4 rounded-lg bg-muted p-4">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold">Usuarios de prueba</p>
              <p className="text-xs text-muted-foreground">
                Contraseña: <span className="font-mono">password123</span>
              </p>
            </div>
            <div className="space-y-3">
              {DEMO_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.users.map((u) => (
                      <button
                        key={u.email}
                        type="button"
                        onClick={() => fillDemo(u.email)}
                        className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-background"
                      >
                        <span className="min-w-0">
                          <span className="font-medium">{u.name}</span>
                          <span className="block truncate text-muted-foreground">{u.email}</span>
                        </span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{u.detail}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Tocá cualquiera para cargar sus datos en el formulario.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

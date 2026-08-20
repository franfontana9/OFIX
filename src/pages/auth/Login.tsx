import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(user.role === "user" ? "/u/home" : "/w/home");
    return null;
  }

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

          <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
            <p className="mb-2 font-semibold">Usuarios de prueba:</p>
            <p className="text-muted-foreground">Usuario: maria@example.com</p>
            <p className="text-muted-foreground">Trabajador: juan@example.com</p>
            <p className="mt-1 text-muted-foreground">Contraseña: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ofix/PageHeader";
import { AvatarUploader } from "@/components/ofix/AvatarUploader";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export default function WorkerSettings() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    trades: (user?.trades && user.trades.length ? user.trades : user?.trade ? [user.trade] : []).join(", "),
    coverageZone: user?.coverageZone || "",
    hourlyRate: user?.hourlyRate != null ? String(user.hourlyRate) : "",
    bio: user?.bio || "",
  });

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.name.trim()) throw new Error("El nombre no puede estar vacío");
      const trades = form.trades
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const rate = form.hourlyRate ? parseFloat(form.hourlyRate) : undefined;
      if (form.hourlyRate && (isNaN(rate!) || rate! < 0)) throw new Error("La tarifa debe ser un número válido");
      await updateUser({
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        trades,
        trade: trades[0],
        coverageZone: form.coverageZone.trim() || undefined,
        hourlyRate: rate,
        bio: form.bio.trim() || undefined,
      });
      toast.success("Perfil actualizado");
    } catch (err) {
      toast.error((err as Error).message || "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Configuración" subtitle="Editá tu perfil profesional" back />

      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AvatarUploader
              name={user.name}
              photo={user.photo}
              onChange={(dataUrl) => {
                updateUser({ photo: dataUrl });
                toast.success("Foto actualizada");
              }}
            />

            <div className="space-y-2">
              <Label htmlFor="name">Nombre y apellido</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+54 11 ..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Tarifa por hora (ARS)</Label>
                <Input id="hourlyRate" type="number" min="0" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} placeholder="3500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trades">Oficios</Label>
              <Input id="trades" value={form.trades} onChange={(e) => setForm({ ...form, trades: e.target.value })} placeholder="Plomería, Gas" />
              <p className="text-xs text-muted-foreground">Separá varios oficios con comas.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverageZone">Zona de cobertura</Label>
              <Input id="coverageZone" value={form.coverageZone} onChange={(e) => setForm({ ...form, coverageZone: e.target.value })} placeholder="Palermo, Caballito, Villa Crespo" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Descripción</Label>
              <Textarea id="bio" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Contá tu experiencia y qué ofrecés..." />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>) : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="gap-2 text-destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

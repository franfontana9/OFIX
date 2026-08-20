import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PageHeader } from "@/components/ofix/PageHeader";
import { AvatarUploader } from "@/components/ofix/AvatarUploader";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import type { ClientType } from "@/lib/types";

export default function UserSettings() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    zone: user?.zone || "",
    address: user?.address || "",
    clientType: (user?.clientType || "hogar") as ClientType,
  });

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.name.trim()) throw new Error("El nombre no puede estar vacío");
      await updateUser({
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        zone: form.zone.trim() || undefined,
        address: form.address.trim() || undefined,
        clientType: form.clientType,
      });
      toast.success("Perfil actualizado");
      navigate("/u/profile");
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
      <PageHeader title="Configuración" subtitle="Editá tus datos personales" back />

      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-6">
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
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
              <p className="text-xs text-muted-foreground">El email no se puede modificar.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" placeholder="+54 11 ..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Zona</Label>
                <Input id="zone" placeholder="Ej: Palermo, CABA" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" placeholder="Ej: Av. Santa Fe 3200" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientType">Tipo de cliente</Label>
              <Select value={form.clientType} onValueChange={(v) => setForm({ ...form, clientType: v as ClientType })}>
                <SelectTrigger id="clientType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hogar">Hogar</SelectItem>
                  <SelectItem value="pyme_gastronomica">PyME gastronómica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>) : "Guardar cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Cuenta */}
      <Card className="mx-auto max-w-2xl">
        <CardContent className="space-y-4 pt-6">
          <div>
            <h2 className="font-semibold">Cuenta</h2>
            <p className="text-sm text-muted-foreground">Seguridad y sesión</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" value="********" disabled />
            <p className="text-xs text-muted-foreground">Cambio de contraseña próximamente.</p>
          </div>
          <Button variant="outline" className="gap-2 text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

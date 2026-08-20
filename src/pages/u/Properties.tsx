import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Building2,
  CalendarClock,
  Layers,
  MapPin,
  Pencil,
  Plus,
  StickyNote,
  Trash2,
  Wallet,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ofix/EmptyState";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StatCard } from "@/components/ofix/StatCard";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import type { Property } from "@/lib/types";

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
    : null;

interface PropertyForm {
  name: string;
  address: string;
  zone: string;
  units: string;
  notes: string;
}

const EMPTY_FORM: PropertyForm = { name: "", address: "", zone: "", units: "", notes: "" };

/**
 * Mis propiedades — segmento "administrador de consorcios" (entrevista 8 de la tesis:
 * el usuario de mayor frecuencia, que contrata oficios todos los días).
 * Cada propiedad concentra sus trabajos, su actividad y su gasto acumulado.
 */
export default function UserProperties() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, refresh] = useReducer((x: number) => x + 1, 0);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState<PropertyForm>(EMPTY_FORM);

  const properties = user ? store.getProperties(user.id) : [];
  const rows = properties.map((p) => ({ property: p, stats: store.getPropertyStats(p.id) }));

  const totals = rows.reduce(
    (acc, r) => ({
      jobs: acc.jobs + r.stats.jobs,
      active: acc.active + r.stats.active,
      spent: acc.spent + r.stats.spent,
    }),
    { jobs: 0, active: 0, spent: 0 },
  );
  const totalUnits = properties.reduce((s, p) => s + (p.units || 0), 0);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, zone: user?.zone || "" });
    setOpen(true);
  };

  const openEdit = (p: Property) => {
    setEditing(p);
    setForm({
      name: p.name,
      address: p.address,
      zone: p.zone || "",
      units: p.units ? String(p.units) : "",
      notes: p.notes || "",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const name = form.name.trim();
      const address = form.address.trim();
      if (!name || !address) throw new Error("El nombre y la dirección son obligatorios");

      let units: number | undefined;
      if (form.units.trim()) {
        const parsed = Number(form.units);
        if (!Number.isFinite(parsed) || parsed < 0) throw new Error("La cantidad de unidades no es válida");
        units = Math.round(parsed);
      }

      const data = {
        name,
        address,
        zone: form.zone.trim() || undefined,
        units,
        notes: form.notes.trim() || undefined,
      };

      if (editing) {
        store.updateProperty(editing.id, data);
        toast.success("Propiedad actualizada");
      } else {
        store.createProperty(data);
        toast.success("Propiedad agregada");
      }
      setOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo guardar la propiedad");
    }
  };

  const handleDelete = (p: Property) => {
    if (!window.confirm(`¿Eliminar "${p.name}"? Los trabajos ya registrados no se borran.`)) return;
    try {
      store.deleteProperty(p.id);
      toast.success("Propiedad eliminada");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo eliminar la propiedad");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mis propiedades"
        subtitle={
          properties.length === 0
            ? "Cargá los edificios y locales que administrás para seguir cada trabajo por dirección"
            : `${properties.length} ${properties.length === 1 ? "propiedad" : "propiedades"} bajo administración${
                totalUnits > 0 ? ` · ${totalUnits} unidades funcionales` : ""
              }`
        }
        action={
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Agregar propiedad
          </Button>
        }
      />

      {/* Consolidado de la cartera */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Building2} label="Propiedades" value={properties.length} tone="primary" hint={totalUnits > 0 ? `${totalUnits} unidades` : undefined} />
        <StatCard
          icon={Activity}
          label="Trabajos activos"
          value={totals.active}
          tone="success"
          hint={`${totals.jobs} ${totals.jobs === 1 ? "trabajo histórico" : "trabajos históricos"}`}
        />
        <StatCard icon={Wallet} label="Gasto total" value={money(totals.spent)} tone="accent" hint="Acumulado en todas las propiedades" />
      </div>

      {/* Listado */}
      {rows.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Todavía no cargaste propiedades"
          description="Si administrás consorcios o varios locales, cargá cada dirección una sola vez y después asignale las solicitudes: vas a ver el gasto y el historial de cada edificio por separado."
          action={
            <Button className="gap-2" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Agregar mi primera propiedad
            </Button>
          }
        />
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Cartera administrada</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {rows.map(({ property: p, stats }) => {
              const lastJob = fmtDate(stats.lastJobAt);
              return (
                <Card key={p.id} className="flex flex-col transition-shadow hover:shadow-lg">
                  <CardContent className="flex flex-1 flex-col gap-4 p-5">
                    {/* Identidad de la propiedad */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-semibold leading-tight">{p.name}</h3>
                          {stats.active > 0 && (
                            <Badge variant="success">
                              {stats.active} {stats.active === 1 ? "activo" : "activos"}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{p.address}</span>
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {p.zone && (
                            <Badge variant="outline" className="gap-1 font-normal">
                              <MapPin className="h-3 w-3" />
                              {p.zone}
                            </Badge>
                          )}
                          {typeof p.units === "number" && (
                            <Badge variant="outline" className="gap-1 font-normal">
                              <Layers className="h-3 w-3" />
                              {p.units} {p.units === 1 ? "unidad" : "unidades"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Métricas de la propiedad */}
                    <div className="grid grid-cols-3 divide-x rounded-lg border bg-muted/40 text-center">
                      <div className="px-2 py-3">
                        <p className="text-lg font-bold leading-none">{stats.jobs}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">Trabajos</p>
                      </div>
                      <div className="px-2 py-3">
                        <p className="text-lg font-bold leading-none">{stats.active}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">Activos</p>
                      </div>
                      <div className="px-2 py-3">
                        {/* Más chico en mobile: en 1/3 de columna un monto
                            largo se truncaba a "$20…" y se perdía el dato. */}
                        <p className="truncate text-sm font-bold leading-none sm:text-lg">{money(stats.spent)}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">Gastado</p>
                      </div>
                    </div>

                    {lastJob && (
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                        Último trabajo: {lastJob}
                      </p>
                    )}

                    {p.notes && (
                      <p className="flex items-start gap-1.5 rounded-md bg-muted/60 p-2.5 text-xs text-muted-foreground">
                        <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{p.notes}</span>
                      </p>
                    )}

                    {/* Acciones */}
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                      <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => navigate("/u/jobs")}>
                        <Wrench className="h-3.5 w-3.5" />
                        Ver trabajos
                      </Button>
                      <Button size="sm" className="flex-1 gap-1.5" onClick={() => navigate("/u/requests/new")}>
                        <Plus className="h-3.5 w-3.5" />
                        Nueva solicitud
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 shrink-0"
                        aria-label={`Editar ${p.name}`}
                        title="Editar propiedad"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Eliminar ${p.name}`}
                        title="Eliminar propiedad"
                        onClick={() => handleDelete(p)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Alta / edición */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar propiedad" : "Agregar propiedad"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Actualizá los datos del edificio. Los trabajos ya asociados se mantienen."
                : "Cargá el edificio o local una sola vez: después vas a poder asignarle solicitudes y ver su gasto."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prop-name">Nombre *</Label>
              <Input
                id="prop-name"
                placeholder="Ej: Edificio Rivadavia 5400"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prop-address">Dirección *</Label>
              <Input
                id="prop-address"
                placeholder="Ej: Av. Rivadavia 5400"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prop-zone">Zona</Label>
                <Input
                  id="prop-zone"
                  placeholder="Ej: Caballito, CABA"
                  value={form.zone}
                  onChange={(e) => setForm({ ...form, zone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prop-units">Unidades</Label>
                <Input
                  id="prop-units"
                  type="number"
                  min="0"
                  placeholder="24"
                  value={form.units}
                  onChange={(e) => setForm({ ...form, units: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prop-notes">Notas para el profesional</Label>
              <Textarea
                id="prop-notes"
                rows={3}
                placeholder="Ej: Portero de 8 a 16. Tablero general en el subsuelo."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Se las vas a poder pasar al profesional para que llegue sabiendo cómo entrar.
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editing ? "Guardar cambios" : "Agregar propiedad"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

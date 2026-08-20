import { useReducer, useState } from "react";
import {
  Building2,
  CalendarClock,
  CalendarPlus,
  MapPin,
  Pause,
  Play,
  Repeat,
  Sparkles,
  Trash2,
  UserCheck,
  Wallet,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CategoryIcon } from "@/components/ofix/CategoryIcon";
import { EmptyState } from "@/components/ofix/EmptyState";
import { PageHeader } from "@/components/ofix/PageHeader";
import { StatCard } from "@/components/ofix/StatCard";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { CATEGORIES, FREQUENCY_DAYS, FREQUENCY_LABELS, type Frequency, type RecurringPlan } from "@/lib/types";

const NONE = "none";
const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });

const fmtShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short" });

// Días que faltan (negativo = vencido, se genera en la próxima apertura de la app).
const daysUntil = (iso: string) => {
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
};

const relativeLabel = (iso: string) => {
  const d = daysUntil(iso);
  if (d < 0) return "Pendiente de generar";
  if (d === 0) return "Es hoy";
  if (d === 1) return "Mañana";
  return `En ${d} días`;
};

const inputDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

interface PlanForm {
  title: string;
  category: string;
  frequency: Frequency;
  budget: string;
  nextDate: string;
  location: string;
  propertyId: string;
  workerId: string;
  description: string;
}

const emptyForm = (zone?: string): PlanForm => ({
  title: "",
  category: "",
  frequency: "mensual",
  budget: "",
  nextDate: inputDate(7),
  location: zone || "",
  propertyId: NONE,
  workerId: NONE,
  description: "",
});

/**
 * Mantenimiento recurrente — promesa de la tesis (2.2 "programar servicios recurrentes")
 * y del modelo de negocio (2.4 "contratos de mantenimiento recurrente").
 * Cada plan publica la solicitud sola cuando llega la fecha.
 */
export default function UserRecurring() {
  const { user } = useAuth();
  const [, refresh] = useReducer((x: number) => x + 1, 0);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PlanForm>(() => emptyForm(user?.zone));

  const plans = user ? store.getRecurringPlans(user.id) : [];
  const properties = user ? store.getProperties(user.id) : [];
  const workers = store.getWorkers({});

  const active = plans.filter((p) => p.active);
  // Gasto comprometido por mes: presupuesto llevado a base 30 días según la frecuencia.
  const monthlyBudget = Math.round(
    active.reduce((s, p) => s + (p.budget * 30) / FREQUENCY_DAYS[p.frequency], 0),
  );
  const nextPlan = active[0];

  const openCreate = () => {
    setForm(emptyForm(user?.zone));
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const title = form.title.trim();
      const location = form.location.trim();
      if (!title) throw new Error("Ponele un título al plan");
      if (!form.category) throw new Error("Elegí una categoría");
      if (!location) throw new Error("Indicá la ubicación del servicio");

      const budget = Number(form.budget);
      if (!Number.isFinite(budget) || budget <= 0) throw new Error("El presupuesto tiene que ser mayor a 0");

      if (!form.nextDate) throw new Error("Elegí la próxima fecha del servicio");
      const nextDate = new Date(`${form.nextDate}T09:00:00`);
      if (Number.isNaN(nextDate.getTime())) throw new Error("La fecha elegida no es válida");

      const property = form.propertyId !== NONE ? store.getProperty(form.propertyId) : undefined;

      store.createRecurringPlan({
        title,
        category: form.category,
        frequency: form.frequency,
        budget,
        nextDate: nextDate.toISOString(),
        location,
        geo: property?.geo,
        propertyId: form.propertyId !== NONE ? form.propertyId : undefined,
        workerId: form.workerId !== NONE ? form.workerId : undefined,
        description: form.description.trim() || undefined,
      });

      toast.success("Mantenimiento programado. Se va a publicar solo cuando llegue la fecha.");
      setOpen(false);
      setForm(emptyForm(user?.zone));
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo programar el mantenimiento");
    }
  };

  const handleToggle = (plan: RecurringPlan) => {
    try {
      store.updateRecurringPlan(plan.id, { active: !plan.active });
      toast.success(plan.active ? "Plan pausado" : "Plan reactivado");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo actualizar el plan");
    }
  };

  const handleDelete = (plan: RecurringPlan) => {
    if (!window.confirm(`¿Eliminar el plan "${plan.title}"? No se van a generar más solicitudes.`)) return;
    try {
      store.deleteRecurringPlan(plan.id);
      toast.success("Plan eliminado");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "No se pudo eliminar el plan");
    }
  };

  // Selección de propiedad: autocompleta la ubicación con la dirección del edificio.
  const handleProperty = (v: string) => {
    if (v === NONE) {
      setForm({ ...form, propertyId: NONE });
      return;
    }
    const prop = store.getProperty(v);
    setForm({ ...form, propertyId: v, location: prop?.address || form.location });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mantenimiento recurrente"
        subtitle={
          plans.length === 0
            ? "Programá visitas periódicas y dejá de acordarte de llamar al plomero"
            : `${plans.length} ${plans.length === 1 ? "plan" : "planes"} · ${active.length} ${
                active.length === 1 ? "activo" : "activos"
              }`
        }
        action={
          <Button className="gap-2" onClick={openCreate}>
            <CalendarPlus className="h-4 w-4" />
            Programar mantenimiento
          </Button>
        }
      />

      {/* Cómo funciona la automatización */}
      <Card className="border-accent/30 bg-accent-light">
        <CardContent className="flex items-start gap-3 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Las solicitudes se generan automáticamente</p>
            <p className="text-sm text-muted-foreground">
              Cuando llega la fecha de un plan activo, OFIX publica la solicitud por vos, le avisa al
              profesional preferido si elegiste uno y corre la próxima visita según la frecuencia. No
              tenés que hacer nada: la vas a ver en <span className="font-medium text-foreground">Mis solicitudes</span>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Consolidado */}
      {plans.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={Repeat} label="Planes activos" value={active.length} tone="primary" hint={`${plans.length} en total`} />
          <StatCard
            icon={CalendarClock}
            label="Próximo servicio"
            value={nextPlan ? fmtShortDate(nextPlan.nextDate) : "—"}
            tone="success"
            hint={nextPlan ? relativeLabel(nextPlan.nextDate) : "Sin planes activos"}
          />
          <StatCard icon={Wallet} label="Presupuesto mensual" value={money(monthlyBudget)} tone="accent" hint="Estimado según la frecuencia" />
        </div>
      )}

      {/* Planes */}
      {plans.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="Todavía no programaste mantenimiento"
          description="Los service de aire, la limpieza de tanques o la revisión eléctrica se repiten siempre. Programalos una vez y OFIX se encarga de publicar la solicitud cada vez que toca."
          action={
            <Button className="gap-2" onClick={openCreate}>
              <CalendarPlus className="h-4 w-4" />
              Programar mi primer plan
            </Button>
          }
        />
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Planes programados</h2>
          <div className="space-y-4">
            {plans.map((plan) => {
              const property = plan.propertyId ? store.getProperty(plan.propertyId) : undefined;
              const worker = plan.workerId ? store.getWorker(plan.workerId) : null;
              const overdue = plan.active && daysUntil(plan.nextDate) < 0;
              return (
                <Card key={plan.id} className={plan.active ? "" : "bg-muted/40"}>
                  <CardContent className="space-y-4 p-5">
                    {/* Encabezado del plan */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={
                            plan.active
                              ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary"
                              : "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                          }
                        >
                          <CategoryIcon category={plan.category} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold leading-tight">{plan.title}</h3>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="font-normal">
                              {plan.category}
                            </Badge>
                            <Badge variant="secondary" className="gap-1">
                              <Repeat className="h-3 w-3" />
                              {FREQUENCY_LABELS[plan.frequency]}
                            </Badge>
                            {plan.active ? (
                              <Badge variant="success">Activo</Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                Pausado
                              </Badge>
                            )}
                            {overdue && <Badge variant="destructive">Se genera al abrir la app</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Presupuesto</p>
                        <p className="text-xl font-bold leading-tight">{money(plan.budget)}</p>
                        <p className="text-xs text-muted-foreground">por visita</p>
                      </div>
                    </div>

                    {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}

                    {/* Detalle operativo */}
                    <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
                      <div className="flex items-start gap-2.5">
                        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Próxima visita</p>
                          <p className="truncate text-sm font-medium capitalize">{fmtDate(plan.nextDate)}</p>
                          {plan.active && <p className="text-xs text-muted-foreground">{relativeLabel(plan.nextDate)}</p>}
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Ubicación</p>
                          <p className="truncate text-sm font-medium">{plan.location}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Propiedad</p>
                          <p className="truncate text-sm font-medium">{property?.name || "Sin asociar"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Profesional preferido</p>
                          <p className="truncate text-sm font-medium">{worker?.name || "Abierto a propuestas"}</p>
                        </div>
                      </div>
                    </div>

                    {plan.lastGeneratedAt && (
                      <p className="text-xs text-muted-foreground">
                        Última solicitud generada el {fmtDate(plan.lastGeneratedAt)}
                      </p>
                    )}

                    {/* Acciones */}
                    <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleToggle(plan)}>
                        {plan.active ? (
                          <>
                            <Pause className="h-3.5 w-3.5" />
                            Pausar plan
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            Reactivar plan
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(plan)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Alta de plan */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Programar mantenimiento</DialogTitle>
            <DialogDescription>
              Definí cada cuánto se repite el servicio. La solicitud se publica sola cuando llega la fecha.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-title">Título *</Label>
              <Input
                id="plan-title"
                placeholder="Ej: Service de aire acondicionado del salón"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plan-category">Categoría *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger id="plan-category">
                    <SelectValue placeholder="Seleccionar" />
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
                <Label htmlFor="plan-frequency">Frecuencia *</Label>
                <Select
                  value={form.frequency}
                  onValueChange={(v) => setForm({ ...form, frequency: v as Frequency })}
                >
                  <SelectTrigger id="plan-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => (
                      <SelectItem key={f} value={f}>
                        {FREQUENCY_LABELS[f]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plan-budget">Presupuesto por visita (ARS) *</Label>
                <Input
                  id="plan-budget"
                  type="number"
                  min="1"
                  placeholder="18000"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-date">Próxima fecha *</Label>
                <Input
                  id="plan-date"
                  type="date"
                  value={form.nextDate}
                  onChange={(e) => setForm({ ...form, nextDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-property">Propiedad (opcional)</Label>
              <Select value={form.propertyId} onValueChange={handleProperty}>
                <SelectTrigger id="plan-property">
                  <SelectValue placeholder="Sin asociar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Sin asociar</SelectItem>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {properties.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Si administrás edificios, cargalos en “Mis propiedades” para agrupar el gasto.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-location">Ubicación *</Label>
              <Input
                id="plan-location"
                placeholder="Ej: Av. Rivadavia 5400, Caballito"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-worker">Profesional preferido (opcional)</Label>
              <Select value={form.workerId} onValueChange={(v) => setForm({ ...form, workerId: v })}>
                <SelectTrigger id="plan-worker">
                  <SelectValue placeholder="Abierto a propuestas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Abierto a propuestas</SelectItem>
                  {workers.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                      {w.trade ? ` · ${w.trade}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Si elegís uno, se le avisa primero cada vez que se genera la solicitud.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-description">Descripción</Label>
              <Textarea
                id="plan-description"
                rows={3}
                placeholder="Ej: Limpieza de filtros, carga de gas y revisión de la bandeja de desagote."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Programar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

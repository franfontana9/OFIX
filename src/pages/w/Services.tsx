import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Eye, Pencil, Trash2, Power, Zap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ofix/PageHeader";
import { ServiceThumb } from "@/components/ofix/ServiceThumb";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { run } from "@/lib/run";
import type { Service } from "@/lib/types";

export default function WorkerServices() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  const services = store.getServices({ workerId: user!.id, includeInactive: true });
  const withUrgency = services.filter((s) => s.withUrgency);
  const withoutUrgency = services.filter((s) => !s.withUrgency);

  const toggle = (s: Service) => {
    if (run(() => store.updateService(s.id, { active: !s.active })) === undefined) return;
    toast.success(s.active ? "Servicio desactivado" : "Servicio activado");
    rerender();
  };

  const remove = (s: Service) => {
    if (run(() => store.deleteService(s.id)) === undefined) return;
    toast.success("Servicio eliminado");
    rerender();
  };

  const renderCard = (s: Service) => (
    <Card key={s.id} className="overflow-hidden">
      <div className="relative h-36 w-full overflow-hidden border-b">
        <ServiceThumb image={s.images?.[0]} category={s.category} />
        <Badge variant={s.active ? "success" : "secondary"} className="absolute right-2 top-2 shadow">
          {s.active ? "Activo" : "Inactivo"}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold">{s.title}</h3>
          <span className="text-sm text-muted-foreground">{s.category}</span>
        </div>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">${s.price.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{s.duration}</span>
          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{s.views} vistas</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate(`/w/services/${s.id}/edit`)}>
            <Pencil className="h-3.5 w-3.5" />Editar
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => toggle(s)}>
            <Power className="h-3.5 w-3.5" />{s.active ? "Desactivar" : "Activar"}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive" onClick={() => remove(s)}>
            <Trash2 className="h-3.5 w-3.5" />Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mis servicios"
        subtitle="Publicá tu catálogo de oficios y recibí clientes."
        action={
          <Button className="gap-2" onClick={() => navigate("/w/services/new")}>
            <Plus className="h-4 w-4" />Publicar servicio
          </Button>
        }
      />

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">Todavía no publicaste servicios</p>
            <p className="text-sm text-muted-foreground">Publicá tu primer servicio para empezar a recibir clientes.</p>
            <Button className="mt-2 gap-2" onClick={() => navigate("/w/services/new")}>
              <Plus className="h-4 w-4" />Publicar servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-destructive" />
              <h2 className="text-lg font-semibold">Ofertas de trabajo con urgencia</h2>
            </div>
            {withUrgency.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">{withUrgency.map(renderCard)}</div>
            ) : (
              <p className="text-sm text-muted-foreground">No tenés servicios con atención urgente.</p>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Ofertas de trabajo sin urgencia</h2>
            </div>
            {withoutUrgency.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">{withoutUrgency.map(renderCard)}</div>
            ) : (
              <p className="text-sm text-muted-foreground">No tenés servicios sin urgencia.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

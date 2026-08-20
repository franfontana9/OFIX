import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle, DollarSign, Calendar, FileText, Siren, CheckCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { EmptyState } from "@/components/ofix/EmptyState";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import type { Notification, NotificationType } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<NotificationType, LucideIcon> = {
  mensaje: MessageCircle,
  pago: DollarSign,
  reserva: Calendar,
  oferta: FileText,
  emergencia: Siren,
  sistema: Bell,
};

const TONES: Record<NotificationType, string> = {
  mensaje: "bg-primary-light text-primary",
  pago: "bg-success-light text-success",
  reserva: "bg-accent-light text-accent",
  oferta: "bg-primary-light text-primary",
  emergencia: "bg-destructive/10 text-destructive",
  sistema: "bg-muted text-muted-foreground",
};

type Filter = "todas" | NotificationType;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "oferta", label: "Propuestas" },
  { key: "pago", label: "Pagos" },
  { key: "reserva", label: "Reservas" },
  { key: "emergencia", label: "Emergencias" },
  { key: "sistema", label: "Sistema" },
];

const GROUPS = ["Hoy", "Esta semana", "Antes"] as const;
type Group = (typeof GROUPS)[number];

function groupFor(iso: string): Group {
  const now = new Date();
  const d = new Date(iso);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const t = d.getTime();
  if (t >= startOfToday) return "Hoy";
  if (t >= startOfToday - 6 * 24 * 60 * 60 * 1000) return "Esta semana";
  return "Antes";
}

export default function UserNotifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, setTick] = useState(0);
  const [filter, setFilter] = useState<Filter>("todas");
  const rerender = () => setTick((t) => t + 1);

  const notifications = user ? store.getNotifications(user.id) : [];
  const hasUnread = notifications.some((n) => !n.read);

  const filtered = filter === "todas" ? notifications : notifications.filter((n) => n.type === filter);

  const grouped = useMemo(() => {
    const map: Record<Group, Notification[]> = { Hoy: [], "Esta semana": [], Antes: [] };
    filtered.forEach((n) => map[groupFor(n.createdAt)].push(n));
    (Object.keys(map) as Group[]).forEach((g) =>
      map[g].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    );
    return map;
  }, [filtered]);

  const markAll = () => {
    if (!user) return;
    store.markAllNotificationsRead(user.id);
    rerender();
  };

  const open = (id: string, link?: string) => {
    store.markNotificationRead(id);
    if (link) navigate(link);
    else rerender();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificaciones"
        subtitle="Novedades de tus solicitudes, pagos y mensajes"
        action={
          hasUnread ? (
            <Button variant="outline" size="sm" className="gap-2" onClick={markAll}>
              <CheckCheck className="h-4 w-4" />
              Marcar todas como leídas
            </Button>
          ) : undefined
        }
      />

      {/* Filtro por tipo */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              filter === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No tenés notificaciones"
          description={
            filter === "todas"
              ? "Te vamos a avisar cuando haya novedades."
              : "No hay notificaciones de este tipo."
          }
        />
      ) : (
        <div className="space-y-8">
          {GROUPS.filter((g) => grouped[g].length > 0).map((g) => (
            <section key={g} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g}</h2>
              {grouped[g].map((n) => {
                const Icon = ICONS[n.type];
                return (
                  <Card
                    key={n.id}
                    className="cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => open(n.id, n.link)}
                  >
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${TONES[n.type]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={n.read ? "font-medium" : "font-semibold"}>{n.title}</p>
                          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{n.body}</p>
                        <p className="mt-1 text-xs text-muted-foreground/80">
                          {new Date(n.createdAt).toLocaleDateString("es-AR")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

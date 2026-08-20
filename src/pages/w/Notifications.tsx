import { useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, DollarSign, Calendar, FileText, Siren, Bell, Navigation, ShieldAlert, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { EmptyState } from "@/components/ofix/EmptyState";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import type { Notification, NotificationType } from "@/lib/types";

const ICONS: Record<NotificationType, LucideIcon> = {
  mensaje: MessageCircle,
  pago: DollarSign,
  reserva: Calendar,
  oferta: FileText,
  emergencia: Siren,
  seguimiento: Navigation,
  reclamo: ShieldAlert,
  sistema: Bell,
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
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const t = new Date(iso).getTime();
  if (t >= startOfToday) return "Hoy";
  if (t >= startOfToday - 6 * 24 * 60 * 60 * 1000) return "Esta semana";
  return "Antes";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function WorkerNotifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, tick] = useReducer((x) => x + 1, 0);
  const [filter, setFilter] = useState<Filter>("todas");

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

  if (!user) return null;

  const handleClick = (id: string, link?: string) => {
    store.markNotificationRead(id);
    tick();
    if (link) navigate(link);
  };

  const handleReadAll = () => {
    store.markAllNotificationsRead(user.id);
    tick();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notificaciones"
        subtitle="Tus avisos de OFIX"
        action={
          hasUnread ? (
            <Button variant="outline" size="sm" onClick={handleReadAll}>
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
            className={
              "rounded-full border px-3 py-1 text-sm transition-colors " +
              (filter === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:border-primary hover:text-primary")
            }
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
              ? "Acá vas a ver propuestas, pagos y avisos del sistema."
              : "No hay notificaciones de este tipo."
          }
        />
      ) : (
        <div className="space-y-8">
          {GROUPS.filter((g) => grouped[g].length > 0).map((g) => (
            <section key={g} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g}</h2>
              {grouped[g].map((n) => {
                const Icon = ICONS[n.type] || Bell;
                return (
                  <Card
                    key={n.id}
                    className={
                      "cursor-pointer transition-shadow hover:shadow-lg " +
                      (!n.read ? "border-primary/40 bg-primary-light/30" : "")
                    }
                    onClick={() => handleClick(n.id, n.link)}
                  >
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold">{n.title}</p>
                          {!n.read && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{n.body}</p>
                        <p className="mt-1 text-xs text-muted-foreground/80">{formatDate(n.createdAt)}</p>
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

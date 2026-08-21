import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  MapPin,
  Plus,
  ClipboardList,
  Briefcase,
  Heart,
  Calendar,
  MessageCircle,
  Bell,
  User as UserIcon,
  Building2,
  Wrench,
  Send,
  Wallet,
  TrendingUp,
  Crown,
  Repeat,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsBell } from "@/components/NotificationsBell";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { ThemeToggle } from "@/components/ofix/ThemeToggle";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const USER_NAV: NavItem[] = [
  { to: "/u/home", label: "Inicio", icon: Home },
  { to: "/u/search", label: "Buscar profesionales", icon: Search },
  { to: "/u/map", label: "Mapa de cercanos", icon: MapPin },
  { to: "/u/requests/new", label: "Nueva solicitud", icon: Plus },
  { to: "/u/requests", label: "Mis solicitudes", icon: ClipboardList },
  { to: "/u/jobs", label: "Mis contrataciones", icon: Briefcase },
  { to: "/u/favorites", label: "Favoritos", icon: Heart },
  { to: "/u/agenda", label: "Agenda", icon: Calendar },
  { to: "/u/chat", label: "Mensajes", icon: MessageCircle },
  { to: "/u/notifications", label: "Notificaciones", icon: Bell },
  { to: "/u/profile", label: "Mi perfil", icon: UserIcon },
];

// Accesos que solo aplican a algunos tipos de cliente.
const PROPERTIES_NAV: NavItem = { to: "/u/properties", label: "Mis propiedades", icon: Building2 };
const RECURRING_NAV: NavItem = { to: "/u/recurring", label: "Mantenimiento", icon: Repeat };
const BUSINESS_NAV: NavItem = { to: "/u/business", label: "Panel PyME", icon: Building2 };
const CONSORCIO_NAV: NavItem = { to: "/u/business", label: "Panel de administración", icon: Building2 };

const WORKER_NAV: NavItem[] = [
  { to: "/w/home", label: "Inicio", icon: Home },
  { to: "/w/jobs", label: "Buscar trabajos", icon: Search },
  { to: "/w/map", label: "Mapa de cercanos", icon: MapPin },
  { to: "/w/services", label: "Mis servicios", icon: Wrench },
  { to: "/w/services/new", label: "Publicar servicio", icon: Plus },
  { to: "/w/proposals", label: "Mis propuestas", icon: Send },
  { to: "/w/agreements", label: "Mis acuerdos", icon: Briefcase },
  { to: "/w/cobros", label: "Cobros", icon: Wallet },
  { to: "/w/stats", label: "Estadísticas", icon: TrendingUp },
  { to: "/w/agenda", label: "Agenda", icon: Calendar },
  { to: "/w/chat", label: "Mensajes", icon: MessageCircle },
  { to: "/w/notifications", label: "Notificaciones", icon: Bell },
  { to: "/w/profile", label: "Mi perfil", icon: UserIcon },
  { to: "/w/premium", label: "Premium", icon: Crown },
];

// Íconos del bottom nav mobile (5, según wireframe).
const USER_TABS: NavItem[] = [
  { to: "/u/home", label: "Inicio", icon: Home },
  { to: "/u/search", label: "Buscar", icon: Search },
  { to: "/u/requests/new", label: "Nueva", icon: Plus },
  { to: "/u/jobs", label: "Contratado", icon: Briefcase },
  { to: "/u/profile", label: "Perfil", icon: UserIcon },
];
const WORKER_TABS: NavItem[] = [
  { to: "/w/home", label: "Inicio", icon: Home },
  { to: "/w/jobs", label: "Trabajos", icon: Search },
  { to: "/w/services/new", label: "Publicar", icon: Plus },
  { to: "/w/agreements", label: "Acuerdos", icon: Briefcase },
  { to: "/w/profile", label: "Perfil", icon: UserIcon },
];

function OfixLogo({ className }: { className?: string }) {
  return <span className={cn("text-2xl font-extrabold tracking-tight text-primary", className)}>OFIX</span>;
}

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("ofix-sidebar") === "collapsed");
  const toggleSidebar = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("ofix-sidebar", next ? "collapsed" : "expanded");
      return next;
    });
  };
  const isWorker = user?.role === "worker";
  const nav = isWorker ? WORKER_NAV : USER_NAV;
  const tabs = isWorker ? WORKER_TABS : USER_TABS;

  // El menú del cliente cambia según el tipo: la PyME ve su panel, y el
  // administrador de consorcios además gestiona propiedades (entrevista 8).
  const isPyme = user?.role === "user" && user?.clientType === "pyme_gastronomica";
  const isAdmin = user?.role === "user" && user?.clientType === "administrador_consorcio";
  const extras: NavItem[] = [];
  if (isAdmin) extras.push(CONSORCIO_NAV, PROPERTIES_NAV, RECURRING_NAV);
  else if (isPyme) extras.push(BUSINESS_NAV, RECURRING_NAV);
  const fullNav = extras.length ? [...nav.slice(0, 6), ...extras, ...nav.slice(6)] : nav;
  const unread = user ? store.unreadCount(user.id) : 0;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r bg-card transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className={cn("flex h-16 items-center border-b", collapsed ? "justify-center px-2" : "gap-2 px-6")}>
          <button onClick={() => navigate(isWorker ? "/w/home" : "/u/home")} aria-label="Inicio">
            {collapsed ? <span className="text-2xl font-extrabold text-primary">O</span> : <OfixLogo />}
          </button>
          {!collapsed && (
            <span className="rounded bg-primary-light px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {isWorker ? "Pro" : "Cliente"}
            </span>
          )}
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-3">
          {fullNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.endsWith("/home")}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center rounded-lg py-2 text-sm font-medium transition-all",
                  collapsed ? "justify-center px-0" : "gap-3 px-3",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_4px_14px_-4px_hsl(var(--primary)/0.6)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <span className="relative">
                <Icon className="h-[18px] w-[18px]" />
                {collapsed && to.endsWith("/notifications") && unread > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-destructive" />
                )}
              </span>
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
              {!collapsed && to.endsWith("/notifications") && unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t p-3">
          <button
            onClick={toggleSidebar}
            className={cn(
              "flex w-full items-center rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              collapsed ? "justify-center px-0" : "gap-3 px-3",
            )}
            title={collapsed ? "Expandir" : "Contraer"}
          >
            {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <><PanelLeftClose className="h-[18px] w-[18px]" /> Contraer</>}
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className={cn("flex min-h-screen flex-1 flex-col transition-[padding] duration-200", collapsed ? "md:pl-16" : "md:pl-64")}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <span className="md:hidden">
              <OfixLogo className="text-xl" />
            </span>
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">Hola,</p>
              <p className="-mt-1 font-semibold">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <NotificationsBell />
            <button onClick={() => navigate(isWorker ? "/w/profile" : "/u/profile")} aria-label="Mi perfil">
              <UserAvatar name={user?.name || "?"} photo={user?.photo} className="h-9 w-9" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-8">
          <div key={location.pathname} className="animate-page mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t bg-card px-2 py-1.5 md:hidden">
        {tabs.map(({ to, label, icon: Icon }, i) => {
          const isCenter = i === 2;
          return (
            <NavLink
              key={to}
              to={to}
              end={to.endsWith("/home")}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1 text-[10px] font-medium",
                  isCenter && "relative",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              {isCenter ? (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Icon className="h-6 w-6" />
                </span>
              ) : (
                <Icon className="h-5 w-5" />
              )}
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

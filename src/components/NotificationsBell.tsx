import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

export function NotificationsBell() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const count = user ? store.unreadCount(user.id) : 0;
  const base = user?.role === "worker" ? "/w" : "/u";
  return (
    <Button variant="ghost" size="icon" className="relative" onClick={() => navigate(`${base}/notifications`)} aria-label="Notificaciones">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Button>
  );
}

import { useNavigate } from "react-router-dom";
import { MessageCircle, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

function formatTime(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  return sameDay
    ? d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

export default function WorkerChat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user) return null;

  const chats = store.getChats(user.id);

  return (
    <div className="space-y-8">
      <PageHeader title="Mensajes" subtitle="Tus conversaciones con clientes" />

      {chats.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MessageCircle className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold">No tenés conversaciones</p>
              <p className="text-sm text-muted-foreground">Cuando coordines un trabajo, tus chats van a aparecer acá.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chats.map((c) => {
            const otherId = c.participantIds.find((p) => p !== user.id);
            const other = otherId ? store.getUser(otherId) : null;
            const ctx = store.getChatContext(c.id);
            return (
              <Card
                key={c.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => navigate(`/w/chat/${c.id}`)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <UserAvatar name={other?.name || "?"} photo={other?.photo} className="h-12 w-12 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold">{other?.name || "Usuario"}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatTime(c.lastMessageAt)}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{c.lastMessage || "Sin mensajes"}</p>
                    {ctx && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Briefcase className="h-3 w-3 shrink-0" />
                        <span className="truncate">Sobre: {ctx.label}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

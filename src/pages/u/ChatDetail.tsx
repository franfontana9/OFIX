import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Paperclip, Briefcase, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { useAuth } from "@/lib/auth";
import { fileToResizedDataUrl } from "@/lib/image";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = ["Coordinar horario", "¿Seguís disponible?", "Comparto ubicación"];

export default function UserChatDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [, setTick] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const chat = id ? store.getChat(id) : undefined;
  const messages = id ? store.getMessages(id) : [];
  const otherId = chat?.participantIds.find((p) => p !== user?.id);
  const other = otherId ? store.getUser(otherId) : null;
  const ctx = id ? store.getChatContext(id) : null;

  // Refrescar para capturar la auto-respuesta del store (a los 3s).
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typing]);

  if (!chat || !id) {
    return (
      <div>
        <PageHeader title="Conversación" back />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No encontramos esta conversación.
          </CardContent>
        </Card>
      </div>
    );
  }

  // El último índice donde el otro respondió: los propios previos se consideran "leídos".
  let lastOtherIndex = -1;
  messages.forEach((m, i) => {
    if (m.authorId !== user?.id) lastOtherIndex = i;
  });
  // Índice del último mensaje propio (para mostrar el recibo debajo).
  let lastMineIndex = -1;
  messages.forEach((m, i) => {
    if (m.authorId === user?.id) lastMineIndex = i;
  });

  const dispatch = (value: string, image?: string) => {
    const v = value.trim();
    if (!v && !image) return;
    store.createMessage(id, v, image);
    // Indicador "escribiendo…" del otro lado antes de la auto-respuesta (a los 3s).
    setTyping(true);
    window.setTimeout(() => setTyping(false), 2800);
    setTick((t) => t + 1);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(text);
    setText("");
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      // Se redimensiona antes de guardar: el adjunto vive en localStorage.
      const image = await fileToResizedDataUrl(file);
      dispatch(text.trim(), image);
      setText("");
    } catch (err) {
      toast.error((err as Error).message || "No se pudo adjuntar la foto");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "70vh" }}>
      <PageHeader
        title={other?.name || "Conversación"}
        back
        action={<UserAvatar name={other?.name || "?"} photo={other?.photo} className="h-10 w-10" />}
      />

      {ctx && (
        <button
          type="button"
          onClick={() => {
            if (ctx.jobId) navigate(`/u/jobs/${ctx.jobId}`);
            else if (ctx.offerId) navigate(`/u/requests/${ctx.offerId}`);
          }}
          className="mb-3 flex w-full items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
        >
          <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">
            <span className="text-muted-foreground">Sobre: </span>
            <span className="font-medium">{ctx.label}</span>
          </span>
        </button>
      )}

      {/* Mensajes */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {messages.map((m, i) => {
          const mine = m.authorId === user?.id;
          const read = mine && i < lastOtherIndex;
          const showReceipt = mine && i === lastMineIndex;
          return (
            <div key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                  mine ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                {m.image && (
                  <a href={m.image} target="_blank" rel="noreferrer" className="mb-1.5 block">
                    <img
                      src={m.image}
                      alt="Foto adjunta"
                      className="max-h-64 w-full rounded-lg object-cover"
                      loading="lazy"
                    />
                  </a>
                )}
                {m.text && <p className="whitespace-pre-wrap break-words">{m.text}</p>}
                <p className={cn("mt-1 text-[10px]", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {new Date(m.ts).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {showReceipt && (
                <span className={cn("mt-0.5 text-[10px]", read ? "text-primary" : "text-muted-foreground")}>
                  {read ? "Leído ✓✓" : "Enviado ✓"}
                </span>
              )}
            </div>
          );
        })}

        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Acciones rápidas */}
      <div className="flex flex-wrap gap-2 pb-2">
        {QUICK_ACTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setText(q)}
            className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={send} className="sticky bottom-0 flex items-center gap-2 border-t bg-background pt-3">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="Adjuntar foto"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
        </Button>
        <Input
          placeholder="Escribí un mensaje..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

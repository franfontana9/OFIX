import { useEffect, useReducer, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Paperclip, Briefcase, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ofix/PageHeader";
import { useAuth } from "@/lib/auth";
import { fileToResizedDataUrl } from "@/lib/image";
import { store } from "@/lib/store";

const QUICK_ACTIONS = ["Coordinar horario", "¿Seguís disponible?", "Comparto ubicación"];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export default function WorkerChatDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, tick] = useReducer((x) => x + 1, 0);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const chat = id ? store.getChat(id) : undefined;
  const messages = id ? store.getMessages(id) : [];
  const otherId = chat?.participantIds.find((p) => p !== user?.id);
  const other = otherId ? store.getUser(otherId) : null;
  const ctx = id ? store.getChatContext(id) : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typing]);

  if (!id || !chat || !user) {
    return (
      <div>
        <PageHeader title="Conversación" back />
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No se encontró la conversación.
          </CardContent>
        </Card>
      </div>
    );
  }

  // Último mensaje del otro: los propios anteriores se consideran "leídos".
  let lastOtherIndex = -1;
  messages.forEach((m, i) => {
    if (m.authorId !== user.id) lastOtherIndex = i;
  });
  let lastMineIndex = -1;
  messages.forEach((m, i) => {
    if (m.authorId === user.id) lastMineIndex = i;
  });

  const dispatch = (value: string, image?: string) => {
    const v = value.trim();
    if (!v && !image) return;
    store.createMessage(id, v, image);
    tick();
    // Indicador "escribiendo…" del otro lado antes de la auto-respuesta (a los ~3s).
    setTyping(true);
    window.setTimeout(() => setTyping(false), 2800);
    // El store responde automáticamente a los ~3s: refrescamos para verlo.
    window.setTimeout(() => tick(), 3200);
  };

  const handleSend = (e: React.FormEvent) => {
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
    <div className="flex flex-col">
      <PageHeader title={other?.name || "Conversación"} subtitle="Coordiná los detalles del trabajo" back />

      {ctx && (
        <button
          type="button"
          onClick={() => {
            if (ctx.jobId) navigate(`/w/agreements/${ctx.jobId}`);
            else if (ctx.offerId) navigate(`/w/jobs/${ctx.offerId}`);
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

      <Card className="flex h-[60vh] flex-col">
        <CardContent className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Todavía no hay mensajes. ¡Escribí el primero!</p>
          )}
          {messages.map((m, i) => {
            const mine = m.authorId === user.id;
            const read = mine && i < lastOtherIndex;
            const showReceipt = mine && i === lastMineIndex;
            return (
              <div key={m.id} className={"flex flex-col " + (mine ? "items-end" : "items-start")}>
                <div
                  className={
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm " +
                    (mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")
                  }
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
                  <p className={"mt-1 text-[10px] " + (mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {formatTime(m.ts)}
                  </p>
                </div>
                {showReceipt && (
                  <span className={"mt-0.5 text-[10px] " + (read ? "text-primary" : "text-muted-foreground")}>
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
        </CardContent>

        {/* Acciones rápidas */}
        <div className="flex flex-wrap gap-2 border-t px-3 pt-3">
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

        <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-3">
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
          <Button type="submit" size="icon" disabled={!text.trim()} aria-label="Enviar">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}

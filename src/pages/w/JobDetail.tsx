import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Calendar, Wallet, Star, Loader2, Siren, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ofix/PageHeader";
import { UrgencyBadge, ProposalStatusBadge } from "@/components/ofix/badges";
import { UserAvatar } from "@/components/ofix/UserAvatar";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

export default function WorkerJobDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ price: "", message: "", availability: "" });

  const offer = id ? store.getOffer(id) : undefined;

  if (!offer) {
    return (
      <div>
        <PageHeader title="Solicitud no encontrada" back />
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Esta solicitud no existe o fue eliminada.
          </CardContent>
        </Card>
      </div>
    );
  }

  const client = store.getUser(offer.authorId);
  const existing = store.getProposals({ offerId: offer.id, workerId: user!.id });
  const alreadySent = existing.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.price || !form.message) throw new Error("Completá precio y mensaje");
      const price = parseFloat(form.price);
      if (isNaN(price) || price <= 0) throw new Error("El precio debe ser mayor a 0");
      store.createProposal({
        offerId: offer.id,
        workerId: user!.id,
        message: form.message,
        price,
        availability: form.availability || undefined,
      });
      toast.success("¡Propuesta enviada! El cliente la va a revisar.");
      navigate("/w/proposals");
    } catch (err) {
      toast.error((err as Error).message || "Error al enviar la propuesta");
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    const chat = store.createChat(user!.id, offer.authorId);
    navigate(`/w/chat/${chat.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={offer.title} subtitle={offer.category} back />

      {offer.emergency && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4 text-destructive">
            <Siren className="h-5 w-5" />
            <p className="text-sm font-medium">Solicitud de emergencia — el cliente necesita atención lo antes posible.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Detalle */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>Detalle del trabajo</CardTitle>
                <UrgencyBadge urgency={offer.urgency} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-line text-sm text-muted-foreground">{offer.description}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-muted-foreground" />{offer.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-muted-foreground" />{new Date(offer.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><Wallet className="h-4 w-4 text-muted-foreground" />Presupuesto: <strong>${offer.budget.toLocaleString()}</strong></span>
              </div>
              {offer.images && offer.images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Fotos del problema</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {offer.images.map((src, i) => (
                      <a key={i} href={src} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-lg border">
                        <img
                          src={src}
                          alt={`Foto ${i + 1}`}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.parentElement!.style.display = "none"; }}
                          className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Propuesta */}
          {alreadySent ? (
            <Card>
              <CardHeader>
                <CardTitle>Tu propuesta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <ProposalStatusBadge status={existing[0].status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Precio ofertado</span>
                  <span className="font-semibold">${existing[0].price.toLocaleString()}</span>
                </div>
                <p className="rounded-lg bg-muted p-3 text-sm">{existing[0].message}</p>
                {existing[0].availability && <p className="text-sm text-muted-foreground">Disponibilidad: {existing[0].availability}</p>}
                <p className="text-xs text-muted-foreground">Ya enviaste una propuesta para esta solicitud.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Enviar oferta</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Tu precio (ARS) *</Label>
                    <Input id="price" type="number" min="1" placeholder="4500" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje al cliente *</Label>
                    <Textarea id="message" rows={4} placeholder="Contale cómo vas a resolver el trabajo, tu experiencia, garantías..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availability">Disponibilidad</Label>
                    <Input id="availability" placeholder="Ej: Hoy 15-18hs" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full gap-2">
                    {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />Enviando...</>) : (<><Send className="h-4 w-4" />Enviar propuesta</>)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Cliente */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <UserAvatar name={client?.name ?? "Cliente"} photo={client?.photo} />
                <div>
                  <p className="font-medium">{client?.name ?? "Cliente"}</p>
                  {client?.zone && <p className="text-sm text-muted-foreground">{client.zone}</p>}
                </div>
              </div>
              {client?.rating != null && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-medium">{client.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({client.reviewCount ?? 0} reseñas)</span>
                </div>
              )}
              <Button variant="outline" className="w-full gap-2" onClick={handleMessage}>
                <MessageSquare className="h-4 w-4" />
                Enviar mensaje
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

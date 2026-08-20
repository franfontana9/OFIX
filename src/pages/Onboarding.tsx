import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Camera,
  ShieldCheck,
  Star,
  UserCog,
  Wrench,
  Send,
  Wallet,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

interface Slide {
  icon: LucideIcon;
  title: string;
  text: string;
}

const CLIENT_SLIDES: Slide[] = [
  {
    icon: Search,
    title: "Encontrá el profesional que necesitás",
    text: "Buscá por oficio y zona, compará perfiles verificados y elegí con confianza.",
  },
  {
    icon: Camera,
    title: "Publicá tu urgencia con fotos",
    text: "Describí el problema y sumá imágenes para recibir presupuestos más precisos.",
  },
  {
    icon: ShieldCheck,
    title: "Pagá seguro dentro de la app",
    text: "Tu dinero queda protegido y se libera solo cuando confirmás que el trabajo está hecho.",
  },
  {
    icon: Star,
    title: "Calificá y guardá favoritos",
    text: "Puntuá el servicio y guardá a tus profesionales de confianza para la próxima.",
  },
];

const WORKER_SLIDES: Slide[] = [
  {
    icon: UserCog,
    title: "Completá tu perfil y verificación",
    text: "Un perfil verificado genera más confianza y te ayuda a conseguir más trabajos.",
  },
  {
    icon: Wrench,
    title: "Publicá tus servicios",
    text: "Mostrá tus oficios, tarifas y horarios para que los clientes te encuentren.",
  },
  {
    icon: Send,
    title: "Recibí solicitudes y enviá propuestas",
    text: "Respondé rápido a las urgencias de tu zona y ganá más oportunidades.",
  },
  {
    icon: Wallet,
    title: "Cobrá en tu billetera",
    text: "Recibí tus pagos de forma segura y retirá tus fondos cuando quieras.",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);

  const isWorker = user?.role === "worker";
  const slides = isWorker ? WORKER_SLIDES : CLIENT_SLIDES;
  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;

  const finish = () => navigate(isWorker ? "/w/home" : "/u/home");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-accent-light p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-2xl font-extrabold text-primary">OFIX</span>
            <Button variant="ghost" size="sm" onClick={finish}>
              Omitir
            </Button>
          </div>

          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-light text-primary">
              <Icon className="h-10 w-10" />
            </div>
            <h1 className="mb-3 text-2xl font-bold">{slide.title}</h1>
            <p className="max-w-sm text-muted-foreground">{slide.text}</p>
          </div>

          {/* Dots */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Ir al paso ${i + 1}`}
                onClick={() => setStep(i)}
                className={
                  "h-2 rounded-full transition-all " +
                  (i === step ? "w-6 bg-primary" : "w-2 bg-muted")
                }
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Anterior
            </Button>
            {isLast ? (
              <Button className="gap-2" onClick={finish}>
                Empezar
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="gap-2" onClick={() => setStep((s) => s + 1)}>
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

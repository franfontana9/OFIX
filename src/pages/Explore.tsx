import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { WorkerCard } from "@/components/ofix/WorkerCard";
import { EmptyState } from "@/components/ofix/EmptyState";
import { store } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";

const ALL = "__all__";

// Exploración pública (sin login). Al contactar, se pide registro.
export default function Explore() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>(ALL);

  const workers = useMemo(
    () => store.getWorkers({ q: q || undefined, category: cat === ALL ? undefined : cat }),
    [q, cat],
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary">OFIX</Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/auth/login")}>Ingresar</Button>
            <Button onClick={() => navigate("/auth/register")}>Registrarse</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Profesionales verificados</h1>
          <p className="mt-1 text-muted-foreground">Explorá oficios cerca tuyo. Registrate cuando quieras contactar a alguien.</p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar por nombre u oficio…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="sm:w-56"><SelectValue placeholder="Categoría" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas las categorías</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <p className="mb-3 text-sm text-muted-foreground">{workers.length} profesionales</p>
        {workers.length === 0 ? (
          <EmptyState icon={Search} title="No encontramos profesionales" description="Probá con otra categoría o término de búsqueda." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {workers.map((w) => (
              <WorkerCard key={w.id} worker={w} showFavorite={false} onClick={() => navigate(`/p/${w.id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

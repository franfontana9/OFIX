import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string
  status?: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  onSelect?: (id: string) => void;
}

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

// Clave local YYYY-MM-DD (evita corrimientos por zona horaria).
function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function statusBadgeVariant(status?: string): "default" | "success" | "destructive" | "accent" | "secondary" {
  switch (status) {
    case "completado":
      return "success";
    case "cancelado":
      return "destructive";
    case "en_progreso":
      return "default";
    case "agendado":
      return "accent";
    default:
      return "secondary";
  }
}

function statusLabel(status?: string): string {
  const map: Record<string, string> = {
    agendado: "Agendado",
    en_progreso: "En progreso",
    completado: "Completado",
    cancelado: "Cancelado",
  };
  return status ? map[status] ?? status : "—";
}

export function Calendar({ events, onSelect }: CalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Eventos agrupados por día (clave local).
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const d = new Date(ev.date);
      if (Number.isNaN(d.getTime())) continue;
      const key = dayKey(d);
      const arr = map.get(key);
      if (arr) arr.push(ev);
      else map.set(key, [ev]);
    }
    return map;
  }, [events]);

  // Grilla de celdas (semana empieza lunes).
  const cells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    // getDay(): 0=Dom..6=Sáb → índice con lunes primero.
    const leading = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;
    const start = new Date(year, month, 1 - leading);
    return Array.from({ length: totalCells }, (_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return d;
    });
  }, [viewDate]);

  const monthLabel = viewDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  const todayKey = dayKey(today);

  const selectedEvents = selectedKey ? eventsByDay.get(selectedKey) ?? [] : [];

  const goPrev = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    setSelectedKey(null);
  };
  const goNext = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    setSelectedKey(null);
  };
  const goToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedKey(todayKey);
  };

  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold capitalize sm:text-lg">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={goToday}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={goPrev} aria-label="Mes anterior">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goNext} aria-label="Mes siguiente">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="mb-1 grid grid-cols-7 gap-1 sm:gap-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-center text-xs font-medium text-muted-foreground">
            {w}
          </div>
        ))}
      </div>

      {/* Grilla de días */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((d) => {
          const key = dayKey(d);
          const inMonth = d.getMonth() === viewDate.getMonth();
          const isToday = key === todayKey;
          const dayEvents = eventsByDay.get(key) ?? [];
          const hasEvents = dayEvents.length > 0;
          const hasCompleted = dayEvents.some((e) => e.status === "completado");
          const isSelected = key === selectedKey;

          return (
            <button
              type="button"
              key={key}
              disabled={!hasEvents}
              onClick={() => hasEvents && setSelectedKey(isSelected ? null : key)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-lg border text-sm transition-colors",
                inMonth ? "text-foreground" : "text-muted-foreground/40",
                hasEvents ? "cursor-pointer hover:bg-muted" : "cursor-default border-transparent",
                hasEvents && inMonth && "border-border bg-muted/40",
                isToday && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary",
              )}
            >
              <span className={cn("leading-none", isToday && !isSelected && "font-semibold text-primary")}>
                {d.getDate()}
              </span>
              {hasEvents && (
                <span
                  className={cn(
                    "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                    isSelected ? "bg-primary-foreground" : hasCompleted ? "bg-success" : "bg-primary",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Eventos del día seleccionado */}
      {selectedKey && selectedEvents.length > 0 && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <p className="text-sm font-medium capitalize text-muted-foreground">
            {new Date(`${selectedKey}T00:00:00`).toLocaleDateString("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          {selectedEvents.map((ev) => (
            <button
              type="button"
              key={ev.id}
              onClick={() => onSelect?.(ev.id)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border bg-background p-3 text-left transition-shadow hover:shadow-md"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{ev.title}</span>
              <Badge variant={statusBadgeVariant(ev.status)}>{statusLabel(ev.status)}</Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Calendar;

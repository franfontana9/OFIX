import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Indicador de pasos para wizards (registro, onboarding).
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  done && "bg-success text-success-foreground",
                  active && "bg-primary text-primary-foreground",
                  !done && !active && "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("hidden text-sm sm:inline", active ? "font-semibold" : "text-muted-foreground")}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className={cn("h-0.5 w-6 rounded", done ? "bg-success" : "bg-muted")} />}
          </div>
        );
      })}
    </div>
  );
}

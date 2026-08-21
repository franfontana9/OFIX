import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Card accionable, alcanzable con el teclado.
 *
 * Un `<Card onClick={...}>` a secas no recibe foco, no responde a Enter ni a
 * Espacio y un lector de pantalla no la anuncia como accionable: para quien no
 * usa mouse, esa tarjeta no existe. Como las cards son el elemento principal de
 * navegación de la app (trabajador, propiedad, trabajo, plan), esto deja fuera
 * los caminos centrales.
 *
 * Suma `role="button"`, `tabIndex`, el manejo de Enter/Espacio y el anillo de
 * foco que ya define `index.css`.
 */
export function ClickableCard({
  onClick,
  children,
  className,
  label,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  /** Texto para lectores de pantalla, si el contenido no alcanza. */
  label?: string;
  disabled?: boolean;
}) {
  return (
    <Card
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (disabled) return;
        // Espacio hace scroll por defecto: hay que frenarlo.
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "text-left transition-shadow",
        disabled ? "cursor-default opacity-60" : "glow-hover cursor-pointer",
        className,
      )}
    >
      {children}
    </Card>
  );
}

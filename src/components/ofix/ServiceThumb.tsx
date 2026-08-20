import { useState } from "react";
import { categoryIcon } from "./CategoryIcon";
import { cn } from "@/lib/utils";

// Miniatura de un servicio: usa la primera foto, o un placeholder por categoría.
export function ServiceThumb({
  image,
  category,
  className,
}: {
  image?: string;
  category: string;
  className?: string;
}) {
  const Icon = categoryIcon(category);
  const [failed, setFailed] = useState(false);
  if (image && !failed) {
    return (
      <img
        src={image}
        alt={category}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <div className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-light to-accent-light text-primary", className)}>
      <Icon className="h-8 w-8 opacity-70" />
    </div>
  );
}

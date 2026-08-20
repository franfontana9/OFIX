import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Sube fotos (se guardan como data URLs base64 en localStorage). Máx configurable.
export function ImageUploader({
  images,
  onChange,
  max = 4,
  className,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
  max?: number;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = max - images.length;
    const toRead = Array.from(files).slice(0, remaining);
    if (files.length > remaining) toast.error(`Máximo ${max} fotos`);
    toRead.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => onChange([...images, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {images.map((src, i) => (
        <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border">
          <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(images.filter((_, j) => j !== i))}
            className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 text-destructive hover:bg-background"
            aria-label="Eliminar foto"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      {images.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-[10px]">Agregar</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}

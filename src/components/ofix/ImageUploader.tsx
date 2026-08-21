import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { fileToResizedDataUrl } from "@/lib/image";
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
  const [busy, setBusy] = useState(false);

  // Las fotos se guardan como data URL en localStorage, así que hay que
  // redimensionarlas: sin esto, tres fotos de celular sin tocar llenaban la
  // cuota de ~5 MB del navegador y a partir de ahí fallaba TODA la escritura.
  // Es el mismo tratamiento que ya recibían los adjuntos del chat.
  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = max - images.length;
    if (remaining <= 0) {
      toast.error(`Máximo ${max} fotos`);
      return;
    }
    const toRead = Array.from(files).slice(0, remaining);
    if (files.length > remaining) toast.error(`Se agregan ${remaining}: el máximo es ${max} fotos`);

    setBusy(true);
    // De a una y acumulando sobre el array anterior: con forEach + onload
    // paralelos, cada callback partía del mismo `images` y se pisaban entre sí,
    // así que al elegir varias fotos juntas solo entraba la última.
    let next = [...images];
    for (const file of toRead) {
      try {
        next = [...next, await fileToResizedDataUrl(file)];
      } catch (err) {
        toast.error((err as Error).message || "No se pudo procesar la imagen");
      }
    }
    onChange(next);
    setBusy(false);
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
          disabled={busy}
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          <span className="text-[10px]">{busy ? "Procesando" : "Agregar"}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { void handleFiles(e.target.files); e.target.value = ""; }} />
    </div>
  );
}

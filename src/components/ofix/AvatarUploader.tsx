import { useRef } from "react";
import { Camera } from "lucide-react";
import { UserAvatar } from "./UserAvatar";

// Selector de una sola foto de perfil (se guarda como data URL base64).
export function AvatarUploader({
  name,
  photo,
  onChange,
}: {
  name: string;
  photo?: string;
  onChange: (dataUrl: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const handle = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <UserAvatar name={name} photo={photo} className="h-20 w-20 text-xl" />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow hover:bg-primary/90"
          aria-label="Cambiar foto"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>
      <div className="text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Foto de perfil</p>
        <p>Subí una foto para generar más confianza.</p>
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => handle(e.target.files)} />
    </div>
  );
}

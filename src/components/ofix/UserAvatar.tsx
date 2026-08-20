import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserAvatar({
  name,
  photo,
  className,
}: {
  name: string;
  photo?: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("h-10 w-10", className)}>
      {photo && <AvatarImage src={photo} alt={name} />}
      <AvatarFallback className="bg-primary-light font-semibold text-primary">{initials(name || "?")}</AvatarFallback>
    </Avatar>
  );
}

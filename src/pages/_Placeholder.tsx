import { Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder temporal mientras se implementan las pantallas del rebuild.
export default function Placeholder() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
          <Wrench className="h-7 w-7" />
        </div>
        <p className="font-medium">Pantalla en construcción</p>
        <p className="text-sm">Estamos armando esta sección de OFIX.</p>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isDark, toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(isDark());
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setDark(toggleTheme())}
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

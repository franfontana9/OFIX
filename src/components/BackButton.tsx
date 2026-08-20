import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function BackButton() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const goHome = () => {
    navigate(user ? (user.role === "user" ? "/u/home" : "/w/home") : "/");
  };
  return (
    <Button variant="ghost" size="sm" onClick={goHome} className="gap-2">
      <ArrowLeft className="h-4 w-4" />
      Volver al inicio
    </Button>
  );
}

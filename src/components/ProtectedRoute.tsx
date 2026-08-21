import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";

/**
 * Guarda de ruta por autenticación y rol.
 *
 * Redirige SOLO con `<Navigate replace>`. Antes hacía las dos cosas a la vez:
 * un `useEffect` con `navigate()` imperativo y además este `<Navigate>`. Eso
 * disparaba dos navegaciones por cada render bloqueado y, como el `navigate()`
 * no llevaba `replace`, cada intento apilaba una entrada de historial: con la
 * pantalla de login navegando en render del otro lado, el ida y vuelta no
 * terminaba nunca y la pestaña quedaba congelada.
 */
export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: Role;
}) {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const user = useAuth((s) => s.user);

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === "worker" ? "/w/home" : "/u/home"} replace />;
  }
  return <>{children}</>;
}

import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";

export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: Role;
}) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    } else if (requiredRole && user?.role !== requiredRole) {
      navigate(user?.role === "user" ? "/u/home" : "/w/home");
    }
  }, [isAuthenticated, user, requiredRole, navigate]);

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (requiredRole && user?.role !== requiredRole)
    return <Navigate to={user?.role === "user" ? "/u/home" : "/w/home"} replace />;
  return <>{children}</>;
}

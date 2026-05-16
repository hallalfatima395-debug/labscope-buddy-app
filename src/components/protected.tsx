import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, dashboardPathForRole, type Role } from "@/hooks/use-auth";

export function Protected({ role, children }: { role: Role; children: ReactNode }) {
  const { session, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      void navigate({ to: "/login" });
      return;
    }
    if (!profile || profile.statut !== "accepte") {
      void navigate({ to: "/login" });
      return;
    }
    if (profile.role !== role) {
      void navigate({ to: dashboardPathForRole(profile.role) });
    }
  }, [loading, session, profile, role, navigate]);

  if (loading || !session || !profile || profile.role !== role || profile.statut !== "accepte") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  return <>{children}</>;
}
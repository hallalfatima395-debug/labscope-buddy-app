import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth, dashboardPathForRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LabScope — Lab management platform" },
      { name: "description", content: "LabScope: manage your lab members, roles, and approvals." },
    ],
  }),
});

function Index() {
  const { session, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!session || !profile || profile.statut !== "accepte") {
      void navigate({ to: "/login" });
    } else {
      void navigate({ to: dashboardPathForRole(profile.role) });
    }
  }, [loading, session, profile, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Chargement…</p>
    </main>
  );
}

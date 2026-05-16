import { createFileRoute } from "@tanstack/react-router";
import { Protected } from "@/components/protected";
import { DashboardShell } from "@/components/dashboard-shell";

export const Route = createFileRoute("/dashboard/admin")({
  component: () => (
    <Protected role="admin">
      <DashboardShell title="Espace Administrateur" />
    </Protected>
  ),
});
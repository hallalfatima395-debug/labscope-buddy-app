import { createFileRoute } from "@tanstack/react-router";
import { Protected } from "@/components/protected";
import { DashboardShell } from "@/components/dashboard-shell";

export const Route = createFileRoute("/dashboard/directeur")({
  component: () => (
    <Protected role="directeur">
      <DashboardShell title="Espace Directeur" />
    </Protected>
  ),
});
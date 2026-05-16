import { createFileRoute } from "@tanstack/react-router";
import { Protected } from "@/components/protected";
import { DashboardShell } from "@/components/dashboard-shell";

export const Route = createFileRoute("/dashboard/chercheur")({
  component: () => (
    <Protected role="enseignant">
      <DashboardShell title="Espace Chercheur" />
    </Protected>
  ),
});
import { createFileRoute } from "@tanstack/react-router";
import { Protected } from "@/components/protected";
import { DashboardShell } from "@/components/dashboard-shell";

export const Route = createFileRoute("/dashboard/doctorant")({
  component: () => (
    <Protected role="doctorant">
      <DashboardShell title="Espace Doctorant" />
    </Protected>
  ),
});
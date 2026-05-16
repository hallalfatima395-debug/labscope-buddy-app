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

*** Add File: src/routes/dashboard.directeur.tsx
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

*** Add File: src/routes/dashboard.chercheur.tsx
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

*** Add File: src/routes/dashboard.doctorant.tsx
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
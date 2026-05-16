import { createFileRoute } from "@tanstack/react-router";
import { Protected } from "@/components/protected";
import { Outlet } from "@tanstack/react-router";
import { DirecteurLayout } from "@/components/directeur-layout";

export const Route = createFileRoute("/dashboard/directeur")({
  component: () => (
    <Protected role="directeur">
      <DirecteurLayout>
        <Outlet />
      </DirecteurLayout>
    </Protected>
  ),
});
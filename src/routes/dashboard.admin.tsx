import { createFileRoute } from "@tanstack/react-router";
import { Protected } from "@/components/protected";
import { Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";

export const Route = createFileRoute("/dashboard/admin")({
  component: () => (
    <Protected role="admin">
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </Protected>
  ),
});
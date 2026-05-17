import { createFileRoute, Outlet } from "@tanstack/react-router";
import { User, BookOpen, ClipboardList } from "lucide-react";
import { Protected } from "@/components/protected";
import { RoleLayout, type NavItem } from "@/components/role-layout";

const items: ReadonlyArray<NavItem> = [
  { title: "Mon profil", url: "/dashboard/chercheur", icon: User },
  { title: "Mes publications", url: "/dashboard/chercheur/publications", icon: BookOpen },
  { title: "Mon bilan", url: "/dashboard/chercheur/bilan", icon: ClipboardList },
];

export const Route = createFileRoute("/dashboard/chercheur")({
  component: () => (
    <Protected role="enseignant">
      <RoleLayout title="Espace Chercheur" roleLabel="Chercheur" items={items}>
        <Outlet />
      </RoleLayout>
    </Protected>
  ),
});
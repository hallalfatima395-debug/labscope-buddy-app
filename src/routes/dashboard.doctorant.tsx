import { createFileRoute, Outlet } from "@tanstack/react-router";
import { User, BookOpen, ClipboardList, GraduationCap } from "lucide-react";
import { Protected } from "@/components/protected";
import { RoleLayout, type NavItem } from "@/components/role-layout";

const items: ReadonlyArray<NavItem> = [
  { title: "Mon profil", url: "/dashboard/doctorant", icon: User },
  { title: "Mes publications", url: "/dashboard/doctorant/publications", icon: BookOpen },
  { title: "Mon bilan", url: "/dashboard/doctorant/bilan", icon: ClipboardList },
  { title: "Ma thèse", url: "/dashboard/doctorant/these", icon: GraduationCap },
];

export const Route = createFileRoute("/dashboard/doctorant")({
  component: () => (
    <Protected role="doctorant">
      <RoleLayout title="Espace Doctorant" roleLabel="Doctorant" items={items}>
        <Outlet />
      </RoleLayout>
    </Protected>
  ),
});